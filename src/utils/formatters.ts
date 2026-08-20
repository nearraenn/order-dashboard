const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
})

const moneyFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatDate(value: string): string {
  return dateFormatter.format(new Date(value)).replace(',', '')
}

export function formatMoney(value: number): string {
  return moneyFormatter.format(value)
}
