import csv
import uuid
import os
import datetime
import re
import sys

# --- Helper Functions ---

def generate_uuid():
    return str(uuid.uuid4())

# --- Mappings & Constants ---

ROLES_MAP = {
    'frontend': {'id': 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'name': 'Frontend Engineer', 'keywords': ['Frontend', 'React', 'Vue', 'Angular', 'Next.js', 'Typescript', 'HTML', 'CSS']},
    'backend': {'id': 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'name': 'Backend Engineer', 'keywords': ['Backend', 'Java', 'PHP', 'Python', 'Go', 'Ruby', 'Node.js', 'Laravel', 'Spring']},
    'fullstack': {'id': 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'name': 'Fullstack Engineer', 'keywords': ['Fullstack', 'フルスタック']},
    'sre': {'id': 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'name': 'SRE / Infrastructure', 'keywords': ['SRE', 'Infrastructure', 'AWS', 'Azure', 'GCP', 'Linux', 'Network', 'Server', 'ネットワーク', 'サーバー', 'インフラ']},
    'pm': {'id': 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'name': 'Project Manager', 'keywords': ['PM', 'Project Manager', 'Director', 'PMO', 'マネージャー', 'リーダー']}
}

LOCATIONS_MAP = {
    'tokyo': {'id': 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'name': '東京', 'region': '関東', 'keywords': ['東京', '渋谷', '新宿', '六本木', '品川', '丸の内', '大手町', '西葛西', '神谷町', '飯田橋', '東中野', '勝どき', '浜松町', '秋葉原', '大崎', '吉祥寺', '日本大通り', '多摩', '池袋']},
    'kanagawa': {'id': 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'name': '神奈川', 'region': '関東', 'keywords': ['神奈川', '横浜', '川崎', '武蔵小杉']},
    'osaka': {'id': 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'name': '大阪', 'region': '関西', 'keywords': ['大阪', '梅田', '難波']},
    'remote': {'id': 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'name': 'フルリモート', 'region': '全国', 'keywords': ['フルリモート']}
}

SKILLS_CACHE = {} # name -> uuid

# --- Main Logic ---

def main():
    csv_path = os.path.join(os.getcwd(), 'Tech@DB - to FB.csv')
    try:
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            rows = list(reader)
    except FileNotFoundError:
        print(f"Error: CSV file not found at {csv_path}")
        sys.exit(1)

    if not rows:
        print("Error: CSV file is empty")
        sys.exit(1)

    # Remove header
    header = rows.pop(0) # ["技術スキル", "その他特徴", "金額", "要約"]

    jobs_data = []
    all_skills = set()

    for row in rows:
        if len(row) < 4:
            continue

        tech_skills_raw = row[0]
        other_features = row[1]
        price_raw = row[2]
        summary_raw = row[3]

        # 1. Parse Skills
        skill_names = [s.strip() for s in re.split('[,、]', tech_skills_raw) if s.strip()]
        # Filter (simple)
        skill_names = [s for s in skill_names if '期間' not in s and '場所' not in s]
        
        for s in skill_names:
            all_skills.add(s)

        # 2. Parse Role
        role_id = ROLES_MAP['backend']['id']
        role_found = False
        combined_text = (tech_skills_raw + ' ' + other_features + ' ' + summary_raw).lower()

        for key, role in ROLES_MAP.items():
            if role_found: break
            for kw in role['keywords']:
                if kw.lower() in combined_text:
                    role_id = role['id']
                    role_found = True
                    break
        
        # 3. Parse Price
        min_price = 0
        max_price = 0
        
        price_text = price_raw.replace(',', '')
        price_match = re.findall(r'(\d+)', price_text)
        
        if price_match:
            if len(price_match) == 1:
                val = int(price_match[0])
                if '〜' in price_text or '~' in price_text:
                    if price_text.strip().startswith('~') or price_text.strip().startswith('〜'):
                        max_price = val
                        min_price = max(0, val - 10)
                    else:
                        min_price = val
                        max_price = val + 10
                else:
                    min_price = max(0, val - 5)
                    max_price = val + 5
            elif len(price_match) >= 2:
                min_price = int(price_match[0])
                max_price = int(price_match[1])

        # Normalize to Yen (if < 200 assume Man Yen)
        if min_price > 0 and min_price < 200: min_price = min_price * 10000
        if max_price > 0 and max_price < 200: max_price = max_price * 10000

        # 4. Parse Location
        location_id = LOCATIONS_MAP['tokyo']['id']
        location_found = False
        
        for key, loc in LOCATIONS_MAP.items():
            if location_found: break
            for kw in loc['keywords']:
                if kw in other_features or kw in summary_raw:
                    location_id = loc['id']
                    location_found = True
                    break

        # 5. Work Style
        work_style = 'onsite'
        if 'フルリモート' in other_features or 'フルリモート' in summary_raw:
            work_style = 'remote'
        elif 'リモート' in other_features or '週' in other_features or 'リモート' in summary_raw:
            work_style = 'hybrid'

        # 6. Title extraction
        title = ''
        name_match = re.search(r'案件名[:：]([^,、\n]+)', other_features) or re.search(r'案件名[:：]([^,、\n]+)', summary_raw)
        
        if name_match:
            title = name_match.group(1).strip()
        else:
            title = re.split(r'[。.]', summary_raw)[0]
            if len(title) > 50:
                title = title[:47] + '...'
            if not title:
                title = tech_skills_raw.split(',')[0] + '開発案件' if tech_skills_raw else '開発案件'

        # 7. Clean descriptions
        description_md = summary_raw.replace('"', '').replace("'", "")
        requirements_md = other_features.replace('"', '').replace("'", "")

        jobs_data.append({
            'id': generate_uuid(),
            'title': title.replace("'", "''"),
            'role_id': role_id,
            'location_id': location_id,
            'work_style': work_style,
            'price_min': min_price,
            'price_max': max_price,
            'description_md': description_md,
            'requirements_md': requirements_md,
            'skills': skill_names
        })

    # --- Generate SQL ---
    
    current_time = datetime.datetime.now().isoformat()
    sql_parts = []
    
    sql_parts.append(f"-- Auto-generated Seed File")
    sql_parts.append(f"-- Generated at: {current_time}")
    sql_parts.append("")
    sql_parts.append("-- 1. Truncate Tables")
    sql_parts.append("TRUNCATE TABLE public.job_skills CASCADE;")
    sql_parts.append("TRUNCATE TABLE public.jobs CASCADE;")
    sql_parts.append("TRUNCATE TABLE public.skills CASCADE;")
    sql_parts.append("TRUNCATE TABLE public.roles CASCADE;")
    sql_parts.append("TRUNCATE TABLE public.locations CASCADE;")
    sql_parts.append("TRUNCATE TABLE public.articles CASCADE;")
    sql_parts.append("TRUNCATE TABLE public.article_tags CASCADE;")
    sql_parts.append("")
    sql_parts.append("-- 2. Insert Masters")
    sql_parts.append("")
    sql_parts.append("-- Roles")
    sql_parts.append("INSERT INTO public.roles (id, name, slug, sort_order) VALUES")
    
    roles_values = []
    for i, r in enumerate(ROLES_MAP.values()):
        slug = r['name'].lower().replace(' / ', '-').replace(' ', '-')
        roles_values.append(f"('{r['id']}', '{r['name']}', '{slug}', {i})")
    sql_parts.append(",\n".join(roles_values) + ";")
    sql_parts.append("")

    # Locations
    sql_parts.append("INSERT INTO public.locations (id, region, name, slug) VALUES")
    loc_values = []
    for key, l in LOCATIONS_MAP.items():
        slug = key
        loc_values.append(f"('{l['id']}', '{l['region']}', '{l['name']}', '{slug}')")
    sql_parts.append(",\n".join(loc_values) + ";")
    sql_parts.append("")

    # Skills
    sql_parts.append("INSERT INTO public.skills (id, name, slug) VALUES")
    skill_list = list(all_skills)
    skill_values = []
    for name in skill_list:
        id = generate_uuid()
        slug = re.sub(r'[^a-z0-9]', '-', name.lower())
        if not slug: slug = 'skill-' + id[:8]
        SKILLS_CACHE[name] = id
        safe_name = name.replace("'", "''")
        skill_values.append(f"('{id}', '{safe_name}', '{slug}-{id[:4]}')")
    
    if skill_values:
        sql_parts.append(",\n".join(skill_values) + ";")
    else:
        # Fallback if no skills found to avoid SQL syntax error
        sql_parts.pop() 
    sql_parts.append("")

    # Jobs
    sql_parts.append("INSERT INTO public.jobs (id, title, role_id, location_id, work_style, price_min, price_max, description_md, requirements_md, status, is_active, created_at) VALUES")
    job_values = []
    for job in jobs_data:
        job_values.append(f"('{job['id']}', '{job['title']}', '{job['role_id']}', '{job['location_id']}', '{job['work_style']}', {job['price_min']}, {job['price_max']}, '{job['description_md']}', '{job['requirements_md']}', 'published', true, now())")
    
    if job_values:
        sql_parts.append(",\n".join(job_values) + ";")
    else:
        sql_parts.pop()
    sql_parts.append("")

    # Job Skills
    sql_parts.append("INSERT INTO public.job_skills (job_id, skill_id) VALUES")
    job_skill_values = []
    for job in jobs_data:
        unique_skills = set()
        for skill_name in job['skills']:
            skill_id = SKILLS_CACHE.get(skill_name)
            if skill_id and skill_id not in unique_skills:
                unique_skills.add(skill_id)
                job_skill_values.append(f"('{job['id']}', '{skill_id}')")
    
    if job_skill_values:
        sql_parts.append(",\n".join(job_skill_values) + ";")
    else:
         sql_parts.pop()
    sql_parts.append("")

    # OUTPUT
    output_path = os.path.join(os.getcwd(), 'supabase/seed.sql')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(sql_parts))

    print("Seed file generated successfully!")

if __name__ == "__main__":
    main()
