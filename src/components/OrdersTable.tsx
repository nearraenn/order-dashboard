import type { Order } from '../types'
import { OrderRow } from './OrderRow'

interface OrdersTableProps {
  orders: Order[]
  expandedId: string | null
  isLoading: boolean
  error: string
  onToggle: (orderId: string) => void
  onRetry: () => void
}

export function OrdersTable({ orders, expandedId, isLoading, error, onToggle, onRetry }: OrdersTableProps) {
  return (
    <>
      {error && <div className="error requestError" role="alert"><span>{error}</span><button type="button" onClick={onRetry}>Retry</button></div>}
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
            {!isLoading && !error && orders.map((order) => <OrderRow key={order.id} order={order} expanded={order.id === expandedId} onToggle={() => onToggle(order.id)} />)}
          </tbody>
        </table>
        {isLoading && <div className="empty loading" role="status"><span className="spinner" aria-hidden="true" /><h2>Loading orders</h2><p>Please wait while we retrieve the latest results.</p></div>}
        {!isLoading && !error && orders.length === 0 && <div className="empty"><span aria-hidden="true">⌕</span><h2>No orders found</h2><p>Try choosing a wider date range.</p></div>}
      </div>
    </>
  )
}
