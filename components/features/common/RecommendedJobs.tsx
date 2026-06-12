'use client'

import { useEffect, useState } from 'react'
import { Check, MapPin, JapaneseYen, Laptop } from 'lucide-react'
import { formatPriceRange, formatWorkStyle } from '@/lib/job-utils'
import type { LocationSummary, SkillSummary, WorkStyle } from '@/types'

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

type RecommendedJobsResponse = {
    jobs: RecommendedJob[]
}

export function RecommendedJobs({
    currentJobCode,
    onSelectionChange
}: {
    currentJobCode: string | null
    onSelectionChange: (selectedCodes: string[]) => void
}) {
    const [jobs, setJobs] = useState<RecommendedJob[]>([])
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    // Fetch similar jobs
    useEffect(() => {
        const fetchJobs = async () => {
            if (!currentJobCode) {
                setLoading(false)
                return
            }

            try {
                const response = await fetch(`/api/recommended-jobs?job_code=${encodeURIComponent(currentJobCode)}`)
                const data = await response.json() as RecommendedJobsResponse

                if (data.jobs.length > 0) {
                    setJobs(data.jobs)
                }
            } catch (error) {
                console.warn('Unable to fetch recommended jobs:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchJobs()
    }, [currentJobCode])

    const toggleSelection = (jobCode: string) => {
        const newSelection = selectedIds.includes(jobCode)
            ? selectedIds.filter(id => id !== jobCode)
            : [...selectedIds, jobCode]

        setSelectedIds(newSelection)
        onSelectionChange(newSelection)
    }

    if (loading) return null // or skeleton

    // Always render container to maintain layout balance
    return (
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 mb-6 min-h-[300px]">
            <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                <span className="text-xl">🔍</span>
                <span>あなたにおすすめの類似案件</span>
            </h3>
            <p className="text-xs text-gray-500 mb-4 ml-7">
                チェックを入れると、同時に問い合わせ（まとめてエントリー）が可能です。
            </p>

            {jobs.length > 0 ? (
                <div className="space-y-3">
                    {jobs.map(job => {
                        const isSelected = job.job_code ? selectedIds.includes(job.job_code) : false
                        // Extract skills
                        const skillNames = job.job_skills?.map(js => js.skills?.name).filter((skill): skill is string => Boolean(skill)).slice(0, 3) || []
                        const locationName = job.location?.name
                        return (
                            <div
                                key={job.id}
                                onClick={() => job.job_code && toggleSelection(job.job_code)}
                                className={`
                                    relative p-4 rounded-lg border-2 cursor-pointer transition-all flex gap-3 items-start bg-white group
                                    ${isSelected
                                        ? 'border-blue-500 shadow-md ring-1 ring-blue-100'
                                        : 'border-transparent shadow-sm hover:border-blue-200'}
                                `}
                            >
                                {/* Checkbox UI */}
                                <div className={`
                                    w-6 h-6 rounded border flex items-center justify-center flex-shrink-0 transition-colors mt-0.5
                                    ${isSelected
                                        ? 'bg-blue-500 border-blue-500 text-white'
                                        : 'bg-white border-gray-300 text-transparent group-hover:border-blue-300'}
                                `}>
                                    <Check size={16} strokeWidth={3} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-gray-800 line-clamp-2 leading-snug mb-2">
                                        {job.title}
                                    </p>

                                    <div className="flex flex-col gap-1.5">
                                        {/* Work Style & Price & Location */}
                                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 font-medium">
                                            <div className="flex items-center gap-1">
                                                <JapaneseYen size={12} className="text-gray-400" />
                                                <span>{formatPriceRange(job.price_min, job.price_max)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Laptop size={12} className="text-gray-400" />
                                                <span>{formatWorkStyle(job.work_style)}</span>
                                            </div>
                                            {locationName && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin size={12} className="text-gray-400" />
                                                    <span>{locationName}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Skills Tags */}
                                        {skillNames.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-0.5">
                                                {skillNames.map((skill: string) => (
                                                    <span key={skill} className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[10px] border border-blue-100">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="flex items-center justify-center h-48 text-gray-400 text-sm bg-white rounded-lg border border-dashed border-gray-300">
                    現在、おすすめの類似案件はありません。
                </div>
            )}
        </div>
    )
} 
