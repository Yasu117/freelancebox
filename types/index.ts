export type WorkStyle = 'remote' | 'hybrid' | 'onsite'
export type PublicationStatus = 'draft' | 'published' | 'archived'

export type SearchParamValue = string | string[] | undefined
export type SearchParamRecord = Record<string, SearchParamValue>

export interface SkillSummary {
    name: string | null
}

export interface LocationSummary {
    name: string | null
}

export interface RoleSummary {
    name?: string | null
    slug: string | null
}

export interface JobListItem {
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
    skills: SkillSummary[]
}

export interface JobMeta {
    id: string
    work_style: WorkStyle | null
    role: RoleSummary
    price_min: number | null
    price_max: number | null
    skills: string[]
}

export interface Article {
    id: string
    slug: string
    title: string
    description: string | null
    content: string | null
    thumbnail_url: string | null
    category: string | null
    tags: string[] | null
    faq: { question: string; answer: string }[] | null
    status: PublicationStatus
    published_at: string | null
    created_at: string
    updated_at: string
}

export type ArticleSummary = Pick<Article, 'slug' | 'title' | 'thumbnail_url' | 'published_at'>
