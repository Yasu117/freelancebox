-- 1. Enable pg_trgm extension if not exists
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Create GIN Indexes for Fast Partial Match on jobs Text Columns
CREATE INDEX IF NOT EXISTS jobs_title_trgm_idx ON public.jobs USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS jobs_description_trgm_idx ON public.jobs USING gin (description_md gin_trgm_ops);
CREATE INDEX IF NOT EXISTS jobs_requirements_trgm_idx ON public.jobs USING gin (requirements_md gin_trgm_ops);

-- 3. Create Aggregated View for Skills with static counts
CREATE OR REPLACE VIEW public.v_skills_with_count AS
SELECT s.name, COUNT(j.id) as job_count
FROM public.skills s
LEFT JOIN public.job_skills js ON s.id = js.skill_id
LEFT JOIN public.jobs j ON js.job_id = j.id AND j.status = 'published' AND j.is_active = true
GROUP BY s.name;

-- 4. Create Aggregated View for Roles with static counts
CREATE OR REPLACE VIEW public.v_roles_with_count AS
SELECT r.slug, COUNT(j.id) as job_count
FROM public.roles r
LEFT JOIN public.jobs j ON r.id = j.role_id AND j.status = 'published' AND j.is_active = true
GROUP BY r.slug;

-- 5. Create Aggregated View for Work Styles with static counts
CREATE OR REPLACE VIEW public.v_work_styles_with_count AS
SELECT work_style, COUNT(*) as job_count
FROM public.jobs
WHERE status = 'published' AND is_active = true AND work_style IS NOT NULL
GROUP BY work_style;

-- 6. Add Additional Performance Indexes for Structured Queries
CREATE INDEX IF NOT EXISTS job_skills_skill_id_job_id_idx ON public.job_skills (skill_id, job_id);
CREATE INDEX IF NOT EXISTS skills_name_idx ON public.skills (name);
CREATE INDEX IF NOT EXISTS jobs_published_active_created_idx ON public.jobs (created_at DESC) WHERE status = 'published' AND is_active = true;
CREATE INDEX IF NOT EXISTS jobs_work_style_published_active_idx ON public.jobs (work_style, created_at DESC) WHERE status = 'published' AND is_active = true;
CREATE INDEX IF NOT EXISTS jobs_role_id_published_active_idx ON public.jobs (role_id, created_at DESC) WHERE status = 'published' AND is_active = true;
