# Order Dashboard

Responsive React + TypeScript implementation of an order-search dashboard. Users can search by an
inclusive date range, review matching orders, and expand an order to see additional details and
warnings. Period and status are intentionally fixed to `Transmission` and `Waiting` for the MVP.

## Run locally

```bash
npm ci
npm run dev
```

`npm ci` installs the exact dependency tree committed in `package-lock.json`.

## Production check

```bash
npm run lint
npm run build
```

## Architecture

```text
Search form
    -> OrderSearchRequest
    -> mock orders API
    -> OrderSearchResponse
    -> loading / error / empty / results UI
```

- `src/types.ts` defines the `Order` model and the typed search request/response contract.
- `src/data/orders.ts` contains the frontend test dataset.
- `src/api/ordersApi.ts` acts as the backend boundary. It simulates network latency, applies the
  date and status filters, and returns `{ items, total }` asynchronously.
- `src/App.tsx` coordinates request lifecycle and page-level state, but does not know how orders are
  stored, filtered, or rendered.
- `src/components` separates the search form, table, row, and details into focused presentation
  boundaries. `SearchFilters` owns its draft values and validation.
- `src/utils/formatters.ts` centralizes date and number presentation rules.

The API accepts an `AbortSignal`. Starting a newer search cancels the previous request so an older,
slower response cannot replace the latest results. The UI explicitly handles loading, request error,
retry, empty, and success states.

The mock implementation can later be replaced by an HTTP request inside `searchOrders` without
changing the presentation layer or its data contract.

## Responsive behavior

The desktop table displays the complete order summary. At widths up to `820px`, optional columns
and the expand control are hidden, leaving the four columns required for mobile:

- Account
- Operation
- Symbol
- Status

The search form also changes from a single row to a two-column layout, with the Search button taking
the full available width.
