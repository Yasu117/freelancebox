import Link from 'next/link'
import { Search, MapPin, DollarSign, ChevronRight, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { JobCard } from '@/components/features/jobs/JobCard'
import { CompactArticleCard } from '@/components/features/articles/CompactArticleCard'

export default async function LandingPage() {
    const supabase = await createClient()
    const { count } = await supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('is_active', true)

    const { data: latestJobs } = await supabase
        .from('jobs')
        .select(`
            id, title, price_min, price_max, work_style, job_code, created_at,
            location:locations(name),
            job_skills(skills(name))
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(5)

    const { data: articles } = await supabase
        .from('articles')
        .select('slug, title, thumbnail_url, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(12)

    const newArticles = articles ? articles.slice(0, 6) : []
    const popularArticles = articles && articles.length > 6 ? articles.slice(6, 12) : []

    return (
        <div className="bg-white min-h-screen font-sans text-gray-800">
            {/* Hero Section */}
            <section className="bg-blue-50/80 border-b border-blue-100 py-20 pb-28">
                <div className="container-custom max-w-5xl mx-auto text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight leading-tight">
                        フリーランスエンジニア・ITフリーランスの<br />
                        <span className="text-blue-600">案件・求人・仕事</span>をまとめて検索
                    </h1>
                    <p className="text-gray-600 mb-10 text-lg">
                        <span className="font-bold text-xl mr-3">案件数 {count?.toLocaleString() || '0'}件</span>
                        <span className="text-sm text-gray-500">{new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short', timeZone: 'Asia/Tokyo' })}更新</span>
                    </p>

                    {/* Search Bar */}
                    <form action="/jobs" method="GET" className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 max-w-3xl mx-auto flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-grow">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                name="q"
                                placeholder="キーワード、スキル、職種などで検索"
                                className="w-full pl-12 pr-4 py-3 rounded-md outline-none text-gray-700 placeholder:text-gray-400"
                            />
                        </div>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md transition-colors whitespace-nowrap">
                            検索する
                        </button>
                    </form>

                    <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
                        <span className="font-bold text-gray-600">注目ワード:</span>
                        <Link href="/jobs?q=Java" className="hover:text-blue-600 hover:underline">Java</Link>
                        <Link href="/jobs?q=Python" className="hover:text-blue-600 hover:underline">Python</Link>
                        <Link href="/jobs?q=PM" className="hover:text-blue-600 hover:underline">PM</Link>
                        <Link href="/jobs?q=フルリモート" className="hover:text-blue-600 hover:underline">フルリモート</Link>
                        <Link href="/jobs?q=週3日" className="hover:text-blue-600 hover:underline">週3日〜</Link>
                    </div>
                </div>
            </section>

            {/* Introduction / About */}
            <section className="py-20 bg-white">
                <div className="container-custom max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600 mb-4 inline-block border-b-4 border-blue-100 pb-2">
                            FreelanceBoxの特徴
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <div className="text-blue-600 font-bold text-lg mb-2 flex items-center gap-2">
                                <span className="bg-blue-100 p-2 rounded-lg">01</span>
                                <span>POINT</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 border-l-4 border-blue-600 pl-4">“今動いている”案件だけを扱う、<br />鮮度重視のマッチング</h3>
                            <div className="text-gray-600 leading-relaxed text-sm space-y-3">
                                <p className="font-bold text-blue-800">「フリーランス市場では、情報の“量”以上に“鮮度”がカギを握ります」</p>
                                <p>
                                    掲載案件は、「募集停止」「実質クローズ」「温度感が低い案件」を除外。<br />
                                    今まさに動いている案件に絞って提案します。
                                </p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="text-blue-600 font-bold text-lg mb-2 flex items-center gap-2">
                                <span className="bg-blue-100 p-2 rounded-lg">02</span>
                                <span>POINT</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 border-l-4 border-blue-600 pl-4">更新・提案スピードを<br />前提にした設計</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                案件はストックせず、動きがあったものから即反映。<br />
                                早く動いた人が、良い条件を取れる市場構造を活かします。
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="text-blue-600 font-bold text-lg mb-2 flex items-center gap-2">
                                <span className="bg-blue-100 p-2 rounded-lg">03</span>
                                <span>POINT</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 border-l-4 border-blue-600 pl-4">案件数より<br />“当たる確率”を重視</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                大量掲載ではなく、「実際に決まる確率」「面談につながる確率」を重視。<br />
                                無駄打ちしない提案に集中します。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Jobs */}
            <section className="py-16 bg-gray-50 border-y border-gray-200">
                <div className="container-custom max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                            新着のフリーランス案件・求人
                        </h2>
                        <Link href="/jobs" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center hover:underline">
                            すべての案件を見る <ChevronRight size={16} />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {latestJobs?.map((job: any) => {
                            // Transform data for JobCard
                            const formattedJob = {
                                ...job,
                                skills: job.job_skills?.map((js: any) => js.skills) || [],
                                status: (new Date().getTime() - new Date(job.created_at).getTime()) < 7 * 24 * 60 * 60 * 1000 ? 'new' : 'published'
                            }

                            return (
                                <JobCard key={job.id} job={formattedJob} />
                            )
                        })}

                        {!latestJobs?.length && (
                            <p className="text-center text-gray-500 py-10">現在、新着案件の読み込み中です。</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Extensive Search Links */}
            <section className="py-20 bg-white">
                <div className="container-custom max-w-6xl mx-auto">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-10 text-center">
                        すべてのカテゴリーから探す
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {/* Column 1: Languages */}
                        <div>
                            <h3 className="font-bold text-gray-900 border-b-2 border-gray-200 pb-2 mb-4">
                                開発言語から探す
                            </h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/jobs?q=Java" className="text-blue-600 hover:underline">Java</Link></li>
                                <li><Link href="/jobs?q=PHP" className="text-blue-600 hover:underline">PHP</Link></li>
                                <li><Link href="/jobs?q=Python" className="text-blue-600 hover:underline">Python</Link></li>
                                <li><Link href="/jobs?q=Ruby" className="text-blue-600 hover:underline">Ruby</Link></li>
                                <li><Link href="/jobs?q=Go" className="text-blue-600 hover:underline">Go (Golang)</Link></li>
                                <li><Link href="/jobs?q=JavaScript" className="text-blue-600 hover:underline">JavaScript</Link></li>
                                <li><Link href="/jobs?q=TypeScript" className="text-blue-600 hover:underline">TypeScript</Link></li>
                                <li><Link href="/jobs?q=C%23" className="text-blue-600 hover:underline">C# / .NET</Link></li>
                                <li><Link href="/jobs?q=Swift" className="text-blue-600 hover:underline">Swift</Link></li>
                                <li><Link href="/jobs?q=Kotlin" className="text-blue-600 hover:underline">Kotlin</Link></li>
                            </ul>
                        </div>

                        {/* Column 2: Frameworks/Skills */}
                        <div>
                            <h3 className="font-bold text-gray-900 border-b-2 border-gray-200 pb-2 mb-4">
                                フレームワーク・環境から探す
                            </h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/jobs?q=AWS" className="text-blue-600 hover:underline">AWS</Link></li>
                                <li><Link href="/jobs?q=Azure" className="text-blue-600 hover:underline">Azure</Link></li>
                                <li><Link href="/jobs?q=GCP" className="text-blue-600 hover:underline">GCP</Link></li>
                                <li><Link href="/jobs?q=React" className="text-blue-600 hover:underline">React</Link></li>
                                <li><Link href="/jobs?q=Vue" className="text-blue-600 hover:underline">Vue.js</Link></li>
                                <li><Link href="/jobs?q=Next.js" className="text-blue-600 hover:underline">Next.js</Link></li>
                                <li><Link href="/jobs?q=Laravel" className="text-blue-600 hover:underline">Laravel</Link></li>
                                <li><Link href="/jobs?q=Rails" className="text-blue-600 hover:underline">Ruby on Rails</Link></li>
                                <li><Link href="/jobs?q=Spring" className="text-blue-600 hover:underline">Spring Boot</Link></li>
                                <li><Link href="/jobs?q=Docker" className="text-blue-600 hover:underline">Docker / Kubernetes</Link></li>
                            </ul>
                        </div>

                        {/* Column 3: Roles */}
                        <div>
                            <h3 className="font-bold text-gray-900 border-b-2 border-gray-200 pb-2 mb-4">
                                職種から探す
                            </h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/jobs?q=Backend" className="text-blue-600 hover:underline">サーバーサイドエンジニア</Link></li>
                                <li><Link href="/jobs?q=Frontend" className="text-blue-600 hover:underline">フロントエンドエンジニア</Link></li>
                                <li><Link href="/jobs?q=Infra" className="text-blue-600 hover:underline">インフラエンジニア</Link></li>
                                <li><Link href="/jobs?q=Mobile" className="text-blue-600 hover:underline">iOS/Androidアプリエンジニア</Link></li>
                                <li><Link href="/jobs?q=PM" className="text-blue-600 hover:underline">PM / PMO</Link></li>
                                <li><Link href="/jobs?q=Consultant" className="text-blue-600 hover:underline">ITコンサルタント</Link></li>
                                <li><Link href="/jobs?q=QA" className="text-blue-600 hover:underline">QA / テスター</Link></li>
                                <li><Link href="/jobs?q=Data" className="text-blue-600 hover:underline">データサイエンティスト</Link></li>
                                <li><Link href="/jobs?q=SE" className="text-blue-600 hover:underline">社内SE</Link></li>
                            </ul>
                        </div>

                        {/* Column 4: Conditions */}
                        <div>
                            <h3 className="font-bold text-gray-900 border-b-2 border-gray-200 pb-2 mb-4">
                                こだわり条件から探す
                            </h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/jobs?q=Remote" className="text-blue-600 hover:underline">フルリモート</Link></li>
                                <li><Link href="/jobs?q=Hybrid" className="text-blue-600 hover:underline">リモート可（週1〜2出社）</Link></li>
                                <li><Link href="/jobs?q=Week3" className="text-blue-600 hover:underline">週3日〜稼働OK</Link></li>
                                <li><Link href="/jobs?q=HighPrice" className="text-blue-600 hover:underline">高単価（80万円以上）</Link></li>
                                <li><Link href="/jobs?q=LongTerm" className="text-blue-600 hover:underline">長期案件</Link></li>
                                <li><Link href="/jobs?q=Leader" className="text-blue-600 hover:underline">リーダー・マネジメント経験歓迎</Link></li>
                                <li><Link href="/jobs?q=Modern" className="text-blue-600 hover:underline">モダンな技術環境</Link></li>
                                <li><Link href="/jobs?q=Casual" className="text-blue-600 hover:underline">服装自由</Link></li>
                                <li><Link href="/jobs?q=Senior" className="text-blue-600 hover:underline">40代・50代活躍中</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Articles Section */}
            <section className="py-20 bg-white border-t border-gray-200">
                <div className="container-custom max-w-6xl mx-auto space-y-20">

                    {/* New Arrivals */}
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-8">
                            新着のフリーランス向けお役立ちコラム
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {newArticles?.map((article: any) => (
                                <CompactArticleCard key={article.slug} article={article} />
                            ))}
                        </div>
                        <div className="text-right mt-4">
                            <Link href="/articles" className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center hover:underline">
                                お役立ちコラムをすべてみる <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* Popular Articles */}
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-8">
                            人気のフリーランス向けお役立ちコラム
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {popularArticles?.map((article: any) => (
                                <CompactArticleCard key={article.slug} article={article} />
                            ))}
                        </div>
                        <div className="text-right mt-4">
                            <Link href="/articles" className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center hover:underline">
                                お役立ちコラムをすべてみる <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>

                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-20 bg-gray-50 text-center border-t border-gray-200">
                <div className="container-custom max-w-2xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                        会員登録して非公開案件をチェック
                    </h2>
                    <p className="text-gray-600 mb-8">
                        公開されている案件はごく一部です。<br />
                        会員登録すると、高単価・フルリモートなどの好条件な非公開案件をご紹介できます。
                    </p>
                    <Link href="/register" className="btn bg-blue-600 text-white font-bold py-4 px-12 rounded-lg shadow-xl hover:bg-blue-700 hover:shadow-2xl transition-all inline-flex items-center gap-2">
                        無料で会員登録スタート <ArrowRight size={20} />
                    </Link>
                    <p className="mt-4 text-xs text-gray-500">※登録は30秒で完了します</p>
                </div>
            </section>
        </div>
    )
}

