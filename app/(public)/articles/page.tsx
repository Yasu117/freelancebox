import Link from 'next/link'
import { Calendar } from 'lucide-react'

const MOCK_ARTICLES = [
    {
        id: '1',
        title: 'フリーランスエンジニアが年収1000万円を超えるための戦略',
        slug: 'freelance-10m-strategy',
        excerpt: '高単価案件を獲得するために必要なスキルセットと交渉術について解説します。',
        published_at: '2023-10-01',
        tags: [{ name: 'キャリア', slug: 'career' }, { name: '単価', slug: 'price' }]
    },
    {
        id: '2',
        title: 'Go言語の需要と将来性：バックエンドエンジニア必見',
        slug: 'golang-future',
        excerpt: 'モダンなバックエンド開発で採用が進むGo言語。その理由と学習ロードマップ。',
        published_at: '2023-10-05',
        tags: [{ name: 'Go', slug: 'golang' }, { name: 'バックエンド', slug: 'backend' }]
    },
    {
        id: '3',
        title: 'フルリモート案件で評価されるエンジニアの特徴5選',
        slug: 'remote-work-skills',
        excerpt: 'リモートワーク環境下で信頼を獲得し、継続的に契約を更新するためのコミュニケーション術。',
        published_at: '2023-10-10',
        tags: [{ name: 'リモート', slug: 'remote' }, { name: 'スキル', slug: 'skill' }]
    }
]

export default function ArticlesPage() {
    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="bg-white border-b border-gray-200 py-12 mb-8">
                <div className="container-custom">
                    <h1 className="text-3xl font-bold mb-4 text-gray-900">お役立ちコラム</h1>
                    <p className="text-gray-500">エンジニアのキャリアアップに役立つ情報をお届けします。</p>
                </div>
            </div>

            <div className="container-custom">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {MOCK_ARTICLES.map(article => (
                        <Link key={article.id} href={`/articles/${article.slug}`} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col">
                            <div className="h-48 bg-gray-200 relative overflow-hidden group-hover:opacity-90 transition-opacity">
                                {/* Pseud-image with gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br from-primary-200 to-secondary-200 opacity-50`}></div>
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold text-2xl opacity-20">Image</div>
                            </div>
                            <div className="p-6 flex-grow flex flex-col">
                                <div className="flex gap-2 mb-3">
                                    {article.tags.map(tag => (
                                        <span key={tag.slug} className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded">
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                                <h2 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">{article.title}</h2>
                                <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-grow">{article.excerpt}</p>
                                <div className="text-xs text-gray-400 flex items-center gap-1 pt-4 border-t border-gray-100">
                                    <Calendar size={12} /> {article.published_at}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
