import { Filter, HelpCircle, X } from 'lucide-react'
import type { ActiveFilterTag, FilterState, PopularFilterTag } from './job-filter-types'

type JobFilterToolbarProps = {
    activeFilters: ActiveFilterTag[]
    currentFilters: FilterState
    displayTags: PopularFilterTag[]
    onOpenFilters: () => void
    onOpenHelp: () => void
    onRemoveFilter: (tag: ActiveFilterTag) => void
    onReset: () => void
    onToggleTag: (tag: PopularFilterTag) => void
}

export function JobFilterToolbar({
    activeFilters,
    currentFilters,
    displayTags,
    onOpenFilters,
    onOpenHelp,
    onRemoveFilter,
    onReset,
    onToggleTag,
}: JobFilterToolbarProps) {
    return (
        <div className="flex flex-wrap items-center gap-4">
            <button
                onClick={onOpenFilters}
                className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium shadow-sm transition-all active:scale-95"
            >
                <Filter className="w-4 h-4" />
                条件を絞り込む
            </button>

            <button
                onClick={onOpenHelp}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="検索のヒント"
            >
                <HelpCircle className="w-5 h-5" />
            </button>

            <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500 mr-1">よく検索されるタグ:</span>
                {displayTags.map((tag) => {
                    let isActive = false
                    if (tag.type === 'skill') isActive = currentFilters.selectedSkills.includes(tag.value)
                    if (tag.type === 'role') isActive = currentFilters.selectedRoles.includes(tag.value)
                    if (tag.type === 'work_style') isActive = currentFilters.selectedWorkStyles.includes(tag.value)

                    return (
                        <button
                            key={tag.label}
                            onClick={() => onToggleTag(tag)}
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

            <div className="flex flex-wrap gap-2">
                {activeFilters.map((tag, idx) => (
                    <span key={`${tag.type}-${tag.value}-${idx}`} className="bg-primary-50 text-primary-700 pl-3 pr-1 py-1 rounded-full text-sm flex items-center gap-1 border border-primary-100 animate-in fade-in zoom-in duration-200">
                        {tag.label}
                        <button
                            onClick={() => onRemoveFilter(tag)}
                            className="p-1 hover:bg-primary-100 rounded-full transition-colors text-primary-400 hover:text-primary-700"
                            aria-label={`${tag.label}を削除`}
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </span>
                ))}
                {activeFilters.length > 0 && (
                    <button
                        onClick={onReset}
                        className="text-gray-400 hover:text-gray-600 text-sm underline decoration-gray-300 underline-offset-4 transition-colors"
                    >
                        リセット
                    </button>
                )}
            </div>
        </div>
    )
}
