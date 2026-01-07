'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Filter, X, Check } from 'lucide-react'

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

export function JobFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Modal State
    const [isOpen, setIsOpen] = useState(false)

    // Filter State
    const [keyword, setKeyword] = useState('')
    const [selectedRoles, setSelectedRoles] = useState<string[]>([])
    const [selectedWorkStyles, setSelectedWorkStyles] = useState<string[]>([])
    const [selectedSkills, setSelectedSkills] = useState<string[]>([])
    const [minPrice, setMinPrice] = useState<string>('')
    const [maxPrice, setMaxPrice] = useState<string>('')

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

    const toggleTag = (tag: typeof POPULAR_TAGS[0]) => {
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

    // Helper to get labels for active filters
    const getActiveFilterLabels = () => {
        const labels: string[] = []

        if (keyword) labels.push(`"${keyword}"`)

        selectedRoles.forEach(slug => {
            const label = Object.keys(ROLE_MAP).find(key => ROLE_MAP[key] === slug)
            if (label) labels.push(label)
        })

        selectedWorkStyles.forEach(style => {
            const label = Object.keys(WORK_STYLE_MAP).find(key => WORK_STYLE_MAP[key] === style)
            if (label) labels.push(label)
        })

        selectedSkills.forEach(skill => labels.push(skill))

        if (minPrice || maxPrice) {
            const minLabel = minPrice ? (PRICE_OPTIONS.find(p => p.value === minPrice)?.label || `${Number(minPrice) / 10000}万円`) : '下限なし'
            const maxLabel = maxPrice ? (PRICE_OPTIONS.find(p => p.value === maxPrice)?.label || `${Number(maxPrice) / 10000}万円`) : '上限なし'
            labels.push(`${minLabel} 〜 ${maxLabel}`)
        }

        return labels
    }

    const activeLabels = getActiveFilterLabels()

    return (
        <div className="mb-6">
            {/* Trigger Button & Active Tags Bar */}
            <div className="flex flex-wrap items-center gap-4">
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium shadow-sm transition-all active:scale-95"
                >
                    <Filter className="w-4 h-4" />
                    条件を絞り込む
                </button>

                {/* Popular Tags */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-500 mr-1">よく検索されるタグ:</span>
                    {POPULAR_TAGS.map((tag) => {
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
                    {activeLabels.map((label, idx) => (
                        <span key={idx} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center gap-1 border border-primary-100 animate-in fade-in zoom-in duration-200">
                            {label}
                        </span>
                    ))}
                    {activeLabels.length > 0 && (
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
                                                    return (
                                                        <label
                                                            key={item.slug}
                                                            className={`
                                                                flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-all text-sm
                                                                ${isSelected ? 'bg-primary-50 border-primary-500 text-primary-700' : 'bg-white border-gray-100 hover:border-gray-300 text-gray-600'}
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
                                                            <span className="truncate">{item.label}</span>
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
                                                    return (
                                                        <label
                                                            key={skill}
                                                            className={`
                                                                flex items-center justify-center p-1.5 rounded-md border cursor-pointer transition-all text-xs font-medium text-center shadow-sm
                                                                ${isSelected ? 'bg-primary-600 border-primary-600 text-white shadow-md' : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-300'}
                                                            `}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                className="hidden"
                                                                checked={isSelected}
                                                                onChange={() => handleSkillChange(skill)}
                                                            />
                                                            {skill}
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
                                        return (
                                            <label
                                                key={value}
                                                className={`
                                                    flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all
                                                    ${isSelected ? 'bg-primary-50 border-primary-500 text-primary-700' : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'}
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
                                            </label>
                                        )
                                    })}
                                </div>
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50 rounded-b-xl">
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
        </div>
    )
}


