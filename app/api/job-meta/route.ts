import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { CountMap } from '@/components/features/jobs/job-filter-types'

interface SkillCountRow {
    name: string | null
    job_count: number
}

interface RoleCountRow {
    slug: string | null
    job_count: number
}

interface WorkStyleCountRow {
    work_style: string | null
    job_count: number
}

export async function GET() {
    try {
        const supabase = await createClient()

        // Fetch counts from the view statistics in parallel
        // For skills, we implement automatic paging loop because Supabase has a hard limit of Max Rows: 1000 per request
        const fetchAllSkills = async (): Promise<SkillCountRow[]> => {
            let allSkills: SkillCountRow[] = []
            let from = 0
            const step = 1000

            while (true) {
                const { data, error } = await supabase
                    .from('v_skills_with_count')
                    .select('name, job_count')
                    .order('name')
                    .range(from, from + step - 1)

                if (error) throw error
                if (!data || data.length === 0) break

                allSkills = allSkills.concat(data as unknown as SkillCountRow[])
                if (data.length < step) break
                from += step
            }
            return allSkills
        }

        const [skillsData, rolesRes, workStylesRes] = await Promise.all([
            fetchAllSkills(),
            supabase.from('v_roles_with_count').select('slug, job_count'),
            supabase.from('v_work_styles_with_count').select('work_style, job_count')
        ])

        if (rolesRes.error) throw rolesRes.error
        if (workStylesRes.error) throw workStylesRes.error

        const skills: CountMap = {}
        const roles: CountMap = {}
        const workStyles: CountMap = {}

        const rolesData = (rolesRes.data as unknown as RoleCountRow[]) || []
        const workStylesData = (workStylesRes.data as unknown as WorkStyleCountRow[]) || []

        skillsData.forEach(row => {
            if (row.name) {
                skills[row.name] = Number(row.job_count) || 0
            }
        })

        rolesData.forEach(row => {
            if (row.slug) {
                roles[row.slug] = Number(row.job_count) || 0
            }
        })

        workStylesData.forEach(row => {
            if (row.work_style) {
                workStyles[row.work_style] = Number(row.job_count) || 0
            }
        })

        return NextResponse.json(
            { skills, roles, workStyles },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
                }
            }
        )
    } catch (error) {
        console.error('Error fetching job meta statistics:', error)
        return NextResponse.json(
            { error: 'Internal Server Error', skills: {}, roles: {}, workStyles: {} },
            { status: 500 }
        )
    }
}
