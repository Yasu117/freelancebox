import Link from 'next/link'
import Image from 'next/image'
import type { ArticleSummary } from '@/types'

export function CompactArticleCard({ article }: { article: ArticleSummary }) {
    const publishedDate = article.published_at
        ? new Date(article.published_at).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '.')
        : ''

    return (
        <Link href={`/articles/${article.slug}`} className="group flex bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow h-28">
            <div className="relative w-48 h-full flex-shrink-0 bg-gray-100">
                {article.thumbnail_url ? (
                    <Image
                        src={article.thumbnail_url}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
            </div>
            <div className="flex-1 p-3 flex flex-col justify-between">
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 line-clamp-2 leading-snug">
                    {article.title}
                </h3>
                <p className="text-xs text-gray-500 text-right mt-1">
                    {publishedDate}
                </p>
            </div>
        </Link>
    )
}
