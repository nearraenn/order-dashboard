import { Fragment } from 'react'
import type { Order } from '../types'
import { formatDate, formatMoney } from '../utils/formatters'
import { OrderDetails } from './OrderDetails'

interface OrderRowProps {
  order: Order
  expanded: boolean
  onToggle: () => void
}

export function OrderRow({ order, expanded, onToggle }: OrderRowProps) {
  return (
    <Fragment>
      <tr className={expanded ? 'activeRow' : ''}>
        <td className="toggleCell"><button className="toggle" type="button" aria-expanded={expanded} aria-controls={`details-${order.id}`} onClick={onToggle}><span aria-hidden="true">{expanded ? '⌄' : '›'}</span><span className="srOnly">{expanded ? 'Collapse' : 'Expand'} order {order.account}</span></button></td>
        <td><button className="accountLink" type="button" onClick={onToggle}>{order.account}</button></td>
        <td><span className={`operation ${order.operation.toLowerCase()}`}>{order.operation}</span></td>
        <td><strong>{order.symbol}</strong></td><td className="optional description">{order.description}</td>
        <td className="optional numeric">{order.quantity.toLocaleString()}</td><td className="optional numeric">{order.filledQuantity}</td>
        <td className="optional numeric">{formatMoney(order.price)}</td>
        <td><span className="status"><span aria-hidden="true">◷</span> {order.status}</span></td>
        <td className="optional mono">{formatDate(order.date)}</td><td className="optional mono">{formatDate(order.expiration)}</td>
        <td className="optional mono">{order.referenceNumber}</td><td className="optional mono">{order.externalReference}</td>
        <td className="optional"><button className="more" type="button" aria-label={`More actions for ${order.account}`}>•••</button></td>
      </tr>
      {expanded && <tr className="detailRow"><td colSpan={14}><OrderDetails order={order} /></td></tr>}
    </Fragment>
  )
}
