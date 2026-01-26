import csv
import os
import json
import urllib.request
import urllib.error
import ssl
import sys

def load_env():
    env = {}
    try:
        if os.path.exists('.env.local'):
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
SERVICE_KEY = ENV.get('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SERVICE_KEY:
    print("Warning: Missing Supabase URL or Service Role Key in .env.local. Skipping direct DB update.")
    sys.exit(0)

# Remove trailing slash if present
if SUPABASE_URL.endswith('/'):
    SUPABASE_URL = SUPABASE_URL[:-1]

API_BASE = f"{SUPABASE_URL}/rest/v1"
HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates" 
}

def parse_faq(faq_string):
    if not faq_string: return None
    faqs = []
    items = faq_string.split(';')
    for item in items:
        if '|' in item:
            try:
                q_part, a_part = item.split('|', 1)
                question = q_part.replace('Q:', '').strip()
                answer = a_part.replace('A:', '').strip()
                faqs.append({"question": question, "answer": answer})
            except ValueError:
                continue
    return faqs if faqs else None

def parse_tags(tags_string):
    if not tags_string: return None
    tags = [t.strip() for t in tags_string.split(',') if t.strip()]
    return tags if tags else None

def main():
    csv_path = 'articles_data.csv'
    if not os.path.exists(csv_path):
        print("CSV not found.")
        return

    print(f"Reading {csv_path} and pushing to Supabase at {SUPABASE_URL}...")
    
    payload = []
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            slug = row.get('slug', '')
            if not slug: continue
            
            data = {
                "slug": slug,
                "title": row.get('title', ''),
                "description": row.get('description', ''),
                "content": row.get('content', ''),
                "category": row.get('category', ''),
                "tags": parse_tags(row.get('tags', '')),
                "faq": parse_faq(row.get('faq', '')),
                "thumbnail_url": row.get('thumbnail_url', ''),
                "status": row.get('status', 'published'),
                "published_at": row.get('published_at') 
            }
            payload.append(data)

    if not payload:
        print("No data found in CSV.")
        return

    # Batch insert/upsert
    batch_size = 50
    print(f"Upserting {len(payload)} articles...")
    
    for i in range(0, len(payload), batch_size):
        batch = payload[i:i+batch_size]
        
        # Upsert based on slug conflict
        url = f"{API_BASE}/articles?on_conflict=slug"
        req_body = json.dumps(batch).encode('utf-8')
        
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE

        req = urllib.request.Request(url, data=req_body, headers=HEADERS, method="POST")
        
        try:
            with urllib.request.urlopen(req, context=ctx) as res:
                print(f"  Batch {i} - {i+len(batch)}: {res.status} OK")
        except urllib.error.HTTPError as e:
            msg = e.read().decode('utf-8')
            print(f"  Error upserting batch {i}: {e.code} - {msg}")

if __name__ == "__main__":
    main()
