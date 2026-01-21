import { JobList } from '@/components/features/jobs/JobList'
import { JobFilter } from '@/components/features/jobs/JobFilter'
import { createClient } from '@/lib/supabase/server'
import { Search } from 'lucide-react'

export default async function JobsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedParams = await searchParams
    const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : ''
    const roles = typeof resolvedParams.roles === 'string' ? resolvedParams.roles.split(',') : []
    const workStyles = typeof resolvedParams.work_styles === 'string' ? resolvedParams.work_styles.split(',') : []
    const skills = typeof resolvedParams.skills === 'string' ? resolvedParams.skills.split(',') : []
    const minPrice = typeof resolvedParams.min_price === 'string' ? Number(resolvedParams.min_price) : null

    const supabase = await createClient()

    // Helper to apply filters to a query
    const applyFilters = (baseQuery: any) => {
        let query = baseQuery

        // キーワード検索（AND検索 + 表記揺れ対応）
        if (q) {
            const { parseSearchQuery } = require('@/lib/search-utils')
            const searchGroups = parseSearchQuery(q)

            // 生成されたグループごとに AND 条件を追加
            // グループ内は OR 条件 (表記揺れのいずれかにヒットすればOK)
            searchGroups.forEach((variants: string[]) => {
                const subQuery = variants.map(variant =>
                    `title.ilike.%${variant}%,description_md.ilike.%${variant}%,requirements_md.ilike.%${variant}%`
                ).join(',')

                query = query.or(subQuery)
            })
        }

        if (roles.length > 0) {
            query = query.in('role.slug', roles)
        }

        if (workStyles.length > 0) {
            query = query.in('work_style', workStyles)
        }

        if (minPrice !== null) {
            query = query.gte('price_min', minPrice)
        }
        return query
    }

    // 1. Get Count
    // To filter by skills, we need the join. 
    // If skills are selected, we must use !inner for job_skills and skills.
    const skillSelect = skills.length > 0
        ? ', job_skills!inner(skills!inner(name))'
        : ''

    let countBaseQuery = supabase
        .from('jobs')
        .select(`*, role:roles!inner(slug)${skillSelect}`, { count: 'exact', head: true })
        .eq('status', 'published')

    // We need to apply .in('job_skills.skills.name', skills) if skills exist
    if (skills.length > 0) {
        countBaseQuery = countBaseQuery.in('job_skills.skills.name', skills)
    }

    // Re-use applyFilters logic
    let countQuery = applyFilters(countBaseQuery)
    if (resolvedParams.max_price) countQuery = countQuery.lte('price_max', resolvedParams.max_price)

    const { count, error: countError } = await countQuery

    // 2. Get Data (First 20 items)
    // Similarly, modify select string for !inner if filtering by skills
    const dataSkillSelect = skills.length > 0
        ? 'job_skills!inner(skills!inner(name))' // Use !inner when filtering
        : 'job_skills(skills(name))'             // Use left join (default) when not filtering

    let dataBaseQuery = supabase
        .from('jobs')
        .select(`
            *,
            location:locations(name),
            role:roles!inner(name, slug),
            ${dataSkillSelect}
        `)
        .eq('status', 'published')

    if (skills.length > 0) {
        dataBaseQuery = dataBaseQuery.in('job_skills.skills.name', skills)
    }

    let dataQuery = applyFilters(dataBaseQuery)
    if (resolvedParams.max_price) dataQuery = dataQuery.lte('price_max', resolvedParams.max_price)

    const { data: jobsData, error } = await dataQuery
        .order('created_at', { ascending: false })
        .range(0, 19)

    if (error) console.error('Error fetching jobs:', error)

    const jobs = (jobsData as any[])?.map(job => ({
        ...job,
        skills: job.job_skills?.map((js: any) => js.skills) || []
    })) || []

    // 3. Fetch All Metadata for Faceted Search & Popular Tags (Client Side calculation)
    const { data: rawMeta } = await supabase
        .from('jobs')
        .select(`
            id,
            work_style,
            price_min,
            price_max,
            role:roles!inner(name, slug),
            job_skills(skills(name))
        `)
        .eq('status', 'published')
        .eq('is_active', true)

    const allJobsMeta = (rawMeta as any[])?.map(job => ({
        id: job.id,
        work_style: job.work_style,
        role: job.role, // { name, slug }
        price_min: job.price_min,
        price_max: job.price_max,
        skills: job.job_skills?.map((js: any) => js.skills?.name).filter(Boolean) || []
    })) || []

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Search Header */}
            <div className="bg-white border-b border-gray-200 py-8 mb-8 shadow-sm">
                <div className="container-custom">
                    <h1 className="text-2xl font-bold mb-6">エンジニア案件を探す</h1>
                    <form className="relative max-w-3xl">
                        <input
                            type="text"
                            name="q"
                            defaultValue={q}
                            placeholder="キーワードで検索（言語、フレームワーク、職種など）"
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg shadow-sm"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                        <button type="submit" className="absolute right-2 top-2 bottom-2 btn-primary px-6 rounded-lg text-sm">
                            検索
                        </button>
                    </form>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container-custom pb-20 pt-4">
                <div className="max-w-5xl mx-auto">
                    {/* Filter Section */}
                    <JobFilter jobsMeta={allJobsMeta} />

                    {/* Job Count & Sort - Flex Container */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-gray-600">
                            <span className="font-bold text-gray-900 text-xl">{count || 0}</span> 件の案件が見つかりました
                        </div>
                        <select className="border border-gray-300 rounded-lg text-sm p-2 focus:ring-primary-500 bg-white">
                            <option>新着順</option>
                            <option>単価が高い順</option>
                        </select>
                    </div>

                    {/* Job List */}
                    <JobList
                        initialJobs={jobs}
                        totalCount={count || 0}
                        searchParams={resolvedParams}
                    />
                </div>
            </div>
        </div>
    )
}
