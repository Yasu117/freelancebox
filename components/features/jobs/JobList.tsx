'use client'

import { useEffect, useRef, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { JobCard } from './JobCard'
import { ITEMS_PER_PAGE, mapJobListItems, type JobListRow, type ParsedJobSearchParams } from '@/lib/job-utils'
import { publicJobQuery } from '@/lib/public-job-query'
import { createClient } from '@/lib/supabase/client'
import type { JobListItem } from '@/types'

export function JobList({ initialJobs, initialHasMore, filters }: {
    initialJobs: JobListItem[]
    initialHasMore: boolean
    filters: ParsedJobSearchParams
}) {
    const [jobs, setJobs] = useState(initialJobs)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(initialHasMore)
    const [loading, setLoading] = useState(false)
    const [pageError, setPageError] = useState(false)
    const [count, setCount] = useState<number | 'error' | null>(null)
    const [countAttempt, setCountAttempt] = useState(0)
    const pendingPage = useRef<AbortController | null>(null)

    useEffect(() => {
        if (initialJobs.length === 0) return
        const controller = new AbortController()
        async function fetchCount() {
            try {
                const { count, error } = await publicJobQuery(createClient(), filters, true)
                    .abortSignal(controller.signal)
                if (!controller.signal.aborted) setCount(error || count === null ? 'error' : count)
            } catch {
                if (!controller.signal.aborted) setCount('error')
            }
        }
        void fetchCount()
        return () => controller.abort()
    }, [countAttempt, filters, initialJobs.length])

    useEffect(() => () => pendingPage.current?.abort(), [])

    async function loadMore() {
        if (pendingPage.current || !hasMore) return
        const controller = new AbortController()
        pendingPage.current = controller
        setLoading(true)
        setPageError(false)
        try {
            const from = page * ITEMS_PER_PAGE
            const { data, error } = await publicJobQuery(createClient(), filters)
                .order('created_at', { ascending: false })
                .range(from, from + ITEMS_PER_PAGE)
                .abortSignal(controller.signal)
            if (controller.signal.aborted) return
            if (error || !data) {
                setPageError(true)
                return
            }

            const next = mapJobListItems(data.slice(0, ITEMS_PER_PAGE) as JobListRow[])
            setJobs(previous => {
                const ids = new Set(previous.map(job => job.id))
                return [...previous, ...next.filter(job => !ids.has(job.id))]
            })
            setHasMore(data.length > ITEMS_PER_PAGE)
            setPage(page + 1)
        } catch {
            if (!controller.signal.aborted) setPageError(true)
        } finally {
            pendingPage.current = null
            if (!controller.signal.aborted) setLoading(false)
        }
    }

    if (!jobs.length) return <p role="status">該当する案件はありません。</p>

    const countConflicts = typeof count === 'number' && (hasMore ? count <= jobs.length : count !== jobs.length)

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <div role="status" className="text-gray-600">
                        <span>{jobs.length.toLocaleString('ja-JP')}件を表示中</span>
                        {count === null && <span className="ml-2">総件数を確認中</span>}
                        {count === 'error' && <span className="ml-2">総件数を取得できませんでした</span>}
                        {countConflicts && <span className="ml-2">一覧取得後に件数が変わりました</span>}
                        {typeof count === 'number' && !countConflicts &&
                            <span className="ml-2">総件数 {count.toLocaleString('ja-JP')}件（集計時点）</span>}
                    </div>
                    {count === 'error' && (
                        <button type="button" className="btn-primary-outline px-3 py-1" onClick={() => {
                            setCount(null)
                            setCountAttempt(attempt => attempt + 1)
                        }}>総件数を再取得</button>
                    )}
                    {countConflicts && (
                        <button type="button" className="btn-primary-outline px-3 py-1" onClick={() => window.location.reload()}>
                            一覧を更新
                        </button>
                    )}
                    <div className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-full border border-emerald-100 flex items-center gap-1.5">
                        <CheckCircle2 size={14} />
                        <span className="font-bold">おとり案件なし</span>
                        <span className="text-emerald-600 border-l border-emerald-200 pl-1.5">終了・停止案件は即非表示</span>
                    </div>
                </div>

                <select aria-label="並び順" className="border border-gray-300 rounded-lg text-sm p-2 focus:ring-primary-500 bg-white">
                    <option>新着順</option>
                    <option>単価が高い順</option>
                </select>
            </div>

            <div className="space-y-4">
                {jobs.map(job => <JobCard key={job.id} job={job} />)}
            </div>

            {pageError && <p role="alert" className="mt-4 text-center">追加の案件を取得できませんでした。</p>}
            {hasMore && (
                <div className="mt-12 flex justify-center">
                    <button type="button" onClick={loadMore} disabled={loading} className="btn-primary-outline px-8 py-3 rounded-full text-sm font-bold min-w-[200px]">
                        {loading ? '読み込み中' : pageError ? '追加読込を再試行' : 'もっと見る'}
                    </button>
                </div>
            )}
        </div>
    )
}
