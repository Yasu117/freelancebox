import csv
import uuid
import os
import datetime
import re
import sys

# --- Helper Functions ---

def generate_uuid():
    return str(uuid.uuid4())

# --- Mappings & Constants for Heuristics ---

HEURISTIC_ROLES = {
    'frontend': {'name': 'Frontend', 'parent': 'Engineer', 'keywords': ['frontend', 'react', 'vue', 'angular', 'next.js', 'typescript', 'フロントエンド', 'html', 'css', 'javascript']},
    'backend': {'name': 'Backend', 'parent': 'Engineer', 'keywords': ['backend', 'java', 'php', 'python', 'go', 'ruby', 'node.js', 'laravel', 'spring', 'back-end', 'サーバーサイド', 'バックエンド']},
    'infra': {'name': 'Infrastructure/SRE', 'parent': 'Engineer', 'keywords': ['infra', 'aws', 'azure', 'gcp', 'linux', 'network', 'server', 'ネットワーク', 'サーバー', 'インフラ', 'sre', '仮想基盤', 'vmware', 'vdi', 'ansible', 'active directory', 'ad', 'checkpoint', 'l3', 'l2', 'fw']},
    'pm': {'name': 'PM/Director', 'parent': 'General', 'keywords': ['pm', 'project manager', 'director', 'pmo', 'マネージャー', 'リーダー', 'ディレクター']},
}

HEURISTIC_LOCATIONS = {
    'tokyo': ['東京', '渋谷', '新宿', '六本木', '品川', '丸の内', '大手町', '西葛西', '神谷町', '飯田橋', '東中野', '勝どき', '浜松町', '秋葉原', '大崎', '吉祥寺', '池袋', '虎ノ門', '赤坂', '銀座', '日本橋'],
    'kanagawa': ['神奈川', '横浜', '川崎', '武蔵小杉', 'yrp野比', '溝の口'],
    'chiba': ['千葉', '船橋', '柏', '幕張', '西船橋'],
    'saitama': ['埼玉', '大宮', '浦和', '川口'],
    'osaka': ['大阪', '梅田', '難波', '淀屋橋'],
}

SKILLS_CACHE = {} # name -> uuid

def main():
    # Use the real user file
    csv_path = os.path.join(os.getcwd(), 'Tech@DB_ver1.2 - to FB.csv')
    if not os.path.exists(csv_path):
        print(f"Error: CSV file not found at {csv_path}")
        sys.exit(1)
        
    try:
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            rows = list(reader)
    except Exception as e:
        print(f"Error reading CSV: {e}")
        sys.exit(1)

    if not rows:
        print("Error: CSV file is empty")
        sys.exit(1)

    # Header is skipped implicitly by logic or handled if needed, assuming user row 1 is data? 
    # Actually usually row 1 is header. Let's pop it safely if it looks like a header.
    # Simple heuristic: is the first column "ID" or "案件名"? check column 1 for title if needed
    if rows and len(rows[0]) > 0:
        first_col = rows[0][0]
        second_col = rows[0][1] if len(rows[0]) > 1 else ""
        if "ID" in first_col or "案件名" in first_col or "案件名" in second_col:
            rows.pop(0)

    jobs_data = []
    all_skills = set()
    roles_registry = {} # name -> {id, parent_id}
    locations_registry = {} # name -> id (norm name like '東京')

    # Header: ID, 案件名, 技術スキル, 金額, 勤務地, 案件概要, 開発環境, 募集条件
    
    # 1. Pre-populate default roles for hierarchy
    for key, info in HEURISTIC_ROLES.items():
        # Ensure parent exists
        p_name = info['parent']
        if p_name not in roles_registry:
            roles_registry[p_name] = {'id': generate_uuid(), 'parent_id': None}
        
        # Add specific role
        r_name = info['name']
        if r_name not in roles_registry:
            roles_registry[r_name] = {'id': generate_uuid(), 'parent_id': roles_registry[p_name]['id']}

    print(f"Analyzing {len(rows)} records...")

    for i, row in enumerate(rows):
        if len(row) < 7: continue
        
        # New Column Mapping
        if len(row) >= 8:
            # Has ID column
            job_code_raw = row[0]
            title_raw = row[1]
            tech_skills_raw = row[2]
            price_raw = row[3]
            location_raw = row[4]
            summary_raw = row[5] # 案件概要
            env_raw = row[6]     # 開発環境
            req_raw = row[7]     # 募集条件
        else:
            # No ID column (7 cols)
            job_code_raw = f"JOB-{i+1:05d}"
            title_raw = row[0]
            tech_skills_raw = row[1]
            price_raw = row[2]
            location_raw = row[3]
            summary_raw = row[4]
            env_raw = row[5]
            req_raw = row[6]
        
        # --- A. Smart Parsing: Role ---
        combined_text = (title_raw + " " + tech_skills_raw + " " + summary_raw).lower()
        role_id = roles_registry['Backend']['id'] # Default
        found_role = False
        for key, info in HEURISTIC_ROLES.items():
            if found_role: break
            for kw in info['keywords']:
                if kw.lower() in combined_text:
                    role_id = roles_registry[info['name']]['id']
                    found_role = True
                    break

        # --- B. Smart Parsing: Location ---
        norm_loc = '東京'
        # Parse from Location column first
        if location_raw:
             for loc_key, keywords in HEURISTIC_LOCATIONS.items():
                for kw in keywords:
                    if kw in location_raw:
                        norm_loc = loc_key.capitalize()
                        break
        
        if norm_loc not in locations_registry:
            locations_registry[norm_loc] = generate_uuid()
        loc_id = locations_registry[norm_loc]

        # --- C. Smart Parsing: Work Style ---
        work_style = 'onsite'
        if 'リモート' in location_raw or 'リモート' in req_raw:
            if 'フル' in location_raw or 'フル' in req_raw:
                work_style = 'remote'
            else:
                work_style = 'hybrid'

        # --- D. Smart Parsing: Price ---
        min_p = 0
        max_p = 0
        
        # Handle "70万円程度" -> 65-75 or 70-70?
        # Normalize: find all numbers
        price_digits = re.findall(r'(\d+)', price_raw.replace(',', ''))
        if price_digits:
            vals = [int(v) for v in price_digits]
            # Normalize to yen (if < 2000 assume man-yen)
            vals = [v * 10000 if v < 2000 else v for v in vals]
            
            if len(vals) >= 2:
                min_p, max_p = vals[0], vals[1]
            elif len(vals) == 1:
                v = vals[0]
                min_p = max(0, v - 50000)
                max_p = v + 50000
        
        if min_p == 0: min_p = 0
        if max_p == 0: max_p = 0

        # --- E. Parsing: Title ---
        title = title_raw.strip()
        if not title: title = 'エンジニア案件' # Fallback
        
        # --- F. Skills Cleaning & Normalization ---
        # Define Canonical Skills (must match JobFilter.tsx) and their aliases/keywords
        # Format: 'Canonical Name': ['alias1', 'alias2', 'substring_match']
        SKILL_NORMALIZATION_MAP = {
            # Languages
            'Java': ['java', 'jdk', 'jee', 'j2ee', 'spring boot', 'springboot'], # SpringBoot implies Java context usually
            'PHP': ['php', 'laravel', 'cakephp', 'symfony'],
            'Python': ['python', 'django', 'flask', 'pandas', 'numpy'],
            'Ruby': ['ruby', 'rails', 'ruby on rails'],
            'Go言語': ['go', 'golang', 'go言語'],
            'JavaScript': ['javascript', 'js', 'es6', 'jquery', 'node.js', 'nodejs', 'express'],
            'TypeScript': ['typescript', 'ts'],
            'HTML5': ['html', 'html5'],
            'CSS3': ['css', 'css3', 'sass', 'scss'],
            'SQL': ['sql', 'mysql', 'postgresql', 'postgres', 'oracle', 'sql server', 'mssql'],
            'C#': ['c#', '.net', 'csharp', 'unity'],
            'C++': ['c++', 'cpp', 'vc++'],
            'Swift': ['swift', 'ios'],
            'Kotlin': ['kotlin', 'android'],
            
            # Frameworks / Libs
            'React': ['react', 'react.js', 'reactjs', 'next.js', 'nextjs'], # Next implies React
            'Vue.js': ['vue', 'vue.js', 'vuejs', 'nuxt', 'nuxtjs'],
            'Angular': ['angular', 'angularjs'],
            'Laravel': ['laravel'],
            'Spring': ['spring', 'spring boot', 'springboot', 'spring mvc'],
            'Django': ['django'],
            'Flask': ['flask'],
            'Ruby on Rails': ['rails', 'ruby on rails'],
            'Flutter': ['flutter', 'dart'],
            
            # Infra & Cloud
            'AWS': ['aws', 'amazon web services', 'ec2', 's3', 'rds', 'lambda', 'ecs', 'eks', 'cloudwatch', 'cloudfront', 'aurora', 'dynamodb', 'fargate'],
            'Microsoft Azure': ['azure', 'aks', 'entra id', 'active directory'],
            'Google Cloud Platform(GCP)': ['gcp', 'google cloud', 'bigquery', 'gke', 'firebase'],
            'Linux': ['linux', 'rhel', 'centos', 'ubuntu', 'redhat', 'unix', 'shell', 'bash'],
            'WindowsServer': ['windows', 'windows server', 'wsus', 'powershell', 'ad', 'active directory'],
            'Docker': ['docker', 'container'],
            'Kubernetes': ['kubernetes', 'k8s'],
            'Terraform': ['terraform', 'iac'],
            'Ansible': ['ansible'],
            'CircleCI': ['circleci'],
            'Jenkins': ['jenkins'],
            'GitHub': ['github', 'git'],
            
            # Other / Tools
            'Salesforce': ['salesforce', 'sfa', 'crm', 'apex'],
            'SAP': ['sap', 'abap', 'erp'],
            'Slack': ['slack'],
            'Jira': ['jira'],
            'Tableau': ['tableau'],
            'VMware': ['vmware', 'vsphere', 'esxi', 'vcenter'],
            'Nutanix': ['nutanix'],
            'JP1': ['jp1'],
            'ServiceNow': ['servicenow']
        }

        # Inverse Map for easier lookup: alias -> Canonical
        ALIAS_TO_CANONICAL = {}
        for canonical, aliases in SKILL_NORMALIZATION_MAP.items():
            # Add exact lower case match of canonical itself
            ALIAS_TO_CANONICAL[canonical.lower()] = canonical
            for alias in aliases:
                ALIAS_TO_CANONICAL[alias.lower()] = canonical

        skills = []
        raw_skills = [s.strip() for s in re.split('[,、\n]', tech_skills_raw) if s.strip()]
        for s in raw_skills:
            # 1. Basic clean
            clean_s = re.sub(r'\(.*?\)|（.*?）', '', s).strip()
            if not clean_s: continue
            
            # 2. Normalization Check
            s_lower = clean_s.lower()
            normalized_name = None
            
            # Direct match or Alias match
            if s_lower in ALIAS_TO_CANONICAL:
                normalized_name = ALIAS_TO_CANONICAL[s_lower]
            else:
                # Partial match check (e.g. "AWS構築" -> matches "aws")
                # We check if any alias is contained INSIDE the skill string
                for alias, canonical in ALIAS_TO_CANONICAL.items():
                    # Simple heuristic: alias must be at least 2 chars to avoid noise like 'c' matching 'cut'
                    if len(alias) >= 2 and alias in s_lower:
                        normalized_name = canonical
                        break
            
            # 3. Add to list
            if normalized_name:
                if normalized_name not in skills:
                    skills.append(normalized_name)
                    all_skills.add(normalized_name)
            else:
                # Keep original if no match found, but limit length
                if len(clean_s) < 30:
                    if clean_s not in skills:
                        skills.append(clean_s)
                        all_skills.add(clean_s)

        # --- G. Construction with Enhanced Formatting ---
        
        # description_md includes Summary and Tech Stack
        formatted_desc = f"""
## 【案件概要】
{summary_raw}

### 【開発環境】
{env_raw}
"""

        formatted_req = f"""
## 【募集要項・条件】
{req_raw}
"""

        jobs_data.append({
            'id': generate_uuid(),
            'job_code': job_code_raw.strip(),
            'title': title.replace("'", "''"),
            'role_id': role_id,
            'location_id': loc_id,
            'work_style': work_style,
            'price_min': min_p,
            'price_max': max_p,
            'description_md': formatted_desc.replace("'", "''").strip(),
            'requirements_md': formatted_req.replace("'", "''").strip(),
            'skills': skills
        })

    # --- Generate SQL ---
    
    current_time = datetime.datetime.now().isoformat()
    sql_parts = []
    
    sql_parts.append(f"-- Auto-generated Seed File (Smart Heuristics Version)")
    sql_parts.append(f"-- Records Processed: {len(jobs_data)}")
    sql_parts.append(f"-- Generated at: {current_time}")
    sql_parts.append("")
    sql_parts.append("BEGIN;")
    sql_parts.append("TRUNCATE TABLE public.job_skills CASCADE;")
    sql_parts.append("TRUNCATE TABLE public.jobs CASCADE;")
    sql_parts.append("TRUNCATE TABLE public.skills CASCADE;")
    sql_parts.append("TRUNCATE TABLE public.roles CASCADE;")
    sql_parts.append("TRUNCATE TABLE public.locations CASCADE;")
    sql_parts.append("")

    # Locations
    if locations_registry:
        sql_parts.append("-- Locations")
        loc_values = []
        # Normalization map for output
        LOC_NORM_MAP = {'Tokyo': '東京', 'Kanagawa': '神奈川', 'Chiba': '千葉', 'Saitama': '埼玉', 'Osaka': '大阪'}
        
        seen_ids = set()
        for name, id in locations_registry.items():
            disp_name = LOC_NORM_MAP.get(name, name)
            slug = re.sub(r'[^a-z0-9]', '-', name.lower()) or 'loc' # keep slug consistent-ish
            if id not in seen_ids:
                loc_values.append(f"('{id}', '日本', '{disp_name}', '{slug}')")
                seen_ids.add(id)
        sql_parts.append("INSERT INTO public.locations (id, region, name, slug) VALUES\n" + ",\n".join(loc_values) + ";\n")

    # Roles
    if roles_registry:
        sql_parts.append("-- Roles")
        role_values = []
        for name, info in roles_registry.items():
            slug = re.sub(r'[^a-z0-0]', '-', name.lower()) or 'role'
            p_id = f"'{info['parent_id']}'" if info['parent_id'] else "NULL"
            role_values.append(f"('{info['id']}', {p_id}, '{name}', '{slug}', 0)")
        sql_parts.append("INSERT INTO public.roles (id, parent_id, name, slug, sort_order) VALUES\n" + ",\n".join(role_values) + ";\n")

    # Skills
    if all_skills:
        sql_parts.append("-- Skills")
        skill_values = []
        for name in list(all_skills)[:500]: # Cap skills to 500 for seed safety
            id = generate_uuid()
            SKILLS_CACHE[name] = id
            slug = re.sub(r'[^a-z0-9]', '-', name.lower()) or 'sk'
            skill_values.append(f"('{id}', '{name.replace('''''' , '''''')}', '{slug}-{id[:4]}', 0)")
        sql_parts.append("INSERT INTO public.skills (id, name, slug, sort_order) VALUES\n" + ",\n".join(skill_values) + ";\n")

    # Jobs
    if jobs_data:
        sql_parts.append("-- Jobs")
        # INSERT in chunks of 50 to avoid potential SQL length limits in some editors
        chunk_size = 50
        for i in range(0, len(jobs_data), chunk_size):
            chunk = jobs_data[i:i + chunk_size]
            vals = []
            for j in chunk:
                vals.append(f"('{j['id']}', '{j['job_code']}', '{j['title']}', '{j['role_id']}', '{j['location_id']}', '{j['work_style']}', {j['price_min']}, {j['price_max']}, '{j['description_md']}', '{j['requirements_md']}', 'published', true, now())")
            sql_parts.append("INSERT INTO public.jobs (id, job_code, title, role_id, location_id, work_style, price_min, price_max, description_md, requirements_md, status, is_active, created_at) VALUES\n" + ",\n".join(vals) + ";\n")

    # Job Skills
    job_skill_values = []
    for job in jobs_data:
        # Deduplicate skills for this job to avoid unique constraint violations
        unique_skills = set()
        for sk_name in job['skills']:
            sid = SKILLS_CACHE.get(sk_name)
            if sid and sid not in unique_skills:
                unique_skills.add(sid)
                job_skill_values.append(f"('{job['id']}', '{sid}')")
    if job_skill_values:
        sql_parts.append("-- Job Skills Mapping")
        # Also chunk this
        for i in range(0, len(job_skill_values), 100):
            chunk = job_skill_values[i:i + 100]
            sql_parts.append("INSERT INTO public.job_skills (job_id, skill_id) VALUES\n" + ",\n".join(chunk) + ";\n")

    sql_parts.append("COMMIT;")

    output_path = os.path.join(os.getcwd(), 'supabase/seed.sql')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(sql_parts))

    print(f"Success: Processed {len(jobs_data)} jobs.")
    print(f"Generated {len(all_skills)} unique skills.")
    print(f"Seed file: {output_path}")

if __name__ == "__main__":
    main()
