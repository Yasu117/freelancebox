import Link from 'next/link'
import { MapPin, Briefcase, Clock, Banknote, Hash } from 'lucide-react'
import { formatPriceRange, formatWorkStyle } from '@/lib/job-utils'
import type { JobListItem } from '@/types'

export function JobCard({ job }: { job: JobListItem }) {
    return (
        <Link href={`/jobs/${job.job_code}`} className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow group">
            {job.job_code && (
                <div className="mb-2">
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        <Hash size={12} />
                        {job.job_code}
                    </span>
                </div>
            )}
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">{job.title}</h3>
                {job.status === 'new' && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded whitespace-nowrap ml-2">NEW</span>}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {job.skills?.map((skill, i) => (
                    <span key={`${skill.name ?? 'skill'}-${i}`} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-medium">{skill.name}</span>
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-4 text-sm text-gray-600">
                <div className="flex items-center gap-1.5 font-bold text-gray-900">
                    <Banknote size={16} className="text-primary-600" />
                    <span>{formatPriceRange(job.price_min, job.price_max)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Briefcase size={16} className="text-gray-400" />
                    <span>{formatWorkStyle(job.work_style)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-gray-400" />
                    <span>{job.location?.name || '東京'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock size={16} className="text-gray-400" />
                    <span>即日可</span>
                </div>
            </div>
        </Link>
    )
}
