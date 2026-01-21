import { ArrowRight, MapPin, Briefcase, Clock, Wallet, Hash } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function getJob(code: string) {
    const supabase = await createClient()

    // Fetch job with relations
    const { data: job, error } = await supabase
        .from('jobs')
        .select(`
            *,
            location:locations(name),
            job_skills(
                skill:skills(name)
            )
        `)
        .eq('job_code', code)
        .eq('status', 'published') // Ensure only published jobs are viewable
        .single()

    if (error || !job) {
        return null
    }

    // Transform to match UI expectations
    return {
        ...job,
        location: job.location, // flat object from join
        skills: job.job_skills.map((js: any) => js.skill) // flatten skills
    }
}

export default async function JobDetailPage({ params }: { params: Promise<{ job_code: string }> }) {
    const { job_code } = await params
    const job = await getJob(job_code)

    if (!job) {
        notFound()
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="bg-white border-b border-gray-200">
                <div className="container-custom pt-20 pb-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                            <div className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm font-mono">
                                <Hash size={14} />
                                {job.job_code || 'No ID'}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.map((skill: any, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full font-bold">
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                            {job.title}
                        </h1>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <div>
                                <div className="text-sm text-gray-500 mb-1 flex items-center gap-1"><Wallet size={16} /> 単価</div>
                                <div className="text-xl font-bold text-gray-900">
                                    {job.price_max === 0 ? '詳細はお問い合わせください' : `${job.price_min > 9999 ? Math.floor(job.price_min / 10000) : job.price_min}-${job.price_max > 9999 ? Math.floor(job.price_max / 10000) : job.price_max}万円`}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 mb-1 flex items-center gap-1"><Briefcase size={16} /> 働き方</div>
                                <div className="text-xl font-bold text-gray-900">{job.work_style === 'remote' ? 'フルリモート' : '常駐/ハイブリッド'}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 mb-1 flex items-center gap-1"><MapPin size={16} /> 場所</div>
                                <div className="text-xl font-bold text-gray-900">{job.location?.name || 'その他'}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 mb-1 flex items-center gap-1"><Clock size={16} /> 期間</div>
                                <div className="text-xl font-bold text-gray-900">長期</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-custom py-12">
                <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
                    {/* Main Content */}
                    <main className="lg:w-2/3 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 h-fit">
                        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600">
                            <ReactMarkdown
                                components={{
                                    h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-10 mb-4 border-l-4 border-blue-500 pl-3" {...props} />,
                                    h3: ({ node, ...props }) => <h3 className="text-base font-normal mt-6 mb-2 text-gray-900" {...props} />
                                }}
                            >
                                {job.description_md || ''}
                            </ReactMarkdown>

                            <h2 className="text-xl font-bold mt-10 mb-4 border-l-4 border-blue-500 pl-3">【必須スキル】</h2>
                            <ReactMarkdown>{job.requirements_md || ''}</ReactMarkdown>

                            {job.nice_to_have_md && (
                                <>
                                    <h2 className="text-xl font-bold mt-10 mb-4 border-l-4 border-blue-500 pl-3">【尚可スキル】</h2>
                                    <ReactMarkdown>{job.nice_to_have_md}</ReactMarkdown>
                                </>
                            )}
                        </div>
                    </main>

                    {/* Sidebar CTA */}
                    <aside className="lg:w-1/3">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white p-8 rounded-2xl shadow-lg border border-primary-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full mix-blend-multiply filter blur-2xl opacity-50 -mr-10 -mt-10"></div>
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold mb-2">この案件に詳細を聞く</h3>
                                    <p className="text-gray-500 text-sm mb-6">
                                        詳しい業務内容や、商流、チームの雰囲気など、気になる点があればお気軽にご相談ください。
                                    </p>
                                    <Link
                                        href={`/register?job_code=${job.job_code || ''}`}
                                        className="btn-primary w-full py-4 text-center font-bold text-lg flex items-center justify-center gap-2 shadow-xl"
                                    >
                                        無料相談・エントリー <ArrowRight className="w-5 h-5" />
                                    </Link>
                                    <p className="mt-4 text-xs text-center text-gray-400">
                                        登録後、担当コンサルタントより2営業日以内にご連絡いたします。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
