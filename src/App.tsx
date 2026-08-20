import { useCallback, useEffect, useRef, useState } from 'react'
import { searchOrders } from './api/ordersApi'
import type { Order, OrderSearchRequest, OrderSearchResponse } from './types'

const DEFAULT_SEARCH: OrderSearchRequest = {
  period: 'Transmission',
  status: 'Waiting',
  startDate: '2022-12-01',
  endDate: '2026-01-31',
}

const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
})
const moneyFormatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function formatDate(value: string) {
  return dateFormatter.format(new Date(value)).replace(',', '')
}

function Details({ order }: { order: Order }) {
  return (
    <div className="details" id={`details-${order.id}`}>
      <div className="detailsTop">
        <div>
          <strong>{order.accountName}</strong>
          <button className="outlineButton" type="button">Full review details <span aria-hidden="true">↗</span></button>
        </div>
        <div className="actions">
          <button type="button" className="accept">Accept</button>
          <button type="button" className="reject">Reject <span aria-hidden="true">⌄</span></button>
        </div>
      </div>
      <dl className="facts">
        <div><dt>Net Amount</dt><dd>{moneyFormatter.format(order.netAmount)} USD</dd></div>
        <div><dt>Price</dt><dd>{moneyFormatter.format(order.price)}</dd></div>
        <div><dt>Exchange Rate</dt><dd>{order.exchangeRate}</dd></div>
        <div><dt>O/S Limit</dt><dd>{moneyFormatter.format(order.osLimit)}</dd></div>
        <div><dt>Reference Number</dt><dd>{order.referenceNumber}</dd></div>
        <div><dt>Date / Time</dt><dd>{formatDate(order.date)}</dd></div>
        <div><dt>Telephone</dt><dd>{order.telephone}</dd></div>
        <div><dt>User ID</dt><dd>{order.userId}</dd></div>
      </dl>
      <div className="warnings">
        <strong>Warning(s)</strong>
        <ul>
          <li>To trade this security in this account, a currency conversion will be made at the current rate.</li>
          <li>A similar order has already been submitted.</li>
          <li>Your transaction will be processed the following business day.</li>
          <li>It is not possible to calculate the buying power of this order.</li>
        </ul>
      </div>
    </div>
  )
}

function App() {
  const [startDate, setStartDate] = useState(DEFAULT_SEARCH.startDate)
  const [endDate, setEndDate] = useState(DEFAULT_SEARCH.endDate)
  const [expandedId, setExpandedId] = useState<string | null>('order-1')
  const [formError, setFormError] = useState('')
  const [requestError, setRequestError] = useState('')
  const [result, setResult] = useState<OrderSearchResponse | null>(null)
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

  function search(event: React.FormEvent) {
    event.preventDefault()
    if (!startDate || !endDate) return setFormError('Please select both a starting and ending date.')
    if (startDate > endDate) return setFormError('Starting date must be before ending date.')
    setFormError('')
    setExpandedId(null)
    void loadOrders({ ...DEFAULT_SEARCH, startDate, endDate })
  }

  const displayedOrders = result?.items ?? []

  return (
    <main>
      <section className="panel" aria-labelledby="page-title">
        <div className="headingRow">
          <div><p className="eyebrow">Orders</p><h1 id="page-title">Search</h1></div>
          <p className="resultCount" aria-live="polite"><strong>{result?.total ?? 0}</strong> results</p>
        </div>

        <form className="filters" onSubmit={search}>
          <label><span>Period</span><select aria-label="Period" disabled><option>Transmission</option></select></label>
          <label><span>Status</span><select aria-label="Status" disabled><option>Waiting</option></select></label>
          <label><span>From</span><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></label>
          <label><span>To</span><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></label>
          <button className="searchButton" type="submit" disabled={isLoading}><span aria-hidden="true">⌕</span> {isLoading ? 'Searching…' : 'Search'}</button>
        </form>
        {formError && <p className="error" role="alert">{formError}</p>}
        {requestError && <div className="error requestError" role="alert"><span>{requestError}</span><button type="button" onClick={() => void loadOrders({ ...DEFAULT_SEARCH, startDate, endDate })}>Retry</button></div>}

        <div className="tableWrap" aria-busy={isLoading}>
          <table>
            <thead><tr>
              <th className="toggleCell"><span className="srOnly">Expand</span></th>
              <th>Account</th><th>Operation</th><th>Symbol</th><th className="optional">Description</th>
              <th className="optional numeric">Qty.</th><th className="optional numeric">Filled Qty.</th>
              <th className="optional numeric">Price</th><th>Status</th><th className="optional">Date</th>
              <th className="optional">Expiration</th><th className="optional">No. Ref.</th>
              <th className="optional">Ext. Ref.</th><th className="optional"></th>
            </tr></thead>
            <tbody>
              {!isLoading && !requestError && displayedOrders.map((order) => {
                const expanded = order.id === expandedId
                return [
                  <tr className={expanded ? 'activeRow' : ''} key={order.id}>
                    <td className="toggleCell"><button className="toggle" type="button" aria-expanded={expanded} aria-controls={`details-${order.id}`} onClick={() => setExpandedId(expanded ? null : order.id)}><span aria-hidden="true">{expanded ? '⌄' : '›'}</span><span className="srOnly">{expanded ? 'Collapse' : 'Expand'} order {order.account}</span></button></td>
                    <td><button className="accountLink" type="button" onClick={() => setExpandedId(expanded ? null : order.id)}>{order.account}</button></td>
                    <td><span className={`operation ${order.operation.toLowerCase()}`}>{order.operation}</span></td>
                    <td><strong>{order.symbol}</strong></td><td className="optional description">{order.description}</td>
                    <td className="optional numeric">{order.quantity.toLocaleString()}</td><td className="optional numeric">{order.filledQuantity}</td>
                    <td className="optional numeric">{moneyFormatter.format(order.price)}</td>
                    <td><span className="status"><span aria-hidden="true">◷</span> {order.status}</span></td>
                    <td className="optional mono">{formatDate(order.date)}</td><td className="optional mono">{formatDate(order.expiration)}</td>
                    <td className="optional mono">{order.referenceNumber}</td><td className="optional mono">{order.externalReference}</td>
                    <td className="optional"><button className="more" type="button" aria-label={`More actions for ${order.account}`}>•••</button></td>
                  </tr>,
                  expanded && <tr className="detailRow" key={`${order.id}-detail`}><td colSpan={14}><Details order={order} /></td></tr>,
                ]
              })}
            </tbody>
          </table>
          {isLoading && <div className="empty loading" role="status"><span className="spinner" aria-hidden="true" /><h2>Loading orders</h2><p>Please wait while we retrieve the latest results.</p></div>}
          {!isLoading && !requestError && displayedOrders.length === 0 && <div className="empty"><span aria-hidden="true">⌕</span><h2>No orders found</h2><p>Try choosing a wider date range.</p></div>}
        </div>
      </section>
    </main>
  )
}

export default App
