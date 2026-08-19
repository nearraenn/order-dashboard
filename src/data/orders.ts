import type { Order } from '../types'

const seed = [
  ['10000000', 'Buy', 'NA', 'NATIONAL BANK OF CANADA', 11, 1, 135, '2022-12-02T09:15:00', '85749207'],
  ['00000001', 'Buy', 'NA', 'NATIONAL BANK OF CANADA', 5, 0, 526, '2023-06-15T11:30:00', '13830581'],
  ['00000002', 'Buy', 'NA', 'NATIONAL BANK OF CANADA', 90, 0, 744, '2024-01-22T14:45:00', '20435409'],
  ['00000003', 'Buy', 'NA', 'NATIONAL BANK OF CANADA', 60, 0, 369, '2024-08-09T10:05:00', '09612755'],
  ['00000004', 'Buy', 'NA', 'NATIONAL BANK OF CANADA', 1000, 0, 909, '2025-03-18T13:20:00', '96674263'],
  ['00000008', 'Buy', 'NA', 'NATIONAL BANK OF CANADA', 90, 0, 744, '2025-09-27T15:40:00', '20435409'],
  ['00000010', 'Buy', 'NA', 'NATIONAL BANK OF CANADA', 1000, 1, 909, '2026-01-30T16:55:00', '96674263'],
] as const

export const orders: Order[] = seed.map((row, index) => {
  const [account, operation, symbol, description, quantity, filledQuantity, price, date, referenceNumber] = row
  return {
    id: `order-${index + 1}`,
    account,
    accountName: index === 0 ? 'FIRST-NAME LAST-NAME (10103ZA - US Margin)' : `CLIENT ACCOUNT ${account}`,
    operation,
    symbol,
    description,
    quantity,
    filledQuantity,
    price,
    status: 'Waiting',
    date,
    expiration: date,
    referenceNumber,
    externalReference: `2-XXXXXXXX1-${index + 1}`,
    netAmount: quantity * price,
    exchangeRate: 1.3357,
    osLimit: 140,
    userId: '12344321',
    telephone: '000-000-0000',
  }
})
