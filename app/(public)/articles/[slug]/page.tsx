import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { notFound } from 'next/navigation'

// Mock Data
async function getArticle(slug: string) {
    if (slug === 'freelance-10m-strategy' || true) { // Always return for demo
        return {
            slug,
            title: 'フリーランスエンジニアが年収1000万円を超えるための戦略',
            content_md: `
フリーランスエンジニアとして独立し、年収1000万円を超えることは決して不可能な目標ではありません。しかし、漫然と案件をこなしているだけでは到達できないのも事実です。

## 1. スキルセットの希少性を高める

単にコードが書けるだけではなく、以下のような付加価値が必要です。

- **上流工程の経験**: 要件定義や設計から参画できる能力
- **マネジメント経験**: チームリーダーやテックリードとしての経験
- **特定のドメイン知識**: 金融、医療、AIなど、専門性の高い知識

## 2. 商流を意識する

案件の単価は、商流（エンドクライアントからの距離）によって大きく変わります。
3次請け、4次請けとなると、どうしても単価は下がります。
可能な限り直請けや、プライムベンダーの直下の案件を探すことが重要です。

## 3. エージェントを賢く使う

自分で営業活動を行うのは工数がかかります。
手数料が適正で、上流案件を持っているエージェントを選ぶことが、効率的な高単価案件獲得への近道です。
            `,
            published_at: '2023-10-01',
            tags: ['キャリア', '単価']
        }
    }
    return null
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const article = await getArticle(slug)

    if (!article) return notFound()

    return (
        <div className="bg-white min-h-screen">
            <article className="max-w-3xl mx-auto px-4 py-12 md:py-20">
                <div className="mb-4 flex gap-2">
                    {article.tags.map(tag => (
                        <span key={tag} className="text-sm font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                            #{tag}
                        </span>
                    ))}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">{article.title}</h1>
                <div className="text-gray-500 mb-12 flex items-center gap-2">
                    <Calendar size={16} /> {article.published_at}
                </div>

                <div className="prose prose-lg max-w-none prose-img:rounded-xl prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary-600">
                    <ReactMarkdown>{article.content_md}</ReactMarkdown>
                </div>

                {/* CTA in Article */}
                <div className="my-16 p-8 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                    <h3 className="text-xl font-bold mb-4">あなたの市場価値を確認しませんか？</h3>
                    <p className="text-gray-600 mb-6">
                        非公開案件を含む多数の高単価案件から、あなたにぴったりの案件をご紹介します。
                    </p>
                    <Link href="/register" className="btn-primary inline-flex items-center gap-2 px-8 py-3 shadow-lg">
                        無料相談はこちら <ArrowRight size={18} />
                    </Link>
                </div>
            </article>

            {/* Related Jobs Section */}
            <section className="bg-gray-50 py-16 border-t border-gray-100">
                <div className="container-custom">
                    <h2 className="text-2xl font-bold mb-8">この記事に関連する案件</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-xs font-bold bg-gray-100 inline-block px-2 py-1 rounded mb-2">Go</div>
                            <h3 className="font-bold mb-2 line-clamp-2">【Go】高単価バックエンド開発</h3>
                            <div className="text-primary-600 font-bold mb-4">80-100万円</div>
                            <Link href="/jobs/1" className="text-sm text-gray-500 hover:text-primary-600 font-medium flex items-center gap-1">
                                詳細を見る <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-xs font-bold bg-gray-100 inline-block px-2 py-1 rounded mb-2">PM</div>
                            <h3 className="font-bold mb-2 line-clamp-2">【PM】DX推進プロジェクト</h3>
                            <div className="text-primary-600 font-bold mb-4">90-120万円</div>
                            <Link href="/jobs/2" className="text-sm text-gray-500 hover:text-primary-600 font-medium flex items-center gap-1">
                                詳細を見る <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-xs font-bold bg-gray-100 inline-block px-2 py-1 rounded mb-2">React</div>
                            <h3 className="font-bold mb-2 line-clamp-2">【React】SaaSフロントエンド</h3>
                            <div className="text-primary-600 font-bold mb-4">70-90万円</div>
                            <Link href="/jobs/3" className="text-sm text-gray-500 hover:text-primary-600 font-medium flex items-center gap-1">
                                詳細を見る <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
