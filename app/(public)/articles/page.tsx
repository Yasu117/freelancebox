import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Article } from '@/types'
import { Calendar, Tag, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export const metadata = {
    title: 'お役立ちコラム | FreelanceBox',
    description: 'フリーランスエンジニアのキャリア、税金、スキルアップに役立つ情報を発信しています。',
}

async function getArticles() {
    const supabase = createClient()
    const { data: articles } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })

    return articles as Article[] || []
}

export default async function ArticlesIndexPage() {
    const articles = await getArticles()

    return (
        <div className="bg-gray-50 min-h-screen py-12 md:py-20">
            <div className="container-custom">
                <div className="max-w-4xl mx-auto mb-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">お役立ちコラム</h1>
                    <p className="text-gray-500">フリーランスエンジニアの成功をサポートする情報をお届けします。</p>
                </div>

                {articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article) => (
                            <Link
                                key={article.id}
                                href={`/articles/${article.slug}`}
                                className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all flex flex-col h-full"
                            >
                                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                    {article.thumbnail_url ? (
                                        <img
                                            src={article.thumbnail_url}
                                            alt={article.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary-50 text-primary-200">
                                            <span className="font-bold text-lg">FreelanceBox</span>
                                        </div>
                                    )}
                                    {article.category && (
                                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-primary-700 text-xs font-bold px-2 py-1 rounded shadow-sm">
                                            {article.category}
                                        </span>
                                    )}
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                                        <Calendar size={14} />
                                        {article.published_at && format(new Date(article.published_at), 'yyyy.MM.dd', { locale: ja })}
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                                        {article.title}
                                    </h2>
                                    <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">
                                        {article.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {article.tags?.slice(0, 3).map(tag => (
                                            <span key={tag} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                <Tag size={10} />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
                        <p className="text-gray-500">現在公開されている記事はありません。</p>
                    </div>
                )}
            </div>
        </div>
    )
}
