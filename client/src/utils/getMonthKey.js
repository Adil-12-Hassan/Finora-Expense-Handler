export const getMonthKey = (date = new Date()) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    return `${year}-${month}`
}

export const getMonthLabel = (monthKey) => {
    const [year, month] = monthKey.split('-')
    return new Date(year, month - 1).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
    })
}