'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Filter, X, Check, HelpCircle } from 'lucide-react'

// Defined mappings
// Role Data Structure
const ROLE_CATEGORIES = [
    {
        name: 'エンジニア',
        items: [
            { label: 'フロントエンドエンジニア', slug: 'frontend-engineer' },
            { label: 'バックエンドエンジニア', slug: 'backend-engineer' },
            { label: 'サーバーサイドエンジニア', slug: 'server-side-engineer' },
            { label: 'アプリエンジニア', slug: 'mobile-app-engineer' },
            { label: 'インフラエンジニア', slug: 'infrastructure-engineer' },
            { label: 'ネットワークエンジニア', slug: 'network-engineer' },
            { label: 'データベースエンジニア', slug: 'database-engineer' },
            { label: 'セキュリティエンジニア', slug: 'security-engineer' },
            { label: '情報システム', slug: 'information-systems' },
            { label: '社内SE', slug: 'internal-se' },
            { label: '汎用機エンジニア', slug: 'mainframe-engineer' },
            { label: 'AIエンジニア', slug: 'ai-engineer' },
            { label: '機械学習エンジニア', slug: 'ml-engineer' },
            { label: 'ブロックチェーンエンジニア', slug: 'blockchain-engineer' },
            { label: 'テクニカルサポート', slug: 'technical-support' },
            { label: '組込・制御エンジニア', slug: 'embedded-engineer' },
            { label: 'システムエンジニア(SE)', slug: 'system-engineer' },
            { label: 'プログラマー(PG)', slug: 'programmer' },
            { label: 'SRE', slug: 'sre' },
            { label: 'クラウドエンジニア', slug: 'cloud-engineer' },
            { label: 'VPoE', slug: 'vpoe' },
            { label: 'エンジニアリングマネージャー', slug: 'engineering-manager' },
            { label: 'コーダー', slug: 'coder' },
            { label: 'CRE', slug: 'cre' },
            { label: 'データサイエンティスト', slug: 'data-scientist' },
            { label: 'DBA', slug: 'dba' },
            { label: 'QAエンジニア', slug: 'qa-engineer' },
            { label: 'デバッガー', slug: 'debugger' },
            { label: 'テスター', slug: 'tester' },
            { label: 'ブリッジSE', slug: 'bridge-se' },
            { label: 'フルスタックエンジニア', slug: 'fullstack-engineer' },
            { label: 'ヘルプデスク', slug: 'helpdesk' },
        ]
    },
    {
        name: 'デザイナー',
        items: [
            { label: 'Webデザイナー', slug: 'web-designer' },
            { label: 'イラストレーター', slug: 'illustrator' },
            { label: 'UI・UXデザイナー', slug: 'ui-ux-designer' },
            { label: 'グラフィックデザイナー', slug: 'graphic-designer' },
            { label: 'キャラクターデザイナー', slug: 'character-designer' },
            { label: '2Dデザイナー', slug: '2d-designer' },
            { label: '3Dデザイナー', slug: '3d-designer' },
            { label: 'アートディレクター', slug: 'art-director' },
            { label: 'エフェクトデザイナー', slug: 'effect-designer' },
            { label: 'アニメーター', slug: 'animator' },
        ]
    },
    {
        name: 'マーケター',
        items: [
            { label: 'Webマーケター', slug: 'web-marketer' },
            { label: 'デジタルマーケター', slug: 'digital-marketer' },
        ]
    },
    {
        name: 'クリエイター',
        items: [
            { label: 'プランナー', slug: 'planner' },
            { label: '動画・映像制作', slug: 'video-creator' },
            { label: '3Dモデラー', slug: '3d-modeler' },
            { label: 'ライター', slug: 'writer' },
            { label: 'シナリオライター', slug: 'scenario-writer' },
            { label: 'ゲームプランナー', slug: 'game-planner' },
        ]
    },
    {
        name: 'PM・ディレクター',
        items: [
            { label: 'プロジェクトマネージャー', slug: 'pm' },
            { label: 'PMO', slug: 'pmo' },
            { label: 'プロダクトマネージャー(PdM)', slug: 'pdm' },
            { label: 'Webディレクター', slug: 'web-director' },
            { label: 'プロデューサー', slug: 'producer' },
            { label: 'ゲームディレクター', slug: 'game-director' },
            { label: '動画ディレクター', slug: 'video-director' },
        ]
    },
    {
        name: 'コンサルタント',
        items: [
            { label: 'ITコンサルタント', slug: 'it-consultant' },
            { label: 'SAPコンサルタント', slug: 'sap-consultant' },
            { label: 'ITアーキテクト', slug: 'it-architect' },
            { label: '戦略系コンサルタント', slug: 'strategy-consultant' },
        ]
    }
]

// Skill Data Structure
const SKILL_CATEGORIES = [
    {
        name: '開発言語',
        items: [
            'Java', 'PHP', 'Python', 'Ruby', 'Go言語', 'Scala', 'Perl', 'JavaScript', 'HTML5', 'Swift', 'Objective-C', 'Kotlin', 'Unity', 'Cocos2d-x', 'C言語', 'C#', 'C++', 'VC++', 'C#.NET', 'VB.NET', 'VB', 'VBA', 'SQL', 'PL/SQL', 'R言語', 'COBOL', 'JSON', 'Shell', 'Apex', 'VBScript', 'LISP', 'Haskell', 'Lua', 'XAML', 'Transact-SQL', 'ActionScript', 'CoffeeScript', 'ASP.NET', 'RPG', 'JSP', 'CSS3', 'JCL', 'UML', 'ABAP', 'Sass', 'LESS', 'TypeScript', 'Rust', 'Dart'
        ]
    },
    {
        name: 'フレームワーク',
        items: [
            'Node.js', 'CakePHP', 'Ruby on Rails', 'Spring', 'Django', 'FuelPHP', 'Struts', 'Catalyst', 'Spark', 'JSF', 'JUnit', 'CodeIgniter', 'MyBatis', 'Sinatra', 'iBATIS', 'Symfony', 'Zend Framework', 'Flask', 'Wicket', 'jQuery', 'Seasar2', 'Backbone.js', 'Knockout.js', 'AngularJS', 'Laravel', 'SAStruts', 'MVC', 'intra-mart', 'React', 'Vue.js', 'Bootstrap', 'Phalcon', 'ReactNative', 'SpringBoot', 'PlayFramework', 'Slim', 'Yii', 'Tornado', 'Flutter', 'NuxtJS', 'Tensorflow', 'Pytorch', 'Next.js', 'Angular'
        ]
    },
    {
        name: 'インフラ',
        items: [
            'AWS', 'Linux', 'WindowsServer', 'UNIX', 'Microsoft Azure', 'Android', 'Access', 'Oracle', 'Heroku', 'Google Cloud Platform(GCP)', 'ColdFusion', 'Firebase', 'Terraform', 'AWS CloudFormation', 'Kubernetes', 'Cisco', 'Exchange'
        ]
    },
    {
        name: 'その他',
        items: [
            'Photoshop', 'Illustrator', 'SAP', 'Sketch', 'Salesforce', 'JP1', 'WordPress', 'SharePoint', 'Hadoop', 'Zabbix', 'Tableau', 'Delphi', 'Figma', 'SAS', 'Adobe XD', 'CircleCI', 'Datadog', 'kintone', 'Maya', 'After Effects', 'Active Directory', 'ファイヤーウォール', 'Company', 'Adobe Premiere', 'Flash', 'Blender', '3ds Max'
        ]
    }
]

// Flattened maps for easy lookup if needed, but we mostly iterate categories now
const ROLE_MAP: { [key: string]: string } = {}
ROLE_CATEGORIES.forEach(cat => cat.items.forEach(item => ROLE_MAP[item.label] = item.slug))

const SKILL_MAP: { [key: string]: string } = {}
SKILL_CATEGORIES.forEach(cat => cat.items.forEach(item => SKILL_MAP[item] = item))

const WORK_STYLE_MAP: { [key: string]: string } = {
    'フルリモート': 'remote',
    'リモート可（週1〜）': 'hybrid',
    '常駐（Plus10）': 'onsite'
}


// Price options generation (10k increments or logic)
const PRICE_OPTIONS = [
    { label: '指定なし', value: '' },
    { label: '30万円', value: '300000' },
    { label: '40万円', value: '400000' },
    { label: '50万円', value: '500000' },
    { label: '60万円', value: '600000' },
    { label: '70万円', value: '700000' },
    { label: '80万円', value: '800000' },
    { label: '90万円', value: '900000' },
    { label: '100万円', value: '1000000' },
    { label: '120万円', value: '1200000' },
    { label: '150万円', value: '1500000' },
    { label: '200万円', value: '2000000' },
]

const POPULAR_TAGS = [
    { label: 'React', type: 'skill', value: 'React' },
    { label: 'Next.js', type: 'skill', value: 'Next.js' },
    { label: 'TypeScript', type: 'skill', value: 'TypeScript' },
    { label: 'Python', type: 'skill', value: 'Python' },
    { label: 'Go', type: 'skill', value: 'Go言語' },
    { label: 'AWS', type: 'skill', value: 'AWS' },
    { label: 'PM', type: 'role', value: 'pm' },
    { label: 'フルリモート', type: 'work_style', value: 'remote' },
]

type JobMeta = {
    id: string
    work_style: string
    role: { name: string, slug: string }
    price_min: number | null
    price_max: number | null
    skills: string[]
}

export function JobFilter({ jobsMeta }: { jobsMeta?: JobMeta[] }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Modal State
    const [isOpen, setIsOpen] = useState(false)
    const [showHelp, setShowHelp] = useState(false)

    // Filter State
    const [keyword, setKeyword] = useState('')
    const [selectedRoles, setSelectedRoles] = useState<string[]>([])
    const [selectedWorkStyles, setSelectedWorkStyles] = useState<string[]>([])
    const [selectedSkills, setSelectedSkills] = useState<string[]>([])
    const [minPrice, setMinPrice] = useState<string>('')
    const [maxPrice, setMaxPrice] = useState<string>('')

    // --- Dynamic Popular Tags Logic ---
    // Calculate skill frequency from jobsMeta
    const skillCounts: { [key: string]: number } = {}
    jobsMeta?.forEach(job => {
        job.skills.forEach(skill => {
            skillCounts[skill] = (skillCounts[skill] || 0) + 1
        })
    })

    // Get Top 10 skills
    const popularSkillTags = Object.entries(skillCounts)
        .sort((a, b) => b[1] - a[1]) // Sort by count desc
        .slice(0, 10)
        .map(([skill]) => ({ label: skill, type: 'skill', value: skill }))

    // Combine with some standard static tags like work style if needed, or just use skills
    // Let's mix in 'remote' if it has significant count
    const remoteCount = jobsMeta?.filter(j => j.work_style === 'remote').length || 0
    const dynamicTags = [
        ...popularSkillTags,
        // Add Remote tag if relevant
        ...(remoteCount > 0 ? [{ label: 'フルリモート', type: 'work_style', value: 'remote' }] : [])
    ]

    // Fallback if no meta provided (e.g. error or loading)
    const displayTags = dynamicTags.length > 0 ? dynamicTags : POPULAR_TAGS

    // Sync state with URL params on mount & when params change
    useEffect(() => {
        const q = searchParams.get('q') || ''
        setKeyword(q)

        const roles = searchParams.get('roles')?.split(',') || []
        setSelectedRoles(roles)

        const workStyles = searchParams.get('work_styles')?.split(',') || []
        setSelectedWorkStyles(workStyles)

        const skills = searchParams.get('skills')?.split(',') || []
        setSelectedSkills(skills)

        const min = searchParams.get('min_price')
        if (min) setMinPrice(min)
        else setMinPrice('')

        const max = searchParams.get('max_price')
        if (max) setMaxPrice(max)
        else setMaxPrice('')
    }, [searchParams])

    const handleRoleChange = (slug: string) => {
        if (selectedRoles.includes(slug)) {
            setSelectedRoles(selectedRoles.filter(r => r !== slug))
        } else {
            setSelectedRoles([...selectedRoles, slug])
        }
    }

    const handleWorkStyleChange = (style: string) => {
        if (selectedWorkStyles.includes(style)) {
            setSelectedWorkStyles(selectedWorkStyles.filter(s => s !== style))
        } else {
            setSelectedWorkStyles([...selectedWorkStyles, style])
        }
    }

    const handleSkillChange = (skill: string) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(selectedSkills.filter(s => s !== skill))
        } else {
            setSelectedSkills([...selectedSkills, skill])
        }
    }

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString())

        if (keyword) {
            params.set('q', keyword)
        } else {
            params.delete('q')
        }

        if (selectedRoles.length > 0) {
            params.set('roles', selectedRoles.join(','))
        } else {
            params.delete('roles')
        }

        if (selectedWorkStyles.length > 0) {
            params.set('work_styles', selectedWorkStyles.join(','))
        } else {
            params.delete('work_styles')
        }

        if (selectedSkills.length > 0) {
            params.set('skills', selectedSkills.join(','))
        } else {
            params.delete('skills')
        }

        if (minPrice) {
            params.set('min_price', minPrice)
        } else {
            params.delete('min_price')
        }

        if (maxPrice) {
            params.set('max_price', maxPrice)
        } else {
            params.delete('max_price')
        }

        router.push(`/jobs?${params.toString()}`)
        setIsOpen(false)
    }

    const toggleTag = (tag: { type: string, value: string }) => {
        const params = new URLSearchParams(searchParams.toString())
        let currentValues: string[] = []

        if (tag.type === 'skill') {
            currentValues = params.get('skills')?.split(',') || []
            if (currentValues.includes(tag.value)) {
                currentValues = currentValues.filter(v => v !== tag.value)
            } else {
                currentValues.push(tag.value)
            }
            if (currentValues.length > 0) params.set('skills', currentValues.join(','))
            else params.delete('skills')
        } else if (tag.type === 'role') {
            currentValues = params.get('roles')?.split(',') || []
            if (currentValues.includes(tag.value)) {
                currentValues = currentValues.filter(v => v !== tag.value)
            } else {
                currentValues.push(tag.value)
            }
            if (currentValues.length > 0) params.set('roles', currentValues.join(','))
            else params.delete('roles')
        } else if (tag.type === 'work_style') {
            currentValues = params.get('work_styles')?.split(',') || []
            if (currentValues.includes(tag.value)) {
                currentValues = currentValues.filter(v => v !== tag.value)
            } else {
                currentValues.push(tag.value)
            }
            if (currentValues.length > 0) params.set('work_styles', currentValues.join(','))
            else params.delete('work_styles')
        }

        // Immediate reflection
        router.push(`/jobs?${params.toString()}`)
    }

    const clearFilters = () => {
        setKeyword('')
        setSelectedRoles([])
        setSelectedWorkStyles([])
        setSelectedSkills([])
        setMinPrice('')
        setMaxPrice('')
    }

    // Helper to get active filters with type and value
    const getActiveFilters = () => {
        const filters: { label: string, type: 'keyword' | 'role' | 'work_style' | 'skill' | 'price', value: string }[] = []

        if (keyword) filters.push({ label: `"${keyword}"`, type: 'keyword', value: keyword })

        selectedRoles.forEach(slug => {
            const label = Object.keys(ROLE_MAP).find(key => ROLE_MAP[key] === slug)
            if (label) filters.push({ label, type: 'role', value: slug })
        })

        selectedWorkStyles.forEach(style => {
            const label = Object.keys(WORK_STYLE_MAP).find(key => WORK_STYLE_MAP[key] === style)
            if (label) filters.push({ label, type: 'work_style', value: style })
        })

        selectedSkills.forEach(skill => filters.push({ label: skill, type: 'skill', value: skill }))

        if (minPrice || maxPrice) {
            const minLabel = minPrice ? (PRICE_OPTIONS.find(p => p.value === minPrice)?.label || `${Number(minPrice) / 10000}万円`) : '下限なし'
            const maxLabel = maxPrice ? (PRICE_OPTIONS.find(p => p.value === maxPrice)?.label || `${Number(maxPrice) / 10000}万円`) : '上限なし'
            filters.push({ label: `${minLabel} 〜 ${maxLabel}`, type: 'price', value: 'price' })
        }

        return filters
    }

    const activeFilters = getActiveFilters()

    const removeFilter = (tag: { type: string, value: string }) => {
        const params = new URLSearchParams(searchParams.toString())

        if (tag.type === 'keyword') {
            params.delete('q')
        } else if (tag.type === 'price') {
            params.delete('min_price')
            params.delete('max_price')
        } else {
            const paramName = tag.type === 'role' ? 'roles' : tag.type === 'work_style' ? 'work_styles' : 'skills'
            let currentValues = params.get(paramName)?.split(',') || []
            currentValues = currentValues.filter(v => v !== tag.value)

            if (currentValues.length > 0) {
                params.set(paramName, currentValues.join(','))
            } else {
                params.delete(paramName)
            }
        }

        router.push(`/jobs?${params.toString()}`)
    }


    // --- Faceted Count Logic ---
    // Helper to calculate counts for any category based on *current filters*
    // Note: Usually faceted search shows counts based on "what would remain if I selected this AND the other current filters"
    // For simplicity and standard UX, we often show "global counts" or "filtered counts". 
    // Here we will show counts that respect OTHER active filters (e.g. if I selected 'Remote', how many 'Java' jobs are there?)

    // We compute a "base set" of jobs that match CURRENT filters EXCEPT the category we are looking at? 
    // OR we just show counts of matching jobs in the current set (which might be 0 if mutually exclusive).
    // Let's go with: "Number of jobs matching this criteria within the current filter context" 
    // BUT typically checkbox groups are OR within the group and AND across groups.

    // Strategy:
    // 1. To get counts for ROLES: Filter meta by (Title keyword) AND (WorkStyle) AND (Skills) AND (Price)
    // 2. To get counts for SKILLS: Filter meta by (Title keyword) AND (WorkStyle) AND (Roles) AND (Price)
    // 3. To get counts for WORK_STYLES: Filter meta by (Title keyword) AND (Roles) AND (Skills) AND (Price)

    const baseFilter = (job: JobMeta, excludeType: 'role' | 'skill' | 'work_style' | 'none') => {
        // Keyword
        if (keyword) {
            const k = keyword.toLowerCase()
            // Simplified keyword check (in real app, we check title/desc, here we don't have desc in meta. 
            // We only assume title check implies some filtering, but we might miss descriptions.
            // For client side accuracy, we might need title in meta. Let's assume we filter what we can)
            // Note: jobsMeta passed earlier doesn't have title. We added 'role'. 
            // Let's skip keyword filtering for counts to avoid inconsistency if we don't have title.
            // Or better, let's just respect the 'categorical' filters which are strict.
        }

        // Price
        if (minPrice && (job.price_min === null || job.price_min < Number(minPrice))) return false
        if (maxPrice && (job.price_max === null || job.price_max > Number(maxPrice))) return false

        // Roles (skip if we are calculating role counts)
        if (excludeType !== 'role' && selectedRoles.length > 0) {
            if (!selectedRoles.includes(job.role.slug)) return false
        }

        // Skills (skip if we are calculating skill counts)
        if (excludeType !== 'skill' && selectedSkills.length > 0) {
            // Job must have AT LEAST ONE of the selected skills? Or ALL? 
            // In the main query logic: query.in('job_skills.skills.name', skills) -> ANY match usually.
            const hasMatch = job.skills.some(s => selectedSkills.includes(s))
            if (!hasMatch) return false
        }

        // Work Styles (skip if we are calculating work_style counts)
        if (excludeType !== 'work_style' && selectedWorkStyles.length > 0) {
            if (!selectedWorkStyles.includes(job.work_style)) return false
        }

        return true
    }

    const getCounts = (type: 'role' | 'skill' | 'work_style') => {
        const counts: { [key: string]: number } = {}

        jobsMeta?.forEach(job => {
            if (baseFilter(job, type)) {
                if (type === 'role') {
                    counts[job.role.slug] = (counts[job.role.slug] || 0) + 1
                } else if (type === 'work_style') {
                    counts[job.work_style] = (counts[job.work_style] || 0) + 1
                } else if (type === 'skill') {
                    job.skills.forEach(s => {
                        counts[s] = (counts[s] || 0) + 1
                    })
                }
            }
        })
        return counts
    }

    const roleCounts = getCounts('role')
    const skillCountsForFilter = getCounts('skill')
    const workStyleCounts = getCounts('work_style')


    // ... [Render code follows] ...
    return (
        <div className="mb-6">
            {/* ... [Trigger Button & Tags] ... */}
            <div className="flex flex-wrap items-center gap-4">
                {/* ... (Existing trigger button code) ... */}
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium shadow-sm transition-all active:scale-95"
                >
                    <Filter className="w-4 h-4" />
                    条件を絞り込む
                </button>

                <button
                    onClick={() => setShowHelp(true)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="検索のヒント"
                >
                    <HelpCircle className="w-5 h-5" />
                </button>

                {/* Popular Tags */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-500 mr-1">よく検索されるタグ:</span>
                    {displayTags.map((tag) => {
                        let isActive = false
                        if (tag.type === 'skill') isActive = selectedSkills.includes(tag.value)
                        if (tag.type === 'role') isActive = selectedRoles.includes(tag.value)
                        if (tag.type === 'work_style') isActive = selectedWorkStyles.includes(tag.value)

                        return (
                            <button
                                key={tag.label}
                                onClick={() => toggleTag(tag)}
                                className={`
                                    px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                                    ${isActive
                                        ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-primary-400 hover:bg-primary-50'}
                                `}
                            >
                                {tag.label}
                            </button>
                        )
                    })}
                </div>

                <div className="w-full sm:w-auto h-px bg-gray-100 sm:h-8 sm:w-px mx-0 sm:mx-2 hidden sm:block"></div>

                {/* Active Filter Tags */}
                <div className="flex flex-wrap gap-2">
                    {activeFilters.map((tag, idx) => (
                        <span key={idx} className="bg-primary-50 text-primary-700 pl-3 pr-1 py-1 rounded-full text-sm flex items-center gap-1 border border-primary-100 animate-in fade-in zoom-in duration-200">
                            {tag.label}
                            <button
                                onClick={() => removeFilter(tag)}
                                className="p-1 hover:bg-primary-100 rounded-full transition-colors text-primary-400 hover:text-primary-700"
                                aria-label={`${tag.label}を削除`}
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </span>
                    ))}
                    {activeFilters.length > 0 && (
                        <button
                            onClick={() => {
                                clearFilters()
                                const params = new URLSearchParams(searchParams.toString())
                                router.push(`/jobs`)
                            }}
                            className="text-gray-400 hover:text-gray-600 text-sm underline decoration-gray-300 underline-offset-4 transition-colors"
                        >
                            リセット
                        </button>
                    )}
                </div>
            </div>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900">検索条件を設定</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-10">

                            {/* Keyword Search */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-primary-500 rounded-full"></span>
                                    フリーワード
                                </h4>
                                <input
                                    type="text"
                                    placeholder="Java, フルリモート, PMO など"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                            </div>

                            {/* Price Section */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-primary-500 rounded-full"></span>
                                    金額
                                </h4>
                                <div className="flex items-center gap-4">
                                    <div className="relative flex-1">
                                        <select
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                        >
                                            <option value="">下限なし</option>
                                            {PRICE_OPTIONS.filter(o => o.value !== '').map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
                                    </div>
                                    <span className="text-gray-400 font-medium">〜</span>
                                    <div className="relative flex-1">
                                        <select
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                        >
                                            <option value="">上限なし</option>
                                            {PRICE_OPTIONS.filter(o => o.value !== '').map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
                                    </div>
                                </div>
                            </div>

                            {/* Role Section */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-primary-500 rounded-full"></span>
                                    職種
                                </h4>
                                <div className="space-y-6">
                                    {ROLE_CATEGORIES.map(category => (
                                        <div key={category.name}>
                                            <h5 className="text-xs font-bold text-gray-500 mb-2 border-b border-gray-100 pb-1">{category.name}</h5>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                {category.items.map((item) => {
                                                    const isSelected = selectedRoles.includes(item.slug)
                                                    const count = roleCounts[item.slug] || 0
                                                    return (
                                                        <label
                                                            key={item.slug}
                                                            className={`
                                                                flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-all text-sm
                                                                ${isSelected ? 'bg-primary-50 border-primary-500 text-primary-700' : 'bg-white border-gray-100 hover:border-gray-300 text-gray-600'}
                                                                ${count === 0 && !isSelected ? 'opacity-50' : ''}
                                                            `}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                className="hidden"
                                                                checked={isSelected}
                                                                onChange={() => handleRoleChange(item.slug)}
                                                            />
                                                            <div className={`w-3 h-3 rounded-sm border flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-primary-500 border-primary-500 text-white' : 'border-gray-300 bg-white'}`}>
                                                                {isSelected && <Check className="w-2 h-2" />}
                                                            </div>
                                                            <span className="truncate flex-1">{item.label}</span>
                                                            <span className="text-xs text-gray-400">({count})</span>
                                                        </label>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Skills Section */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-primary-500 rounded-full"></span>
                                    スキル・言語
                                </h4>
                                <div className="space-y-6">
                                    {SKILL_CATEGORIES.map(category => (
                                        <div key={category.name}>
                                            <h5 className="text-xs font-bold text-gray-500 mb-2 border-b border-gray-100 pb-1">{category.name}</h5>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                                                {category.items.map((skill) => {
                                                    const isSelected = selectedSkills.includes(skill)
                                                    const count = skillCountsForFilter[skill] || 0

                                                    // Hide skills with 0 count to reduce noise? Or just dim them.
                                                    // Let's dim them.
                                                    return (
                                                        <label
                                                            key={skill}
                                                            className={`
                                                                flex items-center justify-center p-1.5 rounded-md border cursor-pointer transition-all text-xs font-medium text-center shadow-sm relative
                                                                ${isSelected ? 'bg-primary-600 border-primary-600 text-white shadow-md' : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-300'}
                                                                ${count === 0 && !isSelected ? 'opacity-40 grayscale' : ''}
                                                            `}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                className="hidden"
                                                                checked={isSelected}
                                                                onChange={() => handleSkillChange(skill)}
                                                            />
                                                            <span>{skill}</span>
                                                            {count > 0 && <span className={`ml-1 text-[10px] ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>({count})</span>}
                                                        </label>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Work Style Section */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-primary-500 rounded-full"></span>
                                    働き方
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {Object.entries(WORK_STYLE_MAP).map(([label, value]) => {
                                        const isSelected = selectedWorkStyles.includes(value)
                                        const count = workStyleCounts[value] || 0
                                        return (
                                            <label
                                                key={value}
                                                className={`
                                                    flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all
                                                    ${isSelected ? 'bg-primary-50 border-primary-500 text-primary-700' : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'}
                                                    ${count === 0 && !isSelected ? 'opacity-50' : ''}
                                                `}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={isSelected}
                                                    onChange={() => handleWorkStyleChange(value)}
                                                />
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-primary-500 border-primary-500 text-white' : 'border-gray-300 bg-white'}`}>
                                                    {isSelected && <Check className="w-3 h-3" />}
                                                </div>
                                                <span className="text-sm font-medium">{label}</span>
                                                <span className="text-xs text-gray-400 ml-auto">({count})</span>
                                            </label>
                                        )
                                    })}
                                </div>
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50 rounded-b-xl">
                            {/* ... (Existing footer code) ... */}
                            <button
                                onClick={clearFilters}
                                className="text-gray-500 hover:text-gray-700 text-sm font-medium px-4 py-2 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                全てクリア
                            </button>
                            <button
                                onClick={applyFilters}
                                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-primary-200 transition-all transform active:scale-95"
                            >
                                条件を適用する
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Help Modal */}
            {showHelp && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200 relative">
                        <button
                            onClick={() => setShowHelp(false)}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <HelpCircle className="w-5 h-5 text-blue-600" />
                            検索のルールについて
                        </h3>

                        <div className="space-y-4 text-sm text-gray-600">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <h4 className="font-bold text-blue-800 mb-1">🔍 キーワード検索</h4>
                                <p>スペースで区切ると、<span className="font-bold text-blue-700">すべてを含む</span>案件を探します（AND検索）。</p>
                                <p className="text-xs text-blue-600 mt-1">例：「Java リモート」→ Javaかつリモートの案件</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <h4 className="font-bold text-gray-800 mb-1">📂 同じ種類の条件</h4>
                                <p>同じ種類のタグ（職種・スキルなど）を複数選ぶと、<span className="font-bold text-gray-800">いずれかを含む</span>案件を探します（OR検索）。</p>
                                <p className="text-xs text-gray-500 mt-1">例：「Java」「Python」を選択 → JavaまたはPythonの案件</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <h4 className="font-bold text-gray-800 mb-1">🔗 異なる種類の条件</h4>
                                <p>異なる種類の条件（職種 × スキルなど）は、<span className="font-bold text-gray-800">掛け合わせ</span>で絞り込みます（AND検索）。</p>
                                <p className="text-xs text-gray-500 mt-1">例：「エンジニア」×「フルリモート」→ 両方を満たす案件</p>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setShowHelp(false)}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors w-full"
                            >
                                理解しました
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


