export const formatCurrency = (amount, currency = 'PKR') => {
    return new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}