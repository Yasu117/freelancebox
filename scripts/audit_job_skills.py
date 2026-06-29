import os
import sys
import json
import re
import urllib.request
import urllib.parse
import ssl

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
    print("Error: Missing Supabase credentials in .env.local")
    sys.exit(1)

API_BASE = f"{SUPABASE_URL}/rest/v1"
HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json"
}

def api_request(endpoint, params=None):
    url = f"{API_BASE}/{endpoint}"
    if params:
        query_string = urllib.parse.urlencode(params)
        url += f"?{query_string}"
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    req = urllib.request.Request(url, headers=HEADERS, method="GET")
    try:
        with urllib.request.urlopen(req, context=ctx) as res:
            body = res.read()
            return json.loads(body) if body else None
    except Exception as e:
        print(f"API Error fetching {url}: {e}")
        return None

def main():
    print("=== Starting Database Skill Alignment Audit ===")
    
    # 1. Fetch all skills master
    print("Fetching skills master...")
    skills = api_request('skills', params={'select': 'id,name', 'limit': 2000})
    if not skills:
        print("Failed to fetch skills master.")
        return
    print(f"Found {len(skills)} skills in master.")
    
    # Track critical skills we want to audit
    audit_target_skills = ['Java', 'JavaScript', 'TypeScript', 'Python', 'Go', 'AWS', 'SQL', 'C#', 'C++']
    skills_map = {s['name']: s['id'] for s in skills if s['name'] in audit_target_skills}
    
    # Normalize synonyms for matching if necessary, but keep it simple with word boundary
    # 2. Fetch jobs and their skills
    print("Fetching jobs with registered skills (in batches)...")
    limit = 1000
    offset = 0
    
    mismatches = {s: [] for s in audit_target_skills}
    total_audited = 0
    
    while True:
        # Fetch jobs
        jobs = api_request('jobs', params={
            'select': 'id,job_code,title,description_md,requirements_md,job_skills(skills(name))',
            'status': 'eq.published',
            'is_active': 'eq.true',
            'limit': limit,
            'offset': offset
        })
        if not jobs:
            break
        
        for job in jobs:
            total_audited += 1
            # Get registered skills for this job
            registered_skills = set()
            if 'job_skills' in job and job['job_skills']:
                for js in job['job_skills']:
                    if js.get('skills') and js['skills'].get('name'):
                        registered_skills.add(js['skills']['name'])
            
            # Combine text fields to scan
            text_to_scan = f"{job.get('title', '')} {job.get('description_md', '')} {job.get('requirements_md', '')}"
            
            for skill_name in audit_target_skills:
                # Compile regex with word boundaries to avoid false positives (e.g. Java in JavaScript)
                # Escaping special characters for regex
                escaped = re.escape(skill_name)
                # Word boundaries: matching only full words
                pattern = rf'\b{escaped}\b'
                # Special handle for Japanese word boundary like "Java開発" (where \b works since alpha next to kanji)
                # But to be robust, we match case insensitively
                match = re.search(pattern, text_to_scan, re.IGNORECASE)
                
                if match:
                    # The word exists in description/title, check if it's registered in job_skills
                    if skill_name not in registered_skills:
                        # Particular check: If searching for 'Java' and it matches, make sure it's not actually 'JavaScript'
                        # (though \bJava\b should avoid JavaScript, double check)
                        if skill_name == 'Java':
                            # check if the match is part of JavaScript (case-insensitive)
                            # e.g. "JavaScript" -> \bJava\b matches nothing, but just in case
                            pass
                        
                        mismatches[skill_name].append({
                            'id': job['id'],
                            'job_code': job.get('job_code'),
                            'title': job.get('title')
                        })
                        
        if len(jobs) < limit:
            break
        offset += limit
        
        # Stop safety: only audit first 20000 jobs for quick execution if needed
        # But we can audit all 70k quickly because it's in-memory processing
        if total_audited >= 75000:
            break
            
    print("\n=== Audit Results ===")
    print(f"Total jobs audited: {total_audited}")
    
    total_mismatches = 0
    for skill_name, list_jobs in mismatches.items():
        count = len(list_jobs)
        total_mismatches += count
        print(f"Skill '{skill_name}': {count} jobs have it in text but NOT in job_skills")
        if count > 0:
            print("  Sample mismatch jobs:")
            for j in list_jobs[:3]:
                print(f"    - [{j['job_code']}] {j['title']} (ID: {j['id']})")
                
    print(f"\nTotal potential skill-job mismatch items found: {total_mismatches}")
    
    # Save results to a file for report
    report_path = 'scripts/audit_report.json'
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump({
            'total_audited': total_audited,
            'total_mismatch_relations': total_mismatches,
            'mismatches_by_skill': {k: len(v) for k, v in mismatches.items()},
            'sample_mismatches': {k: v[:5] for k, v in mismatches.items() if len(v) > 0}
        }, f, ensure_ascii=False, indent=2)
    print(f"Saved audit report to {report_path}")

if __name__ == '__main__':
    main()
