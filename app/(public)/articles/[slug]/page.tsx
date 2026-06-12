import { createClient } from '@/lib/supabase/server'
import { Article } from '@/types'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Tag, Clock, ChevronLeft } from 'lucide-react'
import type { Metadata } from 'next'
import { ArticleMarkdown, ArticleTableOfContents, getArticleHeadings } from '@/components/features/articles/ArticleMarkdown'

// Generate Metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const supabase = await createClient()
    const { data } = await supabase.from('articles').select('*').eq('slug', slug).eq('status', 'published').single()
    const article = data as Article | null

    if (!article) return { title: 'Not Found' }

    return {
        title: `${article.title} | FreelanceBox`,
        description: article.description,
        openGraph: {
            title: article.title,
            description: article.description || '',
            type: 'article',
            publishedTime: article.published_at || undefined,
            modifiedTime: article.updated_at || undefined,
            // images: [article.thumbnail_url || '/og-default.png'], // Uncomment if you have default OG
        }
    }
}

async function getArticle(slug: string) {
    const supabase = await createClient()
    const { data: article } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

    return article as Article | null
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const article = await getArticle(slug)

    if (!article) {
        notFound()
    }

    const headings = getArticleHeadings(article.content)

    // JSON-LD for AIEO (Article + FAQPage)
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Article",
                "headline": article.title,
                "description": article.description,
                "image": article.thumbnail_url ? [article.thumbnail_url] : [],
                "datePublished": article.published_at,
                "dateModified": article.updated_at,
                "author": {
                    "@type": "Organization",
                    "name": "FreelanceBox"
                }
            },
            ...(article.faq && article.faq.length > 0 ? [{
                "@type": "FAQPage",
                "mainEntity": article.faq.map(item => ({
                    "@type": "Question",
                    "name": item.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": item.answer
                    }
                }))
            }] : [])
        ]
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* JSON-LD Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Header / Hero */}
            <div className="bg-white border-b border-gray-200 pt-24 pb-12 px-4">
                <div className="max-w-3xl mx-auto">
                    <Link href="/articles" className="inline-flex items-center text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors">
                        <ChevronLeft size={16} className="mr-1" />
                        コラム一覧に戻る
                    </Link>

                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        {article.category && (
                            <span className="bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1 rounded-full">
                                {article.category}
                            </span>
                        )}
                        <div className="flex items-center text-xs text-gray-500">
                            <Clock size={14} className="mr-1" />
                            {article.published_at && format(new Date(article.published_at), 'yyyy.MM.dd', { locale: ja })} 公開
                        </div>
                        {article.updated_at && article.updated_at !== article.published_at && (
                            <div className="flex items-center text-xs text-gray-500">
                                <span className="mx-2">|</span>
                                更新: {format(new Date(article.updated_at), 'yyyy.MM.dd', { locale: ja })}
                            </div>
                        )}
                    </div>

                    <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
                        {article.title}
                    </h1>

                    {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {article.tags.map(tag => (
                                <span key={tag} className="inline-flex items-center gap-1 text-sm bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                                    <Tag size={12} />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">

                    <ArticleTableOfContents headings={headings} />

                    <article className="prose prose-gray max-w-none">
                        <ArticleMarkdown content={article.content} headings={headings} />

                        {/* Accordion FAQ Display */}
                        {article.faq && article.faq.length > 0 && (
                            <div className="mt-20 pt-10 border-t border-gray-200">
                                <h2 className="text-2xl font-bold mb-8 text-center">よくある質問</h2>
                                <div className="space-y-4">
                                    {article.faq.map((item, index) => (
                                        <details key={index} className="group bg-white border border-gray-200 rounded-lg open:shadow-md transition-all duration-200 open:border-primary-200">
                                            <summary className="flex items-center justify-between p-5 cursor-pointer list-none font-bold text-gray-900 group-hover:text-primary-700">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center justify-center w-6 h-6 bg-primary-100 text-primary-700 text-xs rounded-full font-bold">Q</span>
                                                    {item.question}
                                                </div>
                                                <span className="transition-transform group-open:rotate-180 text-gray-400">
                                                    <ChevronLeft size={20} className="-rotate-90" />
                                                </span>
                                            </summary>
                                            <div className="px-5 pb-5 pt-0 text-gray-700 leading-relaxed border-t border-transparent group-open:border-gray-100 group-open:pt-4">
                                                {item.answer}
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        )}
                    </article>
                </div>

                {/* Internal Links / CTA */}
                <div className="mt-12 bg-primary-900 rounded-2xl p-8 text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-xl md:text-2xl font-bold mb-4">フリーランス案件をお探しですか？</h3>
                        <p className="text-primary-100 mb-8 max-w-xl mx-auto">
                            FreelanceBoxなら、あなたのスキルや希望単価にマッチした高単価案件が見つかります。
                            まずは無料登録して、非公開案件をチェックしましょう。
                        </p>
                        <Link href="/register" className="inline-block bg-white text-primary-900 font-bold py-3 px-8 rounded-full hover:bg-primary-50 transition-colors">
                            無料登録はこちら
                        </Link>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-700 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -ml-12 -mb-12"></div>
                </div>
            </div>
        </div>
    )
}
