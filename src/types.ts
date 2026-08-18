export type OrderStatus = 'Waiting'
export type Operation = 'Buy' | 'Sell'

export interface Order {
  id: string
  account: string
  accountName: string
  operation: Operation
  symbol: string
  description: string
  quantity: number
  filledQuantity: number
  price: number
  status: OrderStatus
  date: string
  expiration: string
  referenceNumber: string
  externalReference: string
  netAmount: number
  exchangeRate: number
  osLimit: number
  userId: string
  telephone: string
}
