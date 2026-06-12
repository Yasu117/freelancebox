'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PRICE_OPTIONS, ROLE_CATEGORIES, WORK_STYLE_MAP } from '@/lib/constants'
import { parseJobSearchParamsFromReader } from '@/lib/job-utils'
import { createClient } from '@/lib/supabase/client'
import { JobFilterHelpModal } from './JobFilterHelpModal'
import { JobFilterModal } from './JobFilterModal'
import { JobFilterToolbar } from './JobFilterToolbar'
import type { ActiveFilterTag, CountMap, FilterState, PopularFilterTag } from './job-filter-types'
import type { JobMeta, RoleSummary, WorkStyle } from '@/types'

const ROLE_MAP: Record<string, string> = {}
ROLE_CATEGORIES.forEach(cat => cat.items.forEach(item => ROLE_MAP[item.label] = item.slug))

const POPULAR_TAGS: PopularFilterTag[] = [
    { label: 'React', type: 'skill', value: 'React' },
    { label: 'Next.js', type: 'skill', value: 'Next.js' },
    { label: 'TypeScript', type: 'skill', value: 'TypeScript' },
    { label: 'Python', type: 'skill', value: 'Python' },
    { label: 'Go', type: 'skill', value: 'Go言語' },
    { label: 'AWS', type: 'skill', value: 'AWS' },
    { label: 'PM', type: 'role', value: 'pm' },
    { label: 'フルリモート', type: 'work_style', value: 'remote' },
]

type RawJobMeta = {
    id: string
    work_style: WorkStyle | null
    role: RoleSummary
    price_min: number | null
    price_max: number | null
    job_skills: { skills: { name: string | null } | null }[] | null
}

const EMPTY_FILTER_STATE: FilterState = {
    keyword: '',
    selectedRoles: [],
    selectedWorkStyles: [],
    selectedSkills: [],
    minPrice: '',
    maxPrice: '',
}

const toggleValue = (values: string[], value: string) => (
    values.includes(value)
        ? values.filter(item => item !== value)
        : [...values, value]
)

function getFilterStateFromSearchParams(searchParams: ReturnType<typeof useSearchParams>): FilterState {
    const filters = parseJobSearchParamsFromReader(searchParams)

    return {
        keyword: filters.q,
        selectedRoles: filters.roles,
        selectedWorkStyles: filters.workStyles,
        selectedSkills: filters.skills,
        minPrice: filters.minPrice?.toString() ?? '',
        maxPrice: filters.maxPrice?.toString() ?? '',
    }
}

function applyFilterStateToParams(state: FilterState, params: URLSearchParams) {
    if (state.keyword) params.set('q', state.keyword)
    else params.delete('q')

    if (state.selectedRoles.length > 0) params.set('roles', state.selectedRoles.join(','))
    else params.delete('roles')

    if (state.selectedWorkStyles.length > 0) params.set('work_styles', state.selectedWorkStyles.join(','))
    else params.delete('work_styles')

    if (state.selectedSkills.length > 0) params.set('skills', state.selectedSkills.join(','))
    else params.delete('skills')

    if (state.minPrice) params.set('min_price', state.minPrice)
    else params.delete('min_price')

    if (state.maxPrice) params.set('max_price', state.maxPrice)
    else params.delete('max_price')
}

function getActiveFilters(state: FilterState): ActiveFilterTag[] {
    const filters: ActiveFilterTag[] = []

    if (state.keyword) filters.push({ label: `"${state.keyword}"`, type: 'keyword', value: state.keyword })

    state.selectedRoles.forEach(slug => {
        const label = Object.keys(ROLE_MAP).find(key => ROLE_MAP[key] === slug)
        if (label) filters.push({ label, type: 'role', value: slug })
    })

    state.selectedWorkStyles.forEach(style => {
        const label = Object.keys(WORK_STYLE_MAP).find(key => WORK_STYLE_MAP[key] === style)
        if (label) filters.push({ label, type: 'work_style', value: style })
    })

    state.selectedSkills.forEach(skill => filters.push({ label: skill, type: 'skill', value: skill }))

    if (state.minPrice || state.maxPrice) {
        const minLabel = state.minPrice ? (PRICE_OPTIONS.find(p => p.value === state.minPrice)?.label || `${Number(state.minPrice) / 10000}万円`) : '下限なし'
        const maxLabel = state.maxPrice ? (PRICE_OPTIONS.find(p => p.value === state.maxPrice)?.label || `${Number(state.maxPrice) / 10000}万円`) : '上限なし'
        filters.push({ label: `${minLabel} 〜 ${maxLabel}`, type: 'price', value: 'price' })
    }

    return filters
}

function toggleUrlTag(params: URLSearchParams, tag: PopularFilterTag) {
    const paramName = tag.type === 'skill'
        ? 'skills'
        : tag.type === 'role'
            ? 'roles'
            : 'work_styles'

    const currentValues = params.get(paramName)?.split(',').filter(Boolean) || []
    const nextValues = toggleValue(currentValues, tag.value)

    if (nextValues.length > 0) params.set(paramName, nextValues.join(','))
    else params.delete(paramName)
}

function removeFilterFromParams(params: URLSearchParams, tag: ActiveFilterTag) {
    if (tag.type === 'keyword') {
        params.delete('q')
        return
    }

    if (tag.type === 'price') {
        params.delete('min_price')
        params.delete('max_price')
        return
    }

    const paramName = tag.type === 'role' ? 'roles' : tag.type === 'work_style' ? 'work_styles' : 'skills'
    const nextValues = params.get(paramName)?.split(',').filter(value => value && value !== tag.value) || []

    if (nextValues.length > 0) params.set(paramName, nextValues.join(','))
    else params.delete(paramName)
}

export function JobFilter({ jobsMeta }: { jobsMeta?: JobMeta[] }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentFilters = getFilterStateFromSearchParams(searchParams)

    const [isOpen, setIsOpen] = useState(false)
    const [showHelp, setShowHelp] = useState(false)
    const [draftFilters, setDraftFilters] = useState<FilterState>(currentFilters)
    const [fetchedMeta, setFetchedMeta] = useState<JobMeta[]>([])

    const effectiveMeta = (jobsMeta && jobsMeta.length > 0) ? jobsMeta : fetchedMeta

    useEffect(() => {
        if (jobsMeta && jobsMeta.length > 0) return

        const fetchMeta = async () => {
            const supabase = createClient()
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

            if (!rawMeta) return

            const formatted = (rawMeta as RawJobMeta[]).map((job) => ({
                id: job.id,
                work_style: job.work_style,
                role: job.role,
                price_min: job.price_min,
                price_max: job.price_max,
                skills: job.job_skills?.map(js => js.skills?.name).filter((skill): skill is string => Boolean(skill)) || []
            }))
            setFetchedMeta(formatted)
        }

        fetchMeta()
    }, [jobsMeta])

    const skillCounts: CountMap = {}
    effectiveMeta.forEach(job => {
        job.skills.forEach(skill => {
            skillCounts[skill] = (skillCounts[skill] || 0) + 1
        })
    })

    const popularSkillTags: PopularFilterTag[] = Object.entries(skillCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([skill]) => ({ label: skill, type: 'skill', value: skill }))

    const remoteCount = effectiveMeta.filter(j => j.work_style === 'remote').length
    const dynamicTags: PopularFilterTag[] = [
        ...popularSkillTags,
        ...(remoteCount > 0 ? [{ label: 'フルリモート', type: 'work_style' as const, value: 'remote' }] : [])
    ]
    const displayTags = dynamicTags.length > 0 ? dynamicTags : POPULAR_TAGS
    const activeFilters = getActiveFilters(currentFilters)

    const updateDraft = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        setDraftFilters(current => ({ ...current, [key]: value }))
    }

    const toggleDraftListValue = (
        key: 'selectedRoles' | 'selectedWorkStyles' | 'selectedSkills',
        value: string
    ) => {
        setDraftFilters(current => ({ ...current, [key]: toggleValue(current[key], value) }))
    }

    const syncDraftWithCurrentFilters = () => setDraftFilters(currentFilters)

    const clearDraftFilters = () => setDraftFilters(EMPTY_FILTER_STATE)

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString())
        applyFilterStateToParams(draftFilters, params)
        router.push(`/jobs?${params.toString()}`)
        setIsOpen(false)
    }

    const toggleTag = (tag: PopularFilterTag) => {
        const params = new URLSearchParams(searchParams.toString())
        toggleUrlTag(params, tag)
        router.push(`/jobs?${params.toString()}`)
    }

    const removeFilter = (tag: ActiveFilterTag) => {
        const params = new URLSearchParams(searchParams.toString())
        removeFilterFromParams(params, tag)
        router.push(`/jobs?${params.toString()}`)
    }

    const resetFilters = () => {
        clearDraftFilters()
        router.push('/jobs')
    }

    const baseFilter = (job: JobMeta, excludeType: 'role' | 'skill' | 'work_style') => {
        if (draftFilters.minPrice && (job.price_min === null || job.price_min < Number(draftFilters.minPrice))) return false
        if (draftFilters.maxPrice && (job.price_max === null || job.price_max > Number(draftFilters.maxPrice))) return false

        if (excludeType !== 'role' && draftFilters.selectedRoles.length > 0) {
            if (!job.role.slug || !draftFilters.selectedRoles.includes(job.role.slug)) return false
        }

        if (excludeType !== 'skill' && draftFilters.selectedSkills.length > 0) {
            const hasMatch = job.skills.some(s => draftFilters.selectedSkills.includes(s))
            if (!hasMatch) return false
        }

        if (excludeType !== 'work_style' && draftFilters.selectedWorkStyles.length > 0) {
            if (!job.work_style || !draftFilters.selectedWorkStyles.includes(job.work_style)) return false
        }

        return true
    }

    const getCounts = (type: 'role' | 'skill' | 'work_style') => {
        const counts: CountMap = {}

        effectiveMeta.forEach(job => {
            if (!baseFilter(job, type)) return

            if (type === 'role' && job.role.slug) {
                counts[job.role.slug] = (counts[job.role.slug] || 0) + 1
            } else if (type === 'work_style' && job.work_style) {
                counts[job.work_style] = (counts[job.work_style] || 0) + 1
            } else if (type === 'skill') {
                job.skills.forEach(skill => {
                    counts[skill] = (counts[skill] || 0) + 1
                })
            }
        })

        return counts
    }

    return (
        <div className="mb-6">
            <JobFilterToolbar
                activeFilters={activeFilters}
                currentFilters={currentFilters}
                displayTags={displayTags}
                onOpenFilters={() => {
                    syncDraftWithCurrentFilters()
                    setIsOpen(true)
                }}
                onOpenHelp={() => setShowHelp(true)}
                onRemoveFilter={removeFilter}
                onReset={resetFilters}
                onToggleTag={toggleTag}
            />

            {isOpen && (
                <JobFilterModal
                    draftFilters={draftFilters}
                    roleCounts={getCounts('role')}
                    skillCounts={getCounts('skill')}
                    workStyleCounts={getCounts('work_style')}
                    onApply={applyFilters}
                    onClear={clearDraftFilters}
                    onClose={() => setIsOpen(false)}
                    onKeywordChange={(value) => updateDraft('keyword', value)}
                    onMaxPriceChange={(value) => updateDraft('maxPrice', value)}
                    onMinPriceChange={(value) => updateDraft('minPrice', value)}
                    onToggleRole={(value) => toggleDraftListValue('selectedRoles', value)}
                    onToggleSkill={(value) => toggleDraftListValue('selectedSkills', value)}
                    onToggleWorkStyle={(value) => toggleDraftListValue('selectedWorkStyles', value)}
                />
            )}

            {showHelp && <JobFilterHelpModal onClose={() => setShowHelp(false)} />}
        </div>
    )
}
