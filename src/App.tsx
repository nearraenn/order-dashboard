import { useCallback, useEffect, useRef, useState } from 'react'
import { searchOrders } from './api/ordersApi'
import { OrdersTable } from './components/OrdersTable'
import { SearchFilters } from './components/SearchFilters'
import type { OrderSearchRequest, OrderSearchResponse } from './types'

const DEFAULT_SEARCH: OrderSearchRequest = {
  period: 'Transmission',
  status: 'Waiting',
  startDate: '2022-12-01',
  endDate: '2026-01-31',
}

function App() {
  const [expandedId, setExpandedId] = useState<string | null>('order-1')
  const [requestError, setRequestError] = useState('')
  const [result, setResult] = useState<OrderSearchResponse | null>(null)
  const [lastRequest, setLastRequest] = useState(DEFAULT_SEARCH)
  const [isLoading, setIsLoading] = useState(true)
  const activeRequest = useRef<AbortController | null>(null)

  const loadOrders = useCallback(async (request: OrderSearchRequest) => {
    activeRequest.current?.abort()
    const controller = new AbortController()
    activeRequest.current = controller
    setIsLoading(true)
    setRequestError('')

    try {
      const response = await searchOrders(request, controller.signal)
      if (!controller.signal.aborted) setResult(response)
    } catch (error) {
      if (!controller.signal.aborted) {
        setRequestError(error instanceof Error ? error.message : 'Unable to load orders. Please try again.')
      }
    } finally {
      if (activeRequest.current === controller) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void loadOrders(DEFAULT_SEARCH), 0)
    return () => {
      window.clearTimeout(initialLoad)
      activeRequest.current?.abort()
    }
  }, [loadOrders])

  function handleSearch(request: OrderSearchRequest) {
    setLastRequest(request)
    setExpandedId(null)
    void loadOrders(request)
  }

  function toggleOrder(orderId: string) {
    setExpandedId((current) => current === orderId ? null : orderId)
  }

  return (
    <main>
      <section className="panel" aria-labelledby="page-title">
        <div className="headingRow">
          <div><p className="eyebrow">Orders</p><h1 id="page-title">Search</h1></div>
          <p className="resultCount" aria-live="polite"><strong>{isLoading ? '—' : result?.total ?? 0}</strong> results</p>
        </div>

        <SearchFilters initialRequest={DEFAULT_SEARCH} isLoading={isLoading} onSearch={handleSearch} />
        <OrdersTable
          orders={result?.items ?? []}
          expandedId={expandedId}
          isLoading={isLoading}
          error={requestError}
          onToggle={toggleOrder}
          onRetry={() => void loadOrders(lastRequest)}
        />
      </section>
    </main>
  )
}

export default App
