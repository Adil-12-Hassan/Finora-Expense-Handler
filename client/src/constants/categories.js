export const CATEGORIES = [
    { label: 'Food', value: 'Food', icon: '🍔', color: '#F5A623' },
    { label: 'Transport', value: 'Transport', icon: '🚗', color: '#7C6EF5' },
    { label: 'Shopping', value: 'Shopping', icon: '🛍️', color: '#F25C5C' },
    { label: 'Bills', value: 'Bills', icon: '⚡', color: '#34C97A' },
    { label: 'Health', value: 'Health', icon: '❤️', color: '#FF6B9D' },
    { label: 'Entertainment', value: 'Entertainment', icon: '🎮', color: '#00D2FF' },
    { label: 'Other', value: 'Other', icon: '📦', color: '#7A7A9A' },
]

export const getCategoryMeta = (value) =>
    CATEGORIES.find((c) => c.value === value) || CATEGORIES[6]