import { JobList } from '@/components/features/jobs/JobList'
import { JobFilter } from '@/components/features/jobs/JobFilter'
import { ITEMS_PER_PAGE, mapJobListItems, parseJobSearchParams, type JobListRow } from '@/lib/job-utils'
import { publicJobQuery } from '@/lib/public-job-query'
import { createClient } from '@/lib/supabase/server'
import { Search } from 'lucide-react'
import type { SearchParamRecord } from '@/types'

export default async function JobsPage({
    searchParams,
}: {
    searchParams: Promise<SearchParamRecord>
}) {
    const resolvedParams = await searchParams
    const filters = parseJobSearchParams(resolvedParams)

    const supabase = await createClient()

    const { data, error } = await publicJobQuery(supabase, filters)
        .order('created_at', { ascending: false })
        .range(0, ITEMS_PER_PAGE)

    if (error) console.warn('Unable to fetch jobs:', error)

    const jobs = error || data === null ? null : mapJobListItems(data.slice(0, ITEMS_PER_PAGE) as JobListRow[])

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
                            defaultValue={filters.q}
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
                    <JobFilter />

                    {jobs === null ? (
                        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
                            <p role="alert">案件を取得できませんでした。</p>
                            <form method="get" action="/jobs" className="mt-4">
                                {Object.entries(resolvedParams).flatMap(([name, value]) =>
                                    (Array.isArray(value) ? value : [value]).map((item, index) =>
                                        item === undefined ? null : (
                                            <input key={`${name}:${index}`} type="hidden" name={name} value={item} />
                                        )
                                    )
                                )}
                                <button type="submit" className="btn-primary px-6 py-2">再試行</button>
                            </form>
                        </div>
                    ) : (
                        <JobList
                            key={JSON.stringify(resolvedParams)}
                            initialJobs={jobs}
                            initialHasMore={(data?.length ?? 0) > ITEMS_PER_PAGE}
                            filters={filters}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
