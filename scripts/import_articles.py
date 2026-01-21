
import csv
import json
import os

# Configuration
INPUT_CSV = 'articles_data.csv'
OUTPUT_SQL = 'supabase/seed_articles.sql'

def parse_faq(faq_string):
    """
    Parses FAQ string in format "Q:Question|A:Answer;Q:Question2|A:Answer2"
    to JSON object list.
    """
    if not faq_string:
        return []
    
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
                print(f"Warning: Malformed FAQ item: {item}")
                continue
    return json.dumps(faqs, ensure_ascii=False)

def parse_tags(tags_string):
    """Parses comma separated tags into SQL array string."""
    if not tags_string:
        return "'{}'"
    
    tags = [t.strip() for t in tags_string.split(',')]
    # Postgres array literal: ARRAY['tag1', 'tag2']
    quoted_tags = [f"'{t}'" for t in tags]
    return f"ARRAY[{','.join(quoted_tags)}]"

def escape_sql(text):
    """Escapes single quotes for SQL."""
    if text is None:
        return ''
    return text.replace("'", "''")

def main():
    if not os.path.exists(INPUT_CSV):
        print(f"Error: {INPUT_CSV} not found.")
        return

    print("Generating SQL...")
    
    with open(INPUT_CSV, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        with open(OUTPUT_SQL, 'w', encoding='utf-8') as out_f:
            out_f.write("-- Auto-generated article seeds\n")
            # TRUNCATE removed to support incremental updates via ON CONFLICT
            
            for row in reader:
                slug = escape_sql(row.get('slug', ''))
                title = escape_sql(row.get('title', ''))
                description = escape_sql(row.get('description', ''))
                content = escape_sql(row.get('content', ''))
                category = escape_sql(row.get('category', ''))
                thumbnail_url = escape_sql(row.get('thumbnail_url', ''))
                status = escape_sql(row.get('status', 'published'))
                published_at = escape_sql(row.get('published_at', 'now()'))
                
                # Handle special fields
                tags_sql = parse_tags(row.get('tags', ''))
                faq_json = parse_faq(row.get('faq', ''))
                
                sql = f"""
INSERT INTO public.articles (
    slug, title, description, content, category, tags, faq, thumbnail_url, status, published_at
) VALUES (
    '{slug}',
    '{title}',
    '{description}',
    '{content}',
    '{category}',
    {tags_sql},
    '{faq_json}'::jsonb,
    '{thumbnail_url}',
    '{status}',
    '{published_at}'
) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    content = EXCLUDED.content,
    faq = EXCLUDED.faq,
    updated_at = now();
"""
                out_f.write(sql)
                print(f"Processed: {title}")

    print(f"\nDone. SQL saved to {OUTPUT_SQL}")

if __name__ == "__main__":
    main()
