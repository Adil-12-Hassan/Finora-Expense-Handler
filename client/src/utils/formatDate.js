import { format, isToday, isYesterday } from 'date-fns'

export const formatDate = (date) => {
    const d = new Date(date)
    if (isToday(d)) return 'Today'
    if (isYesterday(d)) return 'Yesterday'
    return format(d, 'MMM d, yyyy')
}

export const formatShortDate = (date) => format(new Date(date), 'MMM d')
