'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Search, Code, Server, Smartphone, PenTool, Database, Briefcase, Monitor, Cloud, Layers } from 'lucide-react'
import { ROLE_CATEGORIES, SKILL_CATEGORIES, CONDITIONS } from '@/lib/constants'

// データ定義 (マッピング定義に基づく)
const CATEGORIES = [
    {
        id: 'language',
        label: '開発言語',
        icon: Code,
        items: SKILL_CATEGORIES.find(c => c.name === '開発言語')?.items.map(skill => ({
            label: skill,
            query: skill
        })) || []
    },
    {
        id: 'framework',
        label: 'フレームワーク',
        icon: Layers,
        items: SKILL_CATEGORIES.find(c => c.name === 'フレームワーク')?.items.map(skill => ({
            label: skill,
            query: skill
        })) || []
    },
    {
        id: 'infra',
        label: 'インフラ・クラウド',
        icon: Cloud,
        items: [
            ...(SKILL_CATEGORIES.find(c => c.name === 'インフラ・ミドルウェア')?.items.map(skill => ({
                label: skill,
                query: skill
            })) || []),
            ...(SKILL_CATEGORIES.find(c => c.name === 'その他ツール')?.items.map(skill => ({
                label: skill,
                query: skill
            })) || [])
        ]
    },
    {
        id: 'role_engineer',
        label: 'エンジニア職種',
        icon: Server,
        items: ROLE_CATEGORIES.find(c => c.name === 'エンジニア')?.items.map(item => ({
            label: item.label,
            query: item.slug,
            type: 'role'
        })) || []
    },
    {
        id: 'role_creative',
        label: 'クリエイティブ職種',
        icon: PenTool,
        items: [
            ...(ROLE_CATEGORIES.find(c => c.name === 'デザイナー')?.items || []),
            ...(ROLE_CATEGORIES.find(c => c.name === 'クリエイター')?.items || []),
            ...(ROLE_CATEGORIES.find(c => c.name === 'PM・ディレクター')?.items || []),
            ...(ROLE_CATEGORIES.find(c => c.name === 'マーケター')?.items || []),
            ...(ROLE_CATEGORIES.find(c => c.name === 'コンサルタント')?.items || [])
        ].map(item => ({
            label: item.label,
            query: item.slug,
            type: 'role'
        }))
    },
    {
        id: 'condition',
        label: 'こだわり条件',
        icon: Briefcase,
        items: CONDITIONS
    }
]

export function CategorySearch() {
    const [activeTab, setActiveTab] = useState(CATEGORIES[0].id)

    return (
        <section className="bg-white py-10 border-b border-gray-100">
            <div className="container-custom max-w-6xl mx-auto">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">
                    すべてのカテゴリーから探す
                </h2>

                {/* Desktop Tabs / Mobile Scroll */}
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 border-b border-gray-100 pb-4 md:pb-0 px-4 md:px-0 overflow-x-auto whitespace-nowrap md:whitespace-normal no-scrollbar">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-t-lg transition-all text-sm font-bold border-b-2 flex-shrink-0 ${activeTab === cat.id
                                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <cat.icon size={18} />
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="bg-gray-50 rounded-2xl p-6 md:p-8 min-h-[200px]">
                    {CATEGORIES.map((cat) => (
                        <div
                            key={cat.id}
                            className={`${activeTab === cat.id ? 'block' : 'hidden'} animate-in fade-in zoom-in-95 duration-200`}
                        >
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                                {cat.items.map((item: any) => {
                                    // URL生成ロジック
                                    let href = `/jobs?q=${item.query}`
                                    if (item.type === 'role') href = `/jobs?roles=${item.query}`
                                    if (item.type === 'work_style') href = `/jobs?work_styles=${item.query}`
                                    if (item.type === 'min_price') href = `/jobs?min_price=${item.query}`

                                    return (
                                        <Link
                                            key={item.label}
                                            href={href}
                                            className="bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-200 text-gray-700 hover:text-blue-700 rounded px-2.5 py-2 text-xs font-medium transition-all shadow-sm hover:shadow-md flex items-center justify-between group truncate"
                                            title={item.label}
                                        >
                                            <span className="truncate">{item.label}</span>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
