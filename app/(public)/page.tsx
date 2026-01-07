import Link from 'next/link'
import { Search, MapPin, DollarSign, ChevronRight, ArrowRight } from 'lucide-react'

export default function LandingPage() {
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
                        <span className="font-bold text-xl mr-3">案件数 15,400件</span>
                        <span className="text-sm text-gray-500">2026年1月5日(月)更新</span>
                    </p>

                    {/* Search Bar */}
                    <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 max-w-3xl mx-auto flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-grow">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="キーワード、スキル、職種などで検索"
                                className="w-full pl-12 pr-4 py-3 rounded-md outline-none text-gray-700 placeholder:text-gray-400"
                            />
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md transition-colors whitespace-nowrap">
                            検索する
                        </button>
                    </div>

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
                            <h3 className="text-xl font-bold text-gray-900 border-l-4 border-blue-600 pl-4">条件整理から案件提案まで、<br />エージェントが伴走</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                希望条件を整理し、案件提案までエージェントが伴走します。
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="text-blue-600 font-bold text-lg mb-2 flex items-center gap-2">
                                <span className="bg-blue-100 p-2 rounded-lg">02</span>
                                <span>POINT</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 border-l-4 border-blue-600 pl-4">複数の案件を<br />スピード感を持って提案</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                案件は1件に絞らず、比較できる形で複数提案します。
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="text-blue-600 font-bold text-lg mb-2 flex items-center gap-2">
                                <span className="bg-blue-100 p-2 rounded-lg">03</span>
                                <span>POINT</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 border-l-4 border-blue-600 pl-4">提案後も<br />判断・調整までサポート</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                提案して終わりではなく、選定や条件調整までサポートします。
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
                        <JobRow
                            title="【Go/AWS】動画配信プラットフォームのバックエンド開発"
                            tags={['Go', 'AWS', 'Microservices']}
                            price="80万円〜 /月"
                            location="フルリモート"
                            date="新着"
                        />
                        <JobRow
                            title="【React/TypeScript】SaaSプロダクトのフロントエンド開発リード"
                            tags={['React', 'TypeScript', 'Next.js']}
                            price="100万円〜 /月"
                            location="リモート（週1出社）"
                            date="新着"
                        />
                        <JobRow
                            title="【PMO】金融機関向けDX推進プロジェクト"
                            tags={['PMO', 'Consulting', 'Infra']}
                            price="120万円〜 /月"
                            location="東京都（ハイブリッド）"
                        />
                        <JobRow
                            title="【Python】生成AI（LLM）を活用した社内システム開発"
                            tags={['Python', 'LangChain', 'Azure']}
                            price="90万円〜 /月"
                            location="フルリモート"
                        />
                        <JobRow
                            title="【PHP/Laravel】急成長ECサイトの機能追加・改修"
                            tags={['PHP', 'Laravel', 'MySQL']}
                            price="70万円〜 /月"
                            location="フルリモート"
                        />
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
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">Java</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">PHP</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">Python</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">Ruby</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">Go (Golang)</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">JavaScript</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">TypeScript</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">C# / .NET</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">Swift</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">Kotlin</Link></li>
                            </ul>
                        </div>

                        {/* Column 2: Frameworks/Skills */}
                        <div>
                            <h3 className="font-bold text-gray-900 border-b-2 border-gray-200 pb-2 mb-4">
                                フレームワーク・環境から探す
                            </h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">AWS</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">Azure</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">GCP</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">React</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">Vue.js</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">Next.js</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">Laravel</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">Ruby on Rails</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">Spring Boot</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">Docker / Kubernetes</Link></li>
                            </ul>
                        </div>

                        {/* Column 3: Roles */}
                        <div>
                            <h3 className="font-bold text-gray-900 border-b-2 border-gray-200 pb-2 mb-4">
                                職種から探す
                            </h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">サーバーサイドエンジニア</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">フロントエンドエンジニア</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">インフラエンジニア</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">iOS/Androidアプリエンジニア</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">PM / PMO</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">ITコンサルタント</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">QA / テスター</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">データサイエンティスト</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">社内SE</Link></li>
                            </ul>
                        </div>

                        {/* Column 4: Conditions */}
                        <div>
                            <h3 className="font-bold text-gray-900 border-b-2 border-gray-200 pb-2 mb-4">
                                こだわり条件から探す
                            </h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">フルリモート</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">リモート可（週1〜2出社）</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">週3日〜稼働OK</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">高単価（80万円以上）</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">長期案件</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">リーダー・マネジメント経験歓迎</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">モダンな技術環境</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">服装自由</Link></li>
                                <li><Link href="/jobs" className="text-blue-600 hover:underline">40代・50代活躍中</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Articles Column */}
            <section className="py-16 bg-white border-t border-gray-200">
                <div className="container-custom max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-gray-900">お役立ちコラム</h2>
                        <Link href="/articles" className="text-blue-600 hover:underline text-sm font-medium">もっと見る</Link>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Article 1 */}
                        <Link href="/articles" className="group block">
                            <div className="bg-gray-100 aspect-video rounded-md mb-3"></div>
                            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                                フリーランスエンジニアの年収相場【2024年最新版】言語別・職種別に解説
                            </h3>
                            <p className="text-xs text-gray-500">2024.01.10</p>
                        </Link>
                        {/* Article 2 */}
                        <Link href="/articles" className="group block">
                            <div className="bg-gray-100 aspect-video rounded-md mb-3"></div>
                            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                                インボイス制度がフリーランスに与える影響とは？登録すべきか徹底解説
                            </h3>
                            <p className="text-xs text-gray-500">2024.01.05</p>
                        </Link>
                        {/* Article 3 */}
                        <Link href="/articles" className="group block">
                            <div className="bg-gray-100 aspect-video rounded-md mb-3"></div>
                            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                                週3日稼働で働くには？準委任契約のメリットと案件の探し方
                            </h3>
                            <p className="text-xs text-gray-500">2023.12.28</p>
                        </Link>
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

function JobRow({ title, tags, price, location, date }: { title: string, tags: string[], price: string, location: string, date?: string }) {
    return (
        <Link href="/jobs" className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-blue-300 transition-all group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                        {date && <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100">{date}</span>}
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                            {title}
                        </h3>
                    </div>
                    <div className="flex gap-2 flex-wrap mb-2">
                        {tags.map(tag => (
                            <span key={tag} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col md:items-end min-w-[180px] text-sm md:border-l md:border-gray-100 md:pl-6">
                    <div className="font-bold text-blue-600 text-lg mb-1 flex items-center gap-1">
                        <DollarSign size={16} className="md:hidden" /> {price}
                    </div>
                    <div className="text-gray-500 flex items-center gap-1">
                        <MapPin size={14} className="md:hidden" /> {location}
                    </div>
                </div>
            </div>
        </Link>
    )
}
