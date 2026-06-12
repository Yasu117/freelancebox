export type FilterState = {
    keyword: string
    selectedRoles: string[]
    selectedWorkStyles: string[]
    selectedSkills: string[]
    minPrice: string
    maxPrice: string
}

export type PopularFilterTag = {
    label: string
    type: 'skill' | 'role' | 'work_style'
    value: string
}

export type ActiveFilterTag = {
    label: string
    type: 'keyword' | 'role' | 'work_style' | 'skill' | 'price'
    value: string
}

export type CountMap = Record<string, number>
