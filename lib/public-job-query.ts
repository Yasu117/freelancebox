import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import { createKeywordOrFilters, getJobSkillSelect, type ParsedJobSearchParams } from '@/lib/job-utils'

export function publicJobQuery(
    supabase: SupabaseClient<Database>,
    filters: ParsedJobSearchParams,
    countOnly = false,
) {
    const select = countOnly
        ? `id, role:roles!inner(id)${getJobSkillSelect(filters.skills, true)}`
        : `*, location:locations(name), role:roles!inner(name, slug), ${getJobSkillSelect(filters.skills)}`

    let query = supabase.from('jobs')
        .select(select, countOnly ? { count: 'exact', head: true } : undefined)
        .eq('status', 'published')
        .eq('is_active', true)

    for (const keyword of createKeywordOrFilters(filters.q)) query = query.or(keyword)
    if (filters.skills.length) query = query.in('job_skills.skills.name', filters.skills)
    if (filters.roles.length) query = query.in('role.slug', filters.roles)
    if (filters.workStyles.length) query = query.in('work_style', filters.workStyles)
    if (filters.minPrice !== null) query = query.gte('price_min', filters.minPrice)
    if (filters.maxPrice !== null) query = query.lte('price_max', filters.maxPrice)
    // HEAD still has a page source in PostgREST. Bound it independently of the exact count.
    return countOnly ? query.range(0, 0) : query
}
