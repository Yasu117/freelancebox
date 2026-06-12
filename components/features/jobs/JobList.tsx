'use client'

import { useState } from 'react'
import { JobCard } from './JobCard'
import {
    createKeywordOrFilters,
    getJobSkillSelect,
    ITEMS_PER_PAGE,
    mapJobListItems,
    parseJobSearchParams,
    type JobListRow,
} from '@/lib/job-utils'
import { createClient } from '@/lib/supabase/client'
import type { JobListItem, SearchParamRecord } from '@/types'

export function JobList({
    initialJobs,
    totalCount,
    searchParams
}: {
    initialJobs: JobListItem[],
    totalCount: number,
    searchParams: SearchParamRecord
}) {
    const [jobs, setJobs] = useState<JobListItem[]>(initialJobs)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)

    // Check if we've loaded all jobs. 
    // This is a simple check: if current count >= total known count.
    const hasMore = jobs.length < totalCount

    const loadMore = async () => {
        if (loading || !hasMore) return
        setLoading(true)

        const supabase = createClient()
        const from = page * ITEMS_PER_PAGE
        const to = from + ITEMS_PER_PAGE - 1
        const filters = parseJobSearchParams(searchParams)

        // Configure select for filtering by skills if needed
        const skillSelect = getJobSkillSelect(filters.skills)

        let query = supabase
            .from('jobs')
            .select(`
                *,
                location:locations(name),
                role:roles!inner(name, slug),
                ${skillSelect}
            `)
            .eq('status', 'published')
            .eq('is_active', true)
            .range(from, to)

        createKeywordOrFilters(filters.q).forEach(orFilter => {
            query = query.or(orFilter)
        })
        if (filters.roles.length > 0) query = query.in('role.slug', filters.roles)
        if (filters.workStyles.length > 0) query = query.in('work_style', filters.workStyles)
        if (filters.minPrice !== null) query = query.gte('price_min', filters.minPrice)
        if (filters.maxPrice !== null) query = query.lte('price_max', filters.maxPrice)

        if (filters.skills.length > 0) {
            query = query.in('job_skills.skills.name', filters.skills)
        }

        const { data, error } = await query.order('created_at', { ascending: false })

        if (error) {
            console.warn('Unable to load more jobs:', error)
        } else if (data) {
            const newJobs = mapJobListItems(data as JobListRow[])
            // Filter out existing jobs to avoid 'duplicate key' errors if database changed or query overlap
            // Using a Map for efficient ID checking from existing jobs state

            // Actually, simplified approach:
            setJobs(prev => {
                const existingIds = new Set(prev.map(j => j.id))
                const uniqueNewJobs = newJobs.filter(j => !existingIds.has(j.id))
                return [...prev, ...uniqueNewJobs]
            })
            setPage(currentPage => currentPage + 1)
        }

        setLoading(false)
    }

    return (
        <div>
            <div className="space-y-4">
                {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>

            {hasMore && (
                <div className="mt-12 flex justify-center">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="btn-primary-outline px-8 py-3 rounded-full text-sm font-bold min-w-[200px] flex justify-center items-center"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            'もっと見る'
                        )}
                    </button>
                </div>
            )}

            {!hasMore && jobs.length > 0 && (
                <div className="mt-12 text-center text-gray-400 text-sm">
                    すべての案件を表示しました
                </div>
            )}
        </div>
    )
}
