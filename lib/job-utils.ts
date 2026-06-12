import { parseSearchQuery } from '@/lib/search-utils'
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

export function parseJobSearchParams(params: SearchParamRecord): ParsedJobSearchParams {
    return {
        q: typeof params.q === 'string' ? params.q : '',
        roles: splitParam(params.roles),
        workStyles: splitParam(params.work_styles),
        skills: splitParam(params.skills),
        minPrice: numberParam(params.min_price),
        maxPrice: numberParam(params.max_price),
    }
}

export function parseJobSearchParamsFromReader(params: ParamReader): ParsedJobSearchParams {
    return {
        q: params.get('q') ?? '',
        roles: splitParam(params.get('roles')),
        workStyles: splitParam(params.get('work_styles')),
        skills: splitParam(params.get('skills')),
        minPrice: numberParam(params.get('min_price')),
        maxPrice: numberParam(params.get('max_price')),
    }
}

export function createKeywordOrFilters(keyword: string): string[] {
    if (!keyword) return []

    return parseSearchQuery(keyword).map(variants =>
        variants.map(variant =>
            `title.ilike.%${variant}%,description_md.ilike.%${variant}%,requirements_md.ilike.%${variant}%`
        ).join(',')
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
