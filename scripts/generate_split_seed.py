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

    if rows and len(rows[0]) > 0:
        first_col = rows[0][0]
        second_col = rows[0][1] if len(rows[0]) > 1 else ""
        if "ID" in first_col or "案件名" in first_col or "案件名" in second_col:
            rows.pop(0)

    jobs_data = []
    all_skills = set()
    roles_registry = {} 
    locations_registry = {} 

    # 1. Pre-populate default roles for hierarchy
    for key, info in HEURISTIC_ROLES.items():
        p_name = info['parent']
        if p_name not in roles_registry:
            roles_registry[p_name] = {'id': generate_uuid(), 'parent_id': None}
        r_name = info['name']
        if r_name not in roles_registry:
            roles_registry[r_name] = {'id': generate_uuid(), 'parent_id': roles_registry[p_name]['id']}

    print(f"Analyzing {len(rows)} records...")

    for i, row in enumerate(rows):
        if len(row) < 7: continue
        
        if len(row) >= 8:
            job_code_raw = row[0]
            title_raw = row[1]
            tech_skills_raw = row[2]
            price_raw = row[3]
            location_raw = row[4]
            summary_raw = row[5]
            env_raw = row[6]
            req_raw = row[7]
        else:
            job_code_raw = f"JOB-{i+1:05d}"
            title_raw = row[0]
            tech_skills_raw = row[1]
            price_raw = row[2]
            location_raw = row[3]
            summary_raw = row[4]
            env_raw = row[5]
            req_raw = row[6]
        
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

        norm_loc = '東京'
        if location_raw:
             for loc_key, keywords in HEURISTIC_LOCATIONS.items():
                for kw in keywords:
                    if kw in location_raw:
                        norm_loc = loc_key.capitalize()
                        break
        
        if norm_loc not in locations_registry:
            locations_registry[norm_loc] = generate_uuid()
        loc_id = locations_registry[norm_loc]

        work_style = 'onsite'
        if 'リモート' in location_raw or 'リモート' in req_raw:
            if 'フル' in location_raw or 'フル' in req_raw:
                work_style = 'remote'
            else:
                work_style = 'hybrid'

        min_p = 0
        max_p = 0
        price_digits = re.findall(r'(\d+)', price_raw.replace(',', ''))
        if price_digits:
            vals = [int(v) for v in price_digits]
            vals = [v * 10000 if v < 2000 else v for v in vals]
            if len(vals) >= 2:
                min_p, max_p = vals[0], vals[1]
            elif len(vals) == 1:
                v = vals[0]
                min_p, max(0, v - 50000)
                max_p = v + 50000
        
        title = title_raw.strip()
        if not title: title = 'エンジニア案件'
        
        SKILL_NORMALIZATION_MAP = {
            'Java': ['java', 'jdk', 'jee', 'j2ee', 'spring boot', 'springboot'],
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
            'React': ['react', 'react.js', 'reactjs', 'next.js', 'nextjs'],
            'Vue.js': ['vue', 'vue.js', 'vuejs', 'nuxt', 'nuxtjs'],
            'Angular': ['angular', 'angularjs'],
            'Laravel': ['laravel'],
            'Spring': ['spring', 'spring boot', 'springboot', 'spring mvc'],
            'Django': ['django'],
            'Flask': ['flask'],
            'Ruby on Rails': ['rails', 'ruby on rails'],
            'Flutter': ['flutter', 'dart'],
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

        ALIAS_TO_CANONICAL = {}
        for canonical, aliases in SKILL_NORMALIZATION_MAP.items():
            ALIAS_TO_CANONICAL[canonical.lower()] = canonical
            for alias in aliases:
                ALIAS_TO_CANONICAL[alias.lower()] = canonical

        skills = []
        raw_skills = [s.strip() for s in re.split('[,、\n]', tech_skills_raw) if s.strip()]
        for s in raw_skills:
            clean_s = re.sub(r'\(.*?\)|（.*?）', '', s).strip()
            if not clean_s: continue
            
            s_lower = clean_s.lower()
            normalized_name = None
            
            if s_lower in ALIAS_TO_CANONICAL:
                normalized_name = ALIAS_TO_CANONICAL[s_lower]
            else:
                for alias, canonical in ALIAS_TO_CANONICAL.items():
                    if len(alias) >= 2 and alias in s_lower:
                        normalized_name = canonical
                        break
            
            if normalized_name:
                if normalized_name not in skills:
                    skills.append(normalized_name)
                    all_skills.add(normalized_name)
            else:
                if len(clean_s) < 30:
                    if clean_s not in skills:
                        skills.append(clean_s)
                        all_skills.add(clean_s)

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

    # --- Generate Split SQL Files ---
    
    def write_chunk(filename, lines):
        path = os.path.join(os.getcwd(), 'supabase', filename)
        with open(path, 'w', encoding='utf-8') as f:
            f.write("\n".join(lines))
        print(f"Created {filename}")

    # Part 1: Masters
    chunk1 = []
    chunk1.append("-- Split Part 1: Masters & Truncate")
    chunk1.append("BEGIN;")
    chunk1.append("TRUNCATE TABLE public.job_skills CASCADE;")
    chunk1.append("TRUNCATE TABLE public.jobs CASCADE;")
    chunk1.append("TRUNCATE TABLE public.skills CASCADE;")
    chunk1.append("TRUNCATE TABLE public.roles CASCADE;")
    chunk1.append("TRUNCATE TABLE public.locations CASCADE;")
    chunk1.append("")

    if locations_registry:
        chunk1.append("-- Locations")
        loc_values = []
        LOC_NORM_MAP = {'Tokyo': '東京', 'Kanagawa': '神奈川', 'Chiba': '千葉', 'Saitama': '埼玉', 'Osaka': '大阪'}
        seen_ids = set()
        for name, id in locations_registry.items():
            disp_name = LOC_NORM_MAP.get(name, name)
            slug = re.sub(r'[^a-z0-9]', '-', name.lower()) or 'loc'
            if id not in seen_ids:
                loc_values.append(f"('{id}', '日本', '{disp_name}', '{slug}')")
                seen_ids.add(id)
        chunk1.append("INSERT INTO public.locations (id, region, name, slug) VALUES\n" + ",\n".join(loc_values) + ";\n")

    if roles_registry:
        chunk1.append("-- Roles")
        role_values = []
        for name, info in roles_registry.items():
            slug = re.sub(r'[^a-z0-0]', '-', name.lower()) or 'role'
            p_id = f"'{info['parent_id']}'" if info['parent_id'] else "NULL"
            role_values.append(f"('{info['id']}', {p_id}, '{name}', '{slug}', 0)")
        chunk1.append("INSERT INTO public.roles (id, parent_id, name, slug, sort_order) VALUES\n" + ",\n".join(role_values) + ";\n")

    if all_skills:
        chunk1.append("-- Skills")
        skill_values = []
        for name in list(all_skills)[:500]:
            id = generate_uuid()
            SKILLS_CACHE[name] = id
            slug = re.sub(r'[^a-z0-9]', '-', name.lower()) or 'sk'
            skill_values.append(f"('{id}', '{name.replace('''''' , '''''')}', '{slug}-{id[:4]}', 0)")
        chunk1.append("INSERT INTO public.skills (id, name, slug, sort_order) VALUES\n" + ",\n".join(skill_values) + ";\n")
    
    chunk1.append("COMMIT;")
    write_chunk('seed_01_masters.sql', chunk1)

    # Part 2+: Jobs
    JOB_CHUNK_SIZE = 300
    file_idx = 2
    for i in range(0, len(jobs_data), JOB_CHUNK_SIZE):
        chunk_jobs = jobs_data[i:i + JOB_CHUNK_SIZE]
        rows = []
        rows.append(f"-- Split Part {file_idx}: Jobs ({i+1} to {i+len(chunk_jobs)})")
        rows.append("BEGIN;")
        
        BATCH_SIZE = 50
        for j in range(0, len(chunk_jobs), BATCH_SIZE):
            batch = chunk_jobs[j:j+BATCH_SIZE]
            vals = []
            for job in batch:
                vals.append(f"('{job['id']}', '{job['job_code']}', '{job['title']}', '{job['role_id']}', '{job['location_id']}', '{job['work_style']}', {job['price_min']}, {job['price_max']}, '{job['description_md']}', '{job['requirements_md']}', 'published', true, now())")
            rows.append("INSERT INTO public.jobs (id, job_code, title, role_id, location_id, work_style, price_min, price_max, description_md, requirements_md, status, is_active, created_at) VALUES\n" + ",\n".join(vals) + ";\n")
        
        rows.append("COMMIT;")
        write_chunk(f'seed_{file_idx:02d}_jobs.sql', rows)
        file_idx += 1

    # Final Part: Job Skills
    job_skill_values = []
    for job in jobs_data:
        unique_skills = set()
        for sk_name in job['skills']:
            sid = SKILLS_CACHE.get(sk_name)
            if sid and sid not in unique_skills:
                unique_skills.add(sid)
                job_skill_values.append(f"('{job['id']}', '{sid}')")
    
    if job_skill_values:
        skill_chunk_size = 2000 
        for k in range(0, len(job_skill_values), skill_chunk_size):
            chunk = job_skill_values[k:k+skill_chunk_size]
            rows = []
            rows.append(f"-- Split Part {file_idx}: Job Skills ({k+1} to {k+len(chunk)})")
            rows.append("BEGIN;")
            for m in range(0, len(chunk), 100):
                subchunk = chunk[m:m+100]
                rows.append("INSERT INTO public.job_skills (job_id, skill_id) VALUES\n" + ",\n".join(subchunk) + ";\n")
            rows.append("COMMIT;")
            write_chunk(f'seed_{file_idx:02d}_relations.sql', rows)
            file_idx += 1

    print(f"Success: Split data into {file_idx-1} files.")

if __name__ == "__main__":
    main()
