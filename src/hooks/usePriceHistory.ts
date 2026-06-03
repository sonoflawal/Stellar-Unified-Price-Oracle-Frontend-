import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchPriceHistory } from '../api/rest'
import type { PriceHistoryEntry } from '../types'

export function usePriceHistory(pair: string | null, limit = 100) {
  const [history, setHistory] = useState<PriceHistoryEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined)

  const load = useCallback(async () => {
    if (!pair) return
    setLoading(true)
    try {
      const res = await fetchPriceHistory(pair, limit)
      setHistory(res.history)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch history')
    } finally {
      setLoading(false)
    }
  }, [pair, limit])

  useEffect(() => {
    load()
    intervalRef.current = setInterval(load, 30_000)
    return () => clearInterval(intervalRef.current)
  }, [load])

  return { history, loading, error, refetch: load }
}
