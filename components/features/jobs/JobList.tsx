'use client'

import { useState } from 'react'
import { JobCard } from './JobCard'
import { createClient } from '@/lib/supabase/client'

type Job = any // In a real app we'd import the type

const ITEMS_PER_PAGE = 20

export function JobList({
    initialJobs,
    totalCount,
    searchParams
}: {
    initialJobs: Job[],
    totalCount: number,
    searchParams: any
}) {
    const [jobs, setJobs] = useState<Job[]>(initialJobs)
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

        const skills = searchParams.skills ? searchParams.skills.split(',') : []

        // Configure select for filtering by skills if needed
        const skillSelect = skills.length > 0
            ? 'job_skills!inner(skills!inner(name))'
            : 'job_skills(skills(name))'

        let query = supabase
            .from('jobs')
            .select(`
                *,
                location:locations(name),
                role:roles!inner(name, slug),
                ${skillSelect}
            `)
            .eq('status', 'published')
            .range(from, to)

        if (searchParams.q) {
            query = query.or(`title.ilike.%${searchParams.q}%,description_md.ilike.%${searchParams.q}%,requirements_md.ilike.%${searchParams.q}%`)
        }
        if (searchParams.roles) query = query.in('role.slug', searchParams.roles.split(','))
        if (searchParams.work_styles) query = query.in('work_style', searchParams.work_styles.split(','))
        if (searchParams.min_price) query = query.gte('price_min', Number(searchParams.min_price))
        if (searchParams.max_price) query = query.lte('price_max', Number(searchParams.max_price))

        if (skills.length > 0) {
            query = query.in('job_skills.skills.name', skills)
        }

        const { data, error } = await query.order('created_at', { ascending: false })

        if (error) {
            console.error('Error loading more jobs:', error)
        } else if (data) {
            const newJobs = (data as any[]).map(job => ({
                ...job,
                skills: job.job_skills?.map((js: any) => js.skills) || []
            }))
            // Filter out existing jobs to avoid 'duplicate key' errors if database changed or query overlap
            // Using a Map for efficient ID checking from existing jobs state

            // Actually, simplified approach:
            setJobs(prev => {
                const existingIds = new Set(prev.map(j => j.id))
                const uniqueNewJobs = newJobs.filter(j => !existingIds.has(j.id))
                return [...prev, ...uniqueNewJobs]
            })
            setPage(page + 1)
        }

        setLoading(false)
    }

    return (
        <div>
            <div className="space-y-4">
                {jobs.map((job: Job) => (
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
