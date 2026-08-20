import { useState } from 'react'
import type { OrderSearchRequest } from '../types'

interface SearchFiltersProps {
  initialRequest: OrderSearchRequest
  isLoading: boolean
  onSearch: (request: OrderSearchRequest) => void
}

export function SearchFilters({ initialRequest, isLoading, onSearch }: SearchFiltersProps) {
  const [startDate, setStartDate] = useState(initialRequest.startDate)
  const [endDate, setEndDate] = useState(initialRequest.endDate)
  const [error, setError] = useState('')

  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!startDate || !endDate) return setError('Please select both a starting and ending date.')
    if (startDate > endDate) return setError('Starting date must be before ending date.')

    setError('')
    onSearch({ ...initialRequest, startDate, endDate })
  }

  return (
    <>
      <form className="filters" onSubmit={submit}>
        <label><span>Period</span><select aria-label="Period" disabled><option>{initialRequest.period}</option></select></label>
        <label><span>Status</span><select aria-label="Status" disabled><option>{initialRequest.status}</option></select></label>
        <label><span>From</span><input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></label>
        <label><span>To</span><input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} /></label>
        <button className="searchButton" type="submit" disabled={isLoading}>
          <span aria-hidden="true">⌕</span> {isLoading ? 'Searching…' : 'Search'}
        </button>
      </form>
      {error && <p className="error" role="alert">{error}</p>}
    </>
  )
}
