import type { Order } from '../types'
import { formatDate, formatMoney } from '../utils/formatters'

export function OrderDetails({ order }: { order: Order }) {
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
        <div><dt>Net Amount</dt><dd>{formatMoney(order.netAmount)} USD</dd></div>
        <div><dt>Price</dt><dd>{formatMoney(order.price)}</dd></div>
        <div><dt>Exchange Rate</dt><dd>{order.exchangeRate}</dd></div>
        <div><dt>O/S Limit</dt><dd>{formatMoney(order.osLimit)}</dd></div>
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
