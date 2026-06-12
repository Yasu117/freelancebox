import { Check, X } from 'lucide-react'
import { PRICE_OPTIONS, ROLE_CATEGORIES, SKILL_CATEGORIES, WORK_STYLE_MAP } from '@/lib/constants'
import type { CountMap, FilterState } from './job-filter-types'

type JobFilterModalProps = {
    draftFilters: FilterState
    roleCounts: CountMap
    skillCounts: CountMap
    workStyleCounts: CountMap
    onApply: () => void
    onClear: () => void
    onClose: () => void
    onKeywordChange: (value: string) => void
    onMaxPriceChange: (value: string) => void
    onMinPriceChange: (value: string) => void
    onToggleRole: (value: string) => void
    onToggleSkill: (value: string) => void
    onToggleWorkStyle: (value: string) => void
}

export function JobFilterModal({
    draftFilters,
    roleCounts,
    skillCounts,
    workStyleCounts,
    onApply,
    onClear,
    onClose,
    onKeywordChange,
    onMaxPriceChange,
    onMinPriceChange,
    onToggleRole,
    onToggleSkill,
    onToggleWorkStyle,
}: JobFilterModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">検索条件を設定</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-10">
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="w-1 h-4 bg-primary-500 rounded-full"></span>
                            フリーワード
                        </h4>
                        <input
                            type="text"
                            placeholder="Java, フルリモート, PMO など"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            value={draftFilters.keyword}
                            onChange={(e) => onKeywordChange(e.target.value)}
                        />
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="w-1 h-4 bg-primary-500 rounded-full"></span>
                            金額
                        </h4>
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <select
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                                    value={draftFilters.minPrice}
                                    onChange={(e) => onMinPriceChange(e.target.value)}
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
                                    value={draftFilters.maxPrice}
                                    onChange={(e) => onMaxPriceChange(e.target.value)}
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
                                            const isSelected = draftFilters.selectedRoles.includes(item.slug)
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
                                                        onChange={() => onToggleRole(item.slug)}
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
                                            const isSelected = draftFilters.selectedSkills.includes(skill)
                                            const count = skillCounts[skill] || 0

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
                                                        onChange={() => onToggleSkill(skill)}
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

                    <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="w-1 h-4 bg-primary-500 rounded-full"></span>
                            働き方
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {Object.entries(WORK_STYLE_MAP).map(([label, value]) => {
                                const isSelected = draftFilters.selectedWorkStyles.includes(value)
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
                                            onChange={() => onToggleWorkStyle(value)}
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

                <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50 rounded-b-xl">
                    <button
                        onClick={onClear}
                        className="text-gray-500 hover:text-gray-700 text-sm font-medium px-4 py-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        全てクリア
                    </button>
                    <button
                        onClick={onApply}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-primary-200 transition-all transform active:scale-95"
                    >
                        条件を適用する
                    </button>
                </div>
            </div>
        </div>
    )
}
