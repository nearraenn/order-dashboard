import type { Order } from '../types'

const seed = [
  ['10000000', 'Buy', 'NA', 'NATIONAL BANK OF CANADA', 11, 1, 135, '2023-01-04T03:02:14', '85749207'],
  ['00000001', 'Buy', 'NA', 'NATIONAL BANK OF CANADA', 5, 0, 526, '2022-12-08T05:12:36', '13830581'],
  ['00000002', 'Buy', 'NA', 'NATIONAL BANK OF CANADA', 90, 0, 744, '2022-12-15T23:30:32', '20435409'],
  ['00000003', 'Buy', 'NA', 'NATIONAL BANK OF CANADA', 60, 0, 369, '2023-01-04T02:57:35', '09612755'],
  ['00000004', 'Buy', 'NA', 'NATIONAL BANK OF CANADA', 1000, 0, 909, '2023-01-04T03:05:44', '96674263'],
  ['00000005', 'Sell', 'RY', 'ROYAL BANK OF CANADA', 32, 0, 660, '2023-01-04T03:05:44', '20778443'],
  ['00000006', 'Buy', 'BMO', 'BANK OF MONTREAL', 800, 0, 672, '2023-01-04T03:05:44', '61647068'],
  ['00000007', 'Sell', 'TD', 'TORONTO-DOMINION BANK', 5, 0, 526, '2022-12-08T05:12:36', '13830581'],
  ['00000008', 'Buy', 'NA', 'NATIONAL BANK OF CANADA', 90, 0, 744, '2022-12-15T23:30:32', '20435409'],
  ['00000009', 'Buy', 'BNS', 'BANK OF NOVA SCOTIA', 60, 0, 369, '2023-01-04T02:57:35', '09612755'],
  ['00000010', 'Buy', 'NA', 'NATIONAL BANK OF CANADA', 1000, 1, 909, '2023-01-04T03:05:44', '96674263'],
  ['00000011', 'Buy', 'CM', 'CANADIAN IMPERIAL BANK', 32, 0, 660, '2023-01-04T03:05:44', '20778443'],
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
