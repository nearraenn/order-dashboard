import { orders } from '../data/orders'
import type { OrderSearchRequest, OrderSearchResponse } from '../types'

const MOCK_LATENCY_MS = 450

/**
 * Mock boundary for the backend order-search endpoint.
 *
 * Keeping filtering and transport timing here means the UI consumes the same async contract it
 * would use with a real HTTP client. The AbortSignal prevents an older search from overwriting a
 * newer result when requests finish out of order.
 */
export async function searchOrders(
  request: OrderSearchRequest,
  signal?: AbortSignal,
): Promise<OrderSearchResponse> {
  await delay(MOCK_LATENCY_MS, signal)

  if (request.startDate > request.endDate) {
    throw new Error('Starting date must be before ending date.')
  }

  const items = orders.filter((order) => {
    const orderDate = order.date.slice(0, 10)
    return order.status === request.status
      && orderDate >= request.startDate
      && orderDate <= request.endDate
  })

  return { items, total: items.length }
}

function delay(milliseconds: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason ?? new DOMException('Request aborted', 'AbortError'))
      return
    }

    const timeoutId = window.setTimeout(() => {
      signal?.removeEventListener('abort', abort)
      resolve()
    }, milliseconds)

    function abort() {
      window.clearTimeout(timeoutId)
      reject(signal?.reason ?? new DOMException('Request aborted', 'AbortError'))
    }

    signal?.addEventListener('abort', abort, { once: true })
  })
}
