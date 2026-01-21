import csv
import uuid
import os
import datetime
import re
import sys
import json
import urllib.request
import urllib.error
import ssl

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

    # Create an SSL context that ignores certificate verification
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    req = urllib.request.Request(url, data=req_body, headers=HEADERS, method=method)
    
    try:
        with urllib.request.urlopen(req, context=ctx) as res:
            if res.status == 204:
                return None
            resp_body = res.read()
            return json.loads(resp_body) if resp_body else None
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        print(f"API Error [{e.code}] {url}: {body}")
        raise e

# --- Mappings ---

SKILLS_CACHE = {} 

def main():
    print("--- Starting Supabase Import (Ver 1.2) ---")
    
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
        'マーケター': 'web-marketer', # Fallback

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
        'ディレクター': 'web-director', # Fallback

        # Consultant
        'ITコンサルタント': 'it-consultant',
        'SAPコンサルタント': 'sap-consultant',
        'ITアーキテクト': 'it-architect',
        '戦略系コンサルタント': 'strategy-consultant',
        'コンサルタント': 'it-consultant', # Fallback
        
        # Others
        '事務': 'technical-support', # Fallback to support/helpdesk-like
    }
    
    # Initialize Role Registry (Unique by Slug)
    print("Initializing Role Registry...")
    roles_registry_by_slug = {} # slug -> {id, name, parent_id}
    
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
    # 1. Register Categories (as parent roles or categories if we had them)
    # But schema seems to just use roles table. We can add Categories as root roles if needed?
    # Existing `import_to_supabase_direct.py` added them to roles table.
    for cat in CATEGORY_MAP.keys():
        cat_id = generate_uuid()
        category_ids[cat] = cat_id
        roles_registry_by_slug[cat.lower()] = {'id': cat_id, 'parent_id': None, 'name': cat, 'slug': cat.lower()}

    # 2. Register Leaf Roles
    for label, slug in ROLE_SLUG_MAP.items():
        if slug in roles_registry_by_slug:
            continue # Already registered this slug, skip duplicates
        
        # Find parent
        parent_id = category_ids['Engineer'] # Default
        for cat, slugs in CATEGORY_MAP.items():
            if slug in slugs:
                parent_id = category_ids[cat]
                break
        
        roles_registry_by_slug[slug] = {
            'id': generate_uuid(),
            'name': label, # Use the first label encountered as the canonical name
            'slug': slug,
            'parent_id': parent_id
        }


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
    }

    all_skills = set()
    jobs_data = []
    
    for i, row in enumerate(rows):
        if len(row) < 7: continue
        
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
            print(f"Row {i} has unexpected length {len(row)}, skipping.")
            continue

        # Role Mapping
        # Default Fallback
        default_role_slug = 'system-engineer'
        target_slug = None

        # 1. Exact match label
        if role_raw and role_raw in ROLE_SLUG_MAP:
            target_slug = ROLE_SLUG_MAP[role_raw]
        
        # 2. Fuzzy match label
        if not target_slug and role_raw:
             # Try containing match
             for label, slug in ROLE_SLUG_MAP.items():
                 if label in role_raw:
                     target_slug = slug
                     break
        
        # 3. Fuzzy match title
        if not target_slug and title_raw:
             for label, slug in ROLE_SLUG_MAP.items():
                 if label in title_raw:
                     target_slug = slug
                     break
        
        if not target_slug:
            target_slug = default_role_slug

        # Lookup ID
        if target_slug in roles_registry_by_slug:
            role_id = roles_registry_by_slug[target_slug]['id']
        else:
            role_id = roles_registry_by_slug['system-engineer']['id']


        # Location Mapping
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

        # Price Logic
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
                min_p, max_p = max(0, v - 50000), v + 50000

        # Title
        title = title_raw.strip() or 'エンジニア案件'

        # Skills
        skills = []
        raw_skills = [s.strip() for s in re.split('[,、\n]', tech_skills_raw) if s.strip()]
        for s in raw_skills:
            clean_s = re.sub(r'\(.*?\)|（.*?）', '', s).strip()
            if not clean_s: continue
            
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
    
    for job in jobs_data:
        code = job['job_code']
        if code in seen_codes:
            seen_codes[code] += 1
            job['job_code'] = f"{code}-{seen_codes[code]}"
        else:
            seen_codes[code] = 1
    # -----------------------------

    print("--- Starting Remote DB Update ---")

    # A. DELETE Existing Data
    print("Deleting existing data...")
    try:
        api_request('job_skills', 'DELETE', params={'job_id': 'neq.00000000-0000-0000-0000-000000000000'})
        api_request('jobs', 'DELETE', params={'id': 'neq.00000000-0000-0000-0000-000000000000'})
        api_request('skills', 'DELETE', params={'id': 'neq.00000000-0000-0000-0000-000000000000'})
        api_request('roles', 'DELETE', params={'id': 'neq.00000000-0000-0000-0000-000000000000'})
        api_request('locations', 'DELETE', params={'id': 'neq.00000000-0000-0000-0000-000000000000'})
        print("Truncate complete.")
    except Exception as e:
        print(f"Warning during delete: {e}")

    # B. Insert Masters
    print("Inserting Masters...")
    
    # Locations
    loc_payload = []
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
    for slug, info in roles_registry_by_slug.items():
        role_payload.append({
            'id': info['id'], 
            'parent_id': info['parent_id'], 
            'name': info['name'], 
            'slug': info['slug'], 
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
            slug = f"{slug[:40]}-{sid[:8]}"
        skill_payload.append({'id': sid, 'name': name, 'slug': slug, 'sort_order': 0})
    
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
