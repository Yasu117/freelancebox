import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { LocationSummary, SkillSummary, WorkStyle } from '@/types'

type CurrentJobRow = {
    id: string
    role_id: string | null
    job_skills: { skill_id: string }[] | null
}

type RecommendedJob = {
    id: string
    title: string
    price_min: number | null
    price_max: number | null
    work_style: WorkStyle | null
    job_code: string | null
    location: LocationSummary | null
    job_skills: { skill_id?: string; skills: SkillSummary | null }[] | null
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const jobCode = searchParams.get('job_code')

    if (!jobCode) {
        return NextResponse.json({ jobs: [] })
    }

    const supabase = await createClient()

    const { data: currentJob, error: currentJobError } = await supabase
        .from('jobs')
        .select('id, role_id, job_skills(skill_id)')
        .eq('job_code', jobCode)
        .eq('status', 'published')
        .eq('is_active', true)
        .single() as { data: CurrentJobRow | null, error: { message: string } | null }

    if (currentJobError || !currentJob) {
        return NextResponse.json({ jobs: [] })
    }

    const skillIds = currentJob.job_skills?.map(js => js.skill_id) || []
    let matchingJobs: RecommendedJob[] = []

    if (skillIds.length > 0) {
        const { data: skillMatchJobs } = await supabase
            .from('jobs')
            .select(`
                id, title, price_min, price_max, work_style, job_code,
                location:locations(name),
                job_skills!inner(skill_id, skills(name))
            `)
            .eq('status', 'published')
            .eq('is_active', true)
            .neq('id', currentJob.id)
            .in('job_skills.skill_id', skillIds)
            .order('created_at', { ascending: false })
            .limit(3)

        if (skillMatchJobs) matchingJobs = skillMatchJobs as RecommendedJob[]
    }

    if (matchingJobs.length < 3 && currentJob.role_id) {
        const limit = 3 - matchingJobs.length
        const existingIds = new Set(matchingJobs.map(j => j.id))
        existingIds.add(currentJob.id)

        const { data: roleMatchJobs } = await supabase
            .from('jobs')
            .select(`
                id, title, price_min, price_max, work_style, job_code,
                location:locations(name),
                job_skills(skills(name))
            `)
            .eq('status', 'published')
            .eq('is_active', true)
            .eq('role_id', currentJob.role_id)
            .not('id', 'in', `(${Array.from(existingIds).join(',')})`)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (roleMatchJobs) {
            matchingJobs = [...matchingJobs, ...(roleMatchJobs as RecommendedJob[])]
        }
    }

    const uniqueJobs = Array.from(new Map(matchingJobs.map(item => [item.id, item])).values())

    return NextResponse.json({ jobs: uniqueJobs })
}
