export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            roles: {
                Row: {
                    id: string
                    parent_id: string | null
                    name: string
                    slug: string
                    sort_order: number
                    is_active: boolean
                }
                Insert: {
                    id?: string
                    parent_id?: string | null
                    name: string
                    slug: string
                    sort_order?: number
                    is_active?: boolean
                }
                Update: {
                    id?: string
                    parent_id?: string | null
                    name?: string
                    slug?: string
                    sort_order?: number
                    is_active?: boolean
                }
            }
            skills: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    synonyms: string[] | null
                    sort_order: number
                    is_active: boolean
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    synonyms?: string[] | null
                    sort_order?: number
                    is_active?: boolean
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    synonyms?: string[] | null
                    sort_order?: number
                    is_active?: boolean
                }
            }
            locations: {
                Row: {
                    id: string
                    region: string
                    name: string
                    slug: string
                    is_active: boolean
                }
                Insert: {
                    id?: string
                    region: string
                    name: string
                    slug: string
                    is_active?: boolean
                }
                Update: {
                    id?: string
                    region?: string
                    name?: string
                    slug?: string
                    is_active?: boolean
                }
            }
            jobs: {
                Row: {
                    id: string
                    job_code: string | null
                    title: string
                    role_id: string
                    work_style: 'remote' | 'hybrid' | 'onsite'
                    price_min: number | null
                    price_max: number | null
                    location_id: string | null
                    duration_months: number | null
                    start_date: string | null
                    interview_steps: number | null
                    description_md: string
                    requirements_md: string | null
                    nice_to_have_md: string | null
                    is_active: boolean
                    status: 'draft' | 'published'
                    published_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    job_code?: string | null
                    title: string
                    role_id: string
                    work_style: 'remote' | 'hybrid' | 'onsite'
                    price_min?: number | null
                    price_max?: number | null
                    location_id?: string | null
                    duration_months?: number | null
                    start_date?: string | null
                    interview_steps?: number | null
                    description_md: string
                    requirements_md?: string | null
                    nice_to_have_md?: string | null
                    is_active?: boolean
                    status?: 'draft' | 'published'
                    published_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    job_code?: string | null
                    title?: string
                    role_id?: string
                    work_style?: 'remote' | 'hybrid' | 'onsite'
                    price_min?: number | null
                    price_max?: number | null
                    location_id?: string | null
                    duration_months?: number | null
                    start_date?: string | null
                    interview_steps?: number | null
                    description_md?: string
                    requirements_md?: string | null
                    nice_to_have_md?: string | null
                    is_active?: boolean
                    status?: 'draft' | 'published'
                    published_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            job_skills: {
                Row: {
                    job_id: string
                    skill_id: string
                }
                Insert: {
                    job_id: string
                    skill_id: string
                }
                Update: {
                    job_id?: string
                    skill_id?: string
                }
            }
            job_badges: {
                Row: {
                    id: string
                    job_id: string
                    badge_type: string
                    label: string
                    sort_order: number
                }
                Insert: {
                    id?: string
                    job_id: string
                    badge_type: string
                    label: string
                    sort_order?: number
                }
                Update: {
                    id?: string
                    job_id?: string
                    badge_type?: string
                    label?: string
                    sort_order?: number
                }
            }
            articles: {
                Row: {
                    id: string
                    title: string
                    slug: string
                    excerpt: string | null
                    content_md: string
                    status: 'draft' | 'published'
                    published_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    slug: string
                    excerpt?: string | null
                    content_md: string
                    status?: 'draft' | 'published'
                    published_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    slug?: string
                    excerpt?: string | null
                    content_md?: string
                    status?: 'draft' | 'published'
                    published_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            article_tags: {
                Row: {
                    article_id: string
                    tag_type: 'role' | 'skill' | 'work_style' | 'price_band'
                    ref_id: string | null
                    value: string | null
                }
                Insert: {
                    article_id: string
                    tag_type: 'role' | 'skill' | 'work_style' | 'price_band'
                    ref_id?: string | null
                    value?: string | null
                }
                Update: {
                    article_id?: string
                    tag_type?: 'role' | 'skill' | 'work_style' | 'price_band'
                    ref_id?: string | null
                    value?: string | null
                }
            }
            leads: {
                Row: {
                    id: string
                    name: string
                    email: string
                    role_text: string | null
                    years_of_exp: number | null
                    job_code: string | null
                    status: 'new' | 'contacted' | 'interview' | 'introduced' | 'closed'
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    email: string
                    role_text?: string | null
                    years_of_exp?: number | null
                    job_code?: string | null
                    status?: 'new' | 'contacted' | 'interview' | 'introduced' | 'closed'
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string
                    role_text?: string | null
                    years_of_exp?: number | null
                    job_code?: string | null
                    status?: 'new' | 'contacted' | 'interview' | 'introduced' | 'closed'
                    created_at?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    role: 'admin' | 'user'
                }
                Insert: {
                    id: string
                    role?: 'admin' | 'user'
                }
                Update: {
                    id?: string
                    role?: 'admin' | 'user'
                }
            }
        }
    }
}
