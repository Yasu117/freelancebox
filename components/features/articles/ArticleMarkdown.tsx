/* eslint-disable @next/next/no-img-element */
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export type ArticleHeading = {
    id: string
    level: 2 | 3
    text: string
}

export function getArticleHeadings(content: string | null): ArticleHeading[] {
    const headings = content?.match(/^#{2,3} .+$/gm) || []

    return headings.map((heading, index) => {
        const level = heading.startsWith('###') ? 3 : 2
        const text = heading.replace(/^#{2,3} /, '')

        return {
            id: `heading-${index}`,
            level,
            text,
        }
    })
}

export function ArticleTableOfContents({ headings }: { headings: ArticleHeading[] }) {
    if (headings.length === 0) return null

    return (
        <div className="bg-gray-50 rounded-xl p-6 mb-10 border border-gray-200">
            <p className="font-bold text-gray-900 mb-3 text-lg">目次</p>
            <ul className="space-y-2 text-sm">
                {headings.map((heading) => (
                    <li key={heading.id} className={`${heading.level === 3 ? 'ml-4 list-disc marker:text-gray-300' : ''}`}>
                        <a href={`#${heading.id}`} className="text-gray-600 hover:text-primary-600 hover:underline transition-colors block py-0.5">
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export function ArticleMarkdown({ content, headings }: { content: string | null, headings: ArticleHeading[] }) {
    let headingIndex = 0

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                h2: ({ node, ...props }) => {
                    void node
                    const heading = headings[headingIndex++]
                    return <h2 id={heading?.id} className="text-2xl font-bold mt-12 mb-6 pb-3 border-b-2 border-primary-100 text-gray-900 scroll-mt-24" {...props} />
                },
                h3: ({ node, ...props }) => {
                    void node
                    const heading = headings[headingIndex++]
                    return <h3 id={heading?.id} className="text-xl font-bold mt-8 mb-4 text-gray-800 border-l-4 border-primary-500 pl-3 scroll-mt-24" {...props} />
                },
                p: ({ node, ...props }) => {
                    void node
                    return <p className="mb-6 leading-relaxed text-gray-700" {...props} />
                },
                ul: ({ node, ...props }) => {
                    void node
                    return <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700" {...props} />
                },
                ol: ({ node, ...props }) => {
                    void node
                    return <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-700" {...props} />
                },
                li: ({ node, ...props }) => {
                    void node
                    return <li className="pl-1" {...props} />
                },
                blockquote: ({ node, ...props }) => {
                    void node
                    return <blockquote className="border-l-4 border-gray-300 bg-gray-50 py-3 px-5 my-6 rounded text-gray-600 italic" {...props} />
                },
                a: ({ node, ...props }) => {
                    void node
                    return <a className="text-primary-600 underline hover:text-primary-800 transition-colors" {...props} />
                },
                code: ({ node, ...props }) => {
                    void node
                    return <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-200" {...props} />
                },
                img: ({ node, alt = '', ...props }) => {
                    void node
                    return (
                        <figure className="my-8">
                            <img className="rounded-lg shadow-md w-full border border-gray-100" alt={alt} {...props} />
                            {alt && <figcaption className="text-center text-xs text-gray-500 mt-2">{alt}</figcaption>}
                        </figure>
                    )
                },
                table: ({ node, ...props }) => {
                    void node
                    return <div className="overflow-x-auto my-8"><table className="min-w-full text-sm border-collapse border border-gray-200" {...props} /></div>
                },
                thead: ({ node, ...props }) => {
                    void node
                    return <thead className="bg-gray-50" {...props} />
                },
                th: ({ node, ...props }) => {
                    void node
                    return <th className="border border-gray-200 px-4 py-3 text-left font-bold text-gray-900 whitespace-nowrap" {...props} />
                },
                td: ({ node, ...props }) => {
                    void node
                    return <td className="border border-gray-200 px-4 py-3 text-gray-700" {...props} />
                },
            }}
        >
            {content || ''}
        </ReactMarkdown>
    )
}
