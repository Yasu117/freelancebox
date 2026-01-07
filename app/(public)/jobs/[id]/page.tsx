import { ArrowRight, MapPin, Briefcase, Clock, Wallet } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { notFound } from 'next/navigation'

// Mock Fetch
async function getJob(id: string) {
    if (id === '1') {
        return {
            id: '1',
            title: '【Go/フルリモート】動画プラットフォームのバックエンド開発',
            price_min: 80,
            price_max: 100,
            work_style: 'remote',
            location: { name: '東京' },
            skills: [{ name: 'Go' }, { name: 'AWS' }, { name: 'Docker' }],
            description_md: `
## 案件概要
大手エンターテインメント企業が運営する動画配信プラットフォームのバックエンド開発を担当していただきます。
マイクロサービスアーキテクチャを採用しており、Goを用いた高負荷対策やパフォーマンスチューニングが主な業務となります。

## 開発環境
- 言語: Go
- インフラ: AWS (ECS, RDS, ElastiCache)
- DB: Aurora (MySQL)
- その他: Docker, GitHub Actions, Terraform

## チーム体制
- スクラム開発を採用しています。
- バックエンドエンジニア: 5名
- フロントエンドエンジニア: 4名
- SRE: 2名
            `,
            requirements_md: `
- Goを用いたWebアプリケーション開発経験（3年以上）
- AWSを用いたインフラ構築・運用経験
- Dockerを用いたコンテナ開発経験
            `,
            nice_to_have_md: `
- 大規模トラフィックシステムの開発・運用経験
- 動画配信技術に関する知識（HLS, DASHなど）
            `,
            status: 'published'
        }
    }
    return null
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const job = await getJob(id)

    // Demo Fallback
    const displayJob = job || (await getJob('1'))!

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="bg-white border-b border-gray-200">
                <div className="container-custom py-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6 flex flex-wrap gap-2">
                            {displayJob.skills.map((skill: any, i: number) => (
                                <span key={i} className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full font-bold">
                                    {skill.name}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                            {displayJob.title}
                        </h1>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <div>
                                <div className="text-sm text-gray-500 mb-1 flex items-center gap-1"><Wallet size={16} /> 単価</div>
                                <div className="text-xl font-bold text-gray-900">{displayJob.price_min}-{displayJob.price_max}万円</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 mb-1 flex items-center gap-1"><Briefcase size={16} /> 働き方</div>
                                <div className="text-xl font-bold text-gray-900">{displayJob.work_style === 'remote' ? 'フルリモート' : '常駐/ハイブリッド'}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 mb-1 flex items-center gap-1"><MapPin size={16} /> 場所</div>
                                <div className="text-xl font-bold text-gray-900">{displayJob.location?.name}</div>
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
                            <ReactMarkdown>{displayJob.description_md}</ReactMarkdown>

                            <h3 className="text-xl font-bold mt-8 mb-4">必須スキル</h3>
                            <ReactMarkdown>{displayJob.requirements_md || ''}</ReactMarkdown>

                            <h3 className="text-xl font-bold mt-8 mb-4">尚可スキル</h3>
                            <ReactMarkdown>{displayJob.nice_to_have_md || ''}</ReactMarkdown>
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
                                    <Link href="/register" className="btn-primary w-full py-4 text-center font-bold text-lg flex items-center justify-center gap-2 shadow-xl">
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
