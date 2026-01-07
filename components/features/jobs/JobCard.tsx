import Link from 'next/link'
import { MapPin, Briefcase, Clock, Banknote } from 'lucide-react'

export function JobCard({ job }: { job: any }) {
    return (
        <Link href={`/jobs/${job.id}`} className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow group">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">{job.title}</h3>
                {job.status === 'new' && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded whitespace-nowrap ml-2">NEW</span>}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {job.skills?.map((skill: any, i: number) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-medium">{skill.name}</span>
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-4 text-sm text-gray-600">
                <div className="flex items-center gap-1.5 font-bold text-gray-900">
                    <Banknote size={16} className="text-primary-600" />
                    <span>
                        {job.price_min > 9999 ? Math.floor(job.price_min / 10000) : job.price_min}
                        -
                        {job.price_max > 9999 ? Math.floor(job.price_max / 10000) : job.price_max}
                        万円
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Briefcase size={16} className="text-gray-400" />
                    <span>{job.work_style === 'remote' ? 'フルリモート' : '常駐/ハイブリッド'}</span>
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
