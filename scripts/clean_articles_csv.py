import csv
import sys
import os

file_path = 'articles_data.csv'
header = ["slug", "title", "description", "content", "category", "tags", "faq", "thumbnail_url", "status", "published_at"]

rows_by_slug = {}
order = []

try:
    if os.path.exists(file_path):
        print(f"Reading {file_path}...")
        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for i, row in enumerate(reader):
                s = row.get('slug', '').strip()
                t = row.get('title', '').strip()
                
                # Filter out empty or invalid rows
                if not s or not t:
                    print(f"Skipping invalid row {i+2}: slug='{s}', title='{t}'")
                    continue
                
                # Filter out obviously wrong rows (e.g. title is 'Market' which shouldn't happen unless column shift)
                if t == 'Market' and s not in ['market']: 
                    print(f"Skipping suspicious row {i+2}: title='Market'")
                    continue

                if s not in rows_by_slug:
                    order.append(s)
                rows_by_slug[s] = row
    
    print(f"found {len(rows_by_slug)} valid unique articles.")
    
    # Write back
    with open(file_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=header)
        writer.writeheader()
        for s in order:
            writer.writerow(rows_by_slug[s])

    print("CSV cleanup complete.")

except Exception as e:
    print(f"Error cleaning CSV: {e}")
    sys.exit(1)
