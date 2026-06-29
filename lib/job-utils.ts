import { parseSearchQuery } from '@/lib/search-utils'
import { SKILL_CATEGORIES } from '@/lib/constants'

// Create a lowercase map for skill keywords to target structured query conversion
const ALL_SKILLS_MAP: Record<string, string> = {}
SKILL_CATEGORIES.forEach(cat => {
    cat.items.forEach(skillName => {
        const cleanName = skillName.toLowerCase()
        ALL_SKILLS_MAP[cleanName] = skillName
        // Alias Go keyword to Go言語
        if (cleanName === 'go言語') {
            ALL_SKILLS_MAP['go'] = skillName
        }
    })
})

import type {
    JobListItem,
    LocationSummary,
    RoleSummary,
    SearchParamRecord,
    SkillSummary,
    WorkStyle,
} from '@/types'

export const ITEMS_PER_PAGE = 20

export type JobSkillRow =
    | { skills: SkillSummary | null }
    | { skill: SkillSummary | null }

export interface JobListRow {
    id: string
    job_code: string | null
    title: string
    price_min: number | null
    price_max: number | null
    work_style: WorkStyle | null
    status?: 'draft' | 'published' | 'new'
    created_at?: string | null
    location: LocationSummary | null
    role?: RoleSummary | null
    job_skills?: JobSkillRow[] | null
}

export interface ParsedJobSearchParams {
    q: string
    roles: string[]
    workStyles: string[]
    skills: string[]
    minPrice: number | null
    maxPrice: number | null
}

type ParamReader = {
    get(name: string): string | null
}

function splitParam(value: string | string[] | undefined | null): string[] {
    const rawValue = Array.isArray(value) ? value.join(',') : value
    return rawValue?.split(',').map(item => item.trim()).filter(Boolean) ?? []
}

function numberParam(value: string | string[] | undefined | null): number | null {
    const rawValue = Array.isArray(value) ? value[0] : value
    if (!rawValue) return null

    const numericValue = Number(rawValue)
    return Number.isFinite(numericValue) ? numericValue : null
}

function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const BOUNDARY_KEYWORDS = new Set([
    'java', 'c', 'c#', 'c++', 'go', 'sql', 'typescript', 'javascript'
])

export function parseJobSearchParams(params: SearchParamRecord): ParsedJobSearchParams {
    let q = typeof params.q === 'string' ? params.q : ''
    const workStyles = splitParam(params.work_styles)
    const skills = splitParam(params.skills)

    if (q) {
        const remoteRegex = /(フルリモート|完全リモート|在宅|remote)/gi
        const hybridRegex = /(リモート可|ハイブリッド|hybrid)/gi

        if (remoteRegex.test(q)) {
            if (!workStyles.includes('remote')) workStyles.push('remote')
            q = q.replace(remoteRegex, '').replace(/\s+/g, ' ').trim()
        }
        if (hybridRegex.test(q)) {
            if (!workStyles.includes('hybrid')) workStyles.push('hybrid')
            q = q.replace(hybridRegex, '').replace(/\s+/g, ' ').trim()
        }

        // Convert matching skill keywords into structured skills parameters to optimize speed
        const cleanQ = q.trim().toLowerCase()
        if (ALL_SKILLS_MAP[cleanQ]) {
            const matchedSkill = ALL_SKILLS_MAP[cleanQ]
            if (!skills.includes(matchedSkill)) {
                skills.push(matchedSkill)
            }
            q = ''
        }
    }

    return {
        q,
        roles: splitParam(params.roles),
        workStyles,
        skills,
        minPrice: numberParam(params.min_price),
        maxPrice: numberParam(params.max_price),
    }
}

export function parseJobSearchParamsFromReader(params: ParamReader): ParsedJobSearchParams {
    let q = params.get('q') ?? ''
    const workStyles = splitParam(params.get('work_styles'))
    const skills = splitParam(params.get('skills'))

    if (q) {
        const remoteRegex = /(フルリモート|完全リモート|在宅|remote)/gi
        const hybridRegex = /(リモート可|ハイブリッド|hybrid)/gi

        if (remoteRegex.test(q)) {
            if (!workStyles.includes('remote')) workStyles.push('remote')
            q = q.replace(remoteRegex, '').replace(/\s+/g, ' ').trim()
        }
        if (hybridRegex.test(q)) {
            if (!workStyles.includes('hybrid')) workStyles.push('hybrid')
            q = q.replace(hybridRegex, '').replace(/\s+/g, ' ').trim()
        }

        // Convert matching skill keywords into structured skills parameters to optimize speed
        const cleanQ = q.trim().toLowerCase()
        if (ALL_SKILLS_MAP[cleanQ]) {
            const matchedSkill = ALL_SKILLS_MAP[cleanQ]
            if (!skills.includes(matchedSkill)) {
                skills.push(matchedSkill)
            }
            q = ''
        }
    }

    return {
        q,
        roles: splitParam(params.get('roles')),
        workStyles,
        skills,
        minPrice: numberParam(params.get('min_price')),
        maxPrice: numberParam(params.get('max_price')),
    }
}

export function createKeywordOrFilters(keyword: string): string[] {
    if (!keyword) return []

    return parseSearchQuery(keyword).map(variants =>
        variants.map(variant => {
            const isBoundary = BOUNDARY_KEYWORDS.has(variant.toLowerCase())
            const operator = isBoundary ? 'imatch' : 'ilike'
            const searchVal = isBoundary ? `\\y${escapeRegex(variant)}\\y` : `%${variant}%`
            return `title.${operator}.${searchVal},description_md.${operator}.${searchVal},requirements_md.${operator}.${searchVal}`
        }).join(',')
    )
}

export function getJobSkillSelect(skills: string[], forHeadQuery = false): string {
    if (skills.length > 0) {
        return forHeadQuery
            ? ', job_skills!inner(skills!inner(name))'
            : 'job_skills!inner(skills!inner(name))'
    }

    return forHeadQuery ? '' : 'job_skills(skills(name))'
}

function getSkillFromRow(row: JobSkillRow): SkillSummary | null {
    if ('skills' in row) return row.skills
    return row.skill
}

export function mapJobListItem(job: JobListRow): JobListItem {
    return {
        ...job,
        skills: job.job_skills?.map(getSkillFromRow).filter((skill): skill is SkillSummary => Boolean(skill)) ?? [],
    }
}

export function mapJobListItems(jobs: JobListRow[] | null): JobListItem[] {
    return jobs?.map(mapJobListItem) ?? []
}

export function formatPriceRange(priceMin: number | null, priceMax: number | null): string {
    if (!priceMax) return '詳細はお問い合わせください'

    const min = priceMin ? Math.floor(priceMin / 10000) : null
    const max = Math.floor(priceMax / 10000)

    return min ? `${min}-${max}万円` : `〜${max}万円`
}

export function formatWorkStyle(workStyle: WorkStyle | null): string {
    if (workStyle === 'remote') return 'フルリモート'
    if (workStyle === 'hybrid') return 'リモート可'
    if (workStyle === 'onsite') return '常駐'
    return '常駐/ハイブリッド'
}

export function isNewJob(createdAt: string | null | undefined, now = new Date()): boolean {
    if (!createdAt) return false

    const createdTime = new Date(createdAt).getTime()
    if (Number.isNaN(createdTime)) return false

    return now.getTime() - createdTime < 7 * 24 * 60 * 60 * 1000
}
