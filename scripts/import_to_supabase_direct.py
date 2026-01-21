import csv
import uuid
import os
import datetime
import re
import sys
import json
import urllib.request
import urllib.error

# --- Configuration & Env Loading ---

def load_env():
    env = {}
    try:
        with open('.env.local', 'r') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'): continue
                if '=' in line:
                    key, val = line.split('=', 1)
                    env[key.strip()] = val.strip().strip("'").strip('"')
    except Exception:
        pass
    return env

ENV = load_env()
SUPABASE_URL = ENV.get('NEXT_PUBLIC_SUPABASE_URL')
# Use provided Service Role Key
SERVICE_KEY = ENV.get('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SERVICE_KEY:
    print("Error: Missing Supabase URL or Service Role Key in .env.local")
    sys.exit(1)

API_BASE = f"{SUPABASE_URL}/rest/v1"
HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation" # or minimal
}

# --- Helper Functions ---

def generate_uuid():
    return str(uuid.uuid4())

def api_request(endpoint, method="GET", data=None, params=None):
    url = f"{API_BASE}/{endpoint}"
    if params:
        query_string = urllib.parse.urlencode(params)
        url += f"?{query_string}"
    
    req_body = None
    if data is not None:
        req_body = json.dumps(data).encode('utf-8')

    req = urllib.request.Request(url, data=req_body, headers=HEADERS, method=method)
    
    try:
        with urllib.request.urlopen(req) as res:
            if res.status == 204:
                return None
            resp_body = res.read()
            return json.loads(resp_body) if resp_body else None
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        print(f"API Error [{e.code}] {url}: {body}")
        raise e

# --- Mappings ---

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

SKILLS_CACHE = {} 

def main():
    print("--- Starting Supabase Import ---")
    
    # 1. Parse CSV
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

    if rows and len(rows[0]) > 0:
        first_col = rows[0][0]
        second_col = rows[0][1] if len(rows[0]) > 1 else ""
        if "ID" in first_col or "案件名" in first_col or "案件名" in second_col:
            rows.pop(0)

    print(f"Processing {len(rows)} rows from CSV...")

    jobs_data = []

    # --- Mappings Definitions (Sync with JobFilter.tsx) ---
    ROLE_SLUG_MAP = {
        # Engineer
        'フロントエンドエンジニア': 'frontend-engineer',
        'バックエンドエンジニア': 'backend-engineer',
        'サーバーサイドエンジニア': 'server-side-engineer',
        'アプリエンジニア': 'mobile-app-engineer',
        'インフラエンジニア': 'infrastructure-engineer',
        'ネットワークエンジニア': 'network-engineer',
        'データベースエンジニア': 'database-engineer',
        'セキュリティエンジニア': 'security-engineer',
        '情報システム': 'information-systems',
        '社内SE': 'internal-se',
        '汎用機エンジニア': 'mainframe-engineer',
        'AIエンジニア': 'ai-engineer',
        '機械学習エンジニア': 'ml-engineer',
        'ブロックチェーンエンジニア': 'blockchain-engineer',
        'テクニカルサポート': 'technical-support',
        '組込・制御エンジニア': 'embedded-engineer',
        'システムエンジニア(SE)': 'system-engineer',
        'プログラマー(PG)': 'programmer',
        'SRE': 'sre',
        'クラウドエンジニア': 'cloud-engineer',
        'VPoE': 'vpoe',
        'エンジニアリングマネージャー': 'engineering-manager',
        'コーダー': 'coder',
        'CRE': 'cre',
        'データサイエンティスト': 'data-scientist',
        'DBA': 'dba',
        'QAエンジニア': 'qa-engineer',
        'デバッガー': 'debugger',
        'テスター': 'tester',
        'ブリッジSE': 'bridge-se',
        'フルスタックエンジニア': 'fullstack-engineer',
        'ヘルプデスク': 'helpdesk',
        
        # Designer
        'Webデザイナー': 'web-designer',
        'イラストレーター': 'illustrator',
        'UI・UXデザイナー': 'ui-ux-designer',
        'グラフィックデザイナー': 'graphic-designer',
        'キャラクターデザイナー': 'character-designer',
        '2Dデザイナー': '2d-designer',
        '3Dデザイナー': '3d-designer',
        'アートディレクター': 'art-director',
        'エフェクトデザイナー': 'effect-designer',
        'アニメーター': 'animator',

        # Marketer
        'Webマーケター': 'web-marketer',
        'デジタルマーケター': 'digital-marketer',

        # Creator
        'プランナー': 'planner',
        '動画・映像制作': 'video-creator',
        '3Dモデラー': '3d-modeler',
        'ライター': 'writer',
        'シナリオライター': 'scenario-writer',
        'ゲームプランナー': 'game-planner',

        # PM/Director
        'プロジェクトマネージャー': 'pm',
        'PMO': 'pmo',
        'プロダクトマネージャー(PdM)': 'pdm',
        'Webディレクター': 'web-director',
        'プロデューサー': 'producer',
        'ゲームディレクター': 'game-director',
        '動画ディレクター': 'video-director',

        # Consultant
        'ITコンサルタント': 'it-consultant',
        'SAPコンサルタント': 'sap-consultant',
        'ITアーキテクト': 'it-architect',
        '戦略系コンサルタント': 'strategy-consultant',
    }
    
    # Pre-populate roles in registry
    print("Initializing Role Registry...")
    roles_registry = {}
    # Create parent categories for grouping if needed, or flat list. 
    # For now, we just ensure every slug in the map exists as a role.
    # We will assign them all to a generic 'Engineer' parent or specific ones if we defined parents.
    # To keep it simple and consistent with Schema, we'll create them flat or with dummy parents.
    # Let's map them to valid parents based on the categories in JobFilter.tsx
    
    CATEGORY_MAP = {
        'Engineer': [
            'frontend-engineer', 'backend-engineer', 'server-side-engineer', 'mobile-app-engineer',
            'infrastructure-engineer', 'network-engineer', 'database-engineer', 'security-engineer',
            'information-systems', 'internal-se', 'mainframe-engineer', 'ai-engineer', 'ml-engineer',
            'blockchain-engineer', 'technical-support', 'embedded-engineer', 'system-engineer',
            'programmer', 'sre', 'cloud-engineer', 'vpoe', 'engineering-manager', 'coder', 'cre',
            'data-scientist', 'dba', 'qa-engineer', 'debugger', 'tester', 'bridge-se',
            'fullstack-engineer', 'helpdesk'
        ],
        'Designer': [
            'web-designer', 'illustrator', 'ui-ux-designer', 'graphic-designer', 'character-designer',
            '2d-designer', '3d-designer', 'art-director', 'effect-designer', 'animator'
        ],
        'Marketer': ['web-marketer', 'digital-marketer'],
        'Creator': ['planner', 'video-creator', '3d-modeler', 'writer', 'scenario-writer', 'game-planner'],
        'PM_Director': ['pm', 'pmo', 'pdm', 'web-director', 'producer', 'game-director', 'video-director'],
        'Consultant': ['it-consultant', 'sap-consultant', 'it-architect', 'strategy-consultant']
    }

    category_ids = {}
    for cat in CATEGORY_MAP.keys():
        cat_id = generate_uuid()
        category_ids[cat] = cat_id
        roles_registry[cat] = {'id': cat_id, 'parent_id': None, 'name': cat, 'slug': cat.lower()}

    role_slug_to_id = {}
    for label, slug in ROLE_SLUG_MAP.items():
        # Find parent
        parent_id = category_ids['Engineer'] # Default
        for cat, slugs in CATEGORY_MAP.items():
            if slug in slugs:
                parent_id = category_ids[cat]
                break
        
        rid = generate_uuid()
        roles_registry[label] = {'id': rid, 'parent_id': parent_id, 'name': label, 'slug': slug}
        role_slug_to_id[slug] = rid


    # Skill Normalization Map (Implicitly handled by GAS cleaning, but good to have safety)
    # We will trust the input matches definitions, but normalize case just in case.
    
    locations_registry = {}
    LOC_NORM_MAP = {
        '東京': 'Tokyo', '東京都': 'Tokyo', 
        '神奈川': 'Kanagawa', '神奈川県': 'Kanagawa', 
        '埼玉': 'Saitama', '埼玉県': 'Saitama',
        '千葉': 'Chiba', '千葉県': 'Chiba',
        '大阪': 'Osaka', '大阪府': 'Osaka',
        '愛知': 'Aichi', '愛知県': 'Aichi',
        '福岡': 'Fukuoka', '福岡県': 'Fukuoka',
        '北海道': 'Hokkaido',
        '兵庫': 'Hyogo', '兵庫県': 'Hyogo',
        '京都': 'Kyoto', '京都府': 'Kyoto',
        # ... Add more as needed
    }

    all_skills = set()
    
    for i, row in enumerate(rows):
        if len(row) < 7: continue
        
        # ... [Parse fields code - same as before] ...
        # Parse fields
        if len(row) >= 9:
            job_code_raw = row[0]
            title_raw = row[1]
            role_raw = row[2] 
            tech_skills_raw = row[3]
            price_raw = row[4]
            location_raw = row[5]
            summary_raw = row[6]
            env_raw = row[7]
            req_raw = row[8]
        else:
            job_code_raw = f"JOB-{i+1:05d}"
            title_raw = row[0]
            role_raw = "" # Fallback
            tech_skills_raw = row[1]
            price_raw = row[2]
            location_raw = row[3]
            summary_raw = row[4]
            env_raw = row[5]
            req_raw = row[6]

        # Role Mapping (Direct)
        role_id = roles_registry['システムエンジニア(SE)']['id'] # Default fallback
        
        # Try exact match first
        if role_raw and role_raw in roles_registry:
            role_id = roles_registry[role_raw]['id']
        else:
            # Try fuzzy match or default
            # If role_raw is empty, maybe try to guess from title? 
            # Per user request, data will be cleaned. If empty or unknown, fallback to System Engineer or General.
            # Let's try to find if any key in ROLE_SLUG_MAP is in title/role_raw
            found = False
            target_text = (role_raw + " " + title_raw).lower()
            for label, slug in ROLE_SLUG_MAP.items():
                if label.lower() in target_text:
                     # We need the key(label) to look up in roles_registry
                     role_id = roles_registry[label]['id']
                     found = True
                     break
            if not found:
                 # Fallback to backend or SE
                 pass

        # Location Mapping
        # Simple string matching from LOC_NORM_MAP
        norm_loc_name = 'その他' # Default
        loc_slug = 'other'
        
        for k, v in LOC_NORM_MAP.items():
            if k in location_raw:
                norm_loc_name = k
                loc_slug = v.lower()
                break
        
        # Register location if new
        location_key = norm_loc_name
        if location_key not in locations_registry:
             locations_registry[location_key] = {'id': generate_uuid(), 'name': norm_loc_name, 'slug': loc_slug}
        loc_id = locations_registry[location_key]['id']

        # Work Style Mapping
        work_style = 'onsite' # Default
        if 'リモート' in location_raw or 'リモート' in req_raw or '在宅' in location_raw:
            if 'フル' in location_raw or 'フル' in req_raw:
                work_style = 'remote'
            else:
                work_style = 'hybrid'
        # Override if specific keywords exist? User said "Location is same", "Work style use conversion table".
        # Assuming table means this logic is fine.

        # Price Logic (Keep existing logic as requested)
        min_p = 0
        max_p = 0
        # ... [Price parsing logic same as before] ...
        price_digits = re.findall(r'(\d+)', price_raw.replace(',', ''))
        if price_digits:
            vals = [int(v) for v in price_digits]
            vals = [v * 10000 if v < 2000 else v for v in vals]
            if len(vals) >= 2:
                min_p, max_p = vals[0], vals[1]
            elif len(vals) == 1:
                v = vals[0]
                min_p, max_p = max(0, v - 50000), v + 50000


        # Title
        title = title_raw.strip() or 'エンジニア案件'

        # Skills
        skills = []
        raw_skills = [s.strip() for s in re.split('[,、\n]', tech_skills_raw) if s.strip()]
        for s in raw_skills:
            clean_s = re.sub(r'\(.*?\)|（.*?）', '', s).strip()
            if not clean_s: continue
            
            # Trust the input from GAS cleaning, just use clean_s
            normalized_name = clean_s
            
            if normalized_name:
                if normalized_name not in skills:
                    skills.append(normalized_name)
                    all_skills.add(normalized_name)

        jobs_data.append({
            'id': generate_uuid(),
            'job_code': job_code_raw.strip(),
            'title': title,
            'role_id': role_id,
            'location_id': loc_id,
            'work_style': work_style,
            'price_min': min_p,
            'price_max': max_p,
            'description_md': f"## 【案件概要】\n{summary_raw}\n\n### 【開発環境】\n{env_raw}",
            'requirements_md': f"## 【募集要項・条件】\n{req_raw}",
            'skills': skills,
            'status': 'published',
            'is_active': True,
            'published_at': datetime.datetime.now().isoformat()
        })

    # 3. Import to Supabase
    
    # --- Deduplicate Job Codes ---
    print("Deduplicating job codes...")
    seen_codes = {}
    deduped_data = [] # we can actually just modify in place or filter. 
    # But filtering means losing jobs. We want to KEEP them but rename code.
    
    for job in jobs_data:
        code = job['job_code']
        if code in seen_codes:
            seen_codes[code] += 1
            # Append suffix to make unique
            job['job_code'] = f"{code}-{seen_codes[code]}"
            print(f"Renamed duplicate job_code {code} to {job['job_code']}")
        else:
            seen_codes[code] = 1
    # -----------------------------

    print("--- Starting Remote DB Update ---")

    # A. DELETE Existing Data (Reverse Order of Dependencies)
    print("Deleting existing data...")
    try:
        # Delete using simple condition that matches everything (id not null)
        # Note: 'id=neq.0000...' is a trick. Or 'id=not.is.null'.
        # Since we use Service Role, RLS should not block us.
        # But REST API DELETE requires a filter.
        # We'll use a filter that matches valid UUIDs.
        headers_minimal = HEADERS.copy()
        headers_minimal["Prefer"] = "return=minimal"
        
        # job_skills
        api_request('job_skills', 'DELETE', params={'job_id': 'neq.00000000-0000-0000-0000-000000000000'})
        # jobs
        api_request('jobs', 'DELETE', params={'id': 'neq.00000000-0000-0000-0000-000000000000'})
        # skills
        api_request('skills', 'DELETE', params={'id': 'neq.00000000-0000-0000-0000-000000000000'})
        # roles
        api_request('roles', 'DELETE', params={'id': 'neq.00000000-0000-0000-0000-000000000000'})
        # locations
        api_request('locations', 'DELETE', params={'id': 'neq.00000000-0000-0000-0000-000000000000'})
        print("Truncate complete.")
    except Exception as e:
        print(f"Warning during delete (tables might be empty): {e}")

    # B. Insert Masters
    print("Inserting Masters...")
    
    # Locations
    loc_payload = []
    # LOC_NORM_MAP only needs to be defined if we were doing reverse lookup, but we already have name in registry obj.
    # We can trust the registry object we built.
    for key, info in locations_registry.items():
        loc_payload.append({
            'id': info['id'], 
            'region': '日本', 
            'name': info['name'], 
            'slug': info['slug']
        })
    if loc_payload:
        api_request('locations', 'POST', data=loc_payload)

    # Roles
    role_payload = []
    for name, info in roles_registry.items():
        # Use pre-defined slug from registry. Fallback to name if missing (shouldn't happen)
        slug = info.get('slug')
        if not slug:
             slug = re.sub(r'[^a-z0-9]', '-', name.lower()).strip('-') or 'role'
             
        role_payload.append({
            'id': info['id'], 
            'parent_id': info['parent_id'], 
            'name': name, 
            'slug': slug, 
            'sort_order': 0
        })
    if role_payload:
        api_request('roles', 'POST', data=role_payload)

    # Skills
    skill_payload = []
    skill_ids_map = {}
    for name in list(all_skills):
        sid = generate_uuid()
        skill_ids_map[name] = sid
        slug = re.sub(r'[^a-z0-9]', '-', name.lower())
        slug = re.sub(r'-+', '-', slug).strip('-')
        if not slug or len(slug) < 2:
            slug = f"skill-{sid}"
        else:
            # Truncate overly long slugs and verify uniqueness with UUID
            slug = f"{slug[:40]}-{sid[:8]}"
        skill_payload.append({'id': sid, 'name': name, 'slug': slug, 'sort_order': 0})
    
    # Chunk Skills if large
    if skill_payload:
        print(f"Inserting {len(skill_payload)} skills...")
        for i in range(0, len(skill_payload), 500):
            api_request('skills', 'POST', data=skill_payload[i:i+500])

    # C. Insert Jobs
    print(f"Inserting {len(jobs_data)} jobs...")
    BATCH_SIZE = 50
    
    job_payloads = []
    for job in jobs_data:
        job_payloads.append({
            'id': job['id'],
            'job_code': job['job_code'], 
            'title': job['title'],
            'role_id': job['role_id'],
            'location_id': job['location_id'],
            'work_style': job['work_style'],
            'price_min': job['price_min'],
            'price_max': job['price_max'],
            'description_md': job['description_md'],
            'requirements_md': job['requirements_md'],
            'status': job['status'],
            'is_active': job['is_active'],
            'published_at': job['published_at']
        })

    for i in range(0, len(job_payloads), BATCH_SIZE):
        batch = job_payloads[i:i+BATCH_SIZE]
        try:
            api_request('jobs', 'POST', data=batch)
            print(f"  Inserted jobs batch {i} - {i+len(batch)}")
        except Exception as e:
            print(f" Failed job batch {i}: {e}")

    # D. Insert Job Skills
    print("Inserting Job Skills...")
    js_payload = []
    for job in jobs_data:
        for sk_name in job['skills']:
            sid = skill_ids_map.get(sk_name)
            if sid:
                js_payload.append({'job_id': job['id'], 'skill_id': sid})
    
    if js_payload:
        # Deduplicate
        seen = set()
        deduped = []
        for item in js_payload:
            key = (item['job_id'], item['skill_id'])
            if key not in seen:
                seen.add(key)
                deduped.append(item)
        
        print(f"  Total {len(deduped)} job_skill relations.")
        for i in range(0, len(deduped), 500):
            api_request('job_skills', 'POST', data=deduped[i:i+500])
            print(f"  Inserted job_skills batch {i}")

    print("--- Import Complete ---")

if __name__ == "__main__":
    main()
