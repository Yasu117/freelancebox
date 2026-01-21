-- 1. Enable Japanese Full Text Search support (if needed)
-- Note: PostgreSQL usually comes with default 'simple' or language specific. 
-- For Japanese, 'simple' is often a safe fallback or you might use extensions like pgroonga or mecab if available.
-- Here we'll use a generated column for FTS.

-- Add FTS column to jobs
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS fts tsvector 
GENERATED ALWAYS AS (
  to_tsvector('simple', 
    coalesce(title, '') || ' ' || 
    coalesce(description_md, '') || ' ' || 
    coalesce(requirements_md, '')
  )
) STORED;

-- Create GIN index for fast searching
CREATE INDEX IF NOT EXISTS jobs_fts_idx ON public.jobs USING GIN (fts);

-- 2. Ensure roles table is ready for hierarchy
-- (parent_id already exists based on database.types.ts)
ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS level integer DEFAULT 0;

COMMENT ON COLUMN public.jobs.fts IS 'Full text search vector combining title, description, and requirements';
