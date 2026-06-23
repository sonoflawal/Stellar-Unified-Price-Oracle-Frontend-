import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePrices } from '../hooks/usePrices'
import { useWebSocket } from '../hooks/useWebSocket'
import { PriceCard } from '../components/PriceCard'
import { PriceCardSkeleton } from '../components/PriceCardSkeleton'
import { ConnectionBadge } from '../components/ConnectionBadge'
import { NetworkStatusBanner } from '../components/NetworkStatusBanner'
import {
  selectSortedPrices,
  selectAverageConfidence,
  selectTopMovers,
  selectStaleAssets,
} from '../selectors/priceSelectors'

function mergePrices(
  restPrices: { assetPair: string; price: number; timestamp: number; confidence: number; sources: string[] }[],
  livePrices: Map<string, { assetPair: string; price: number; timestamp: number; confidence: number; sources: string[] }>,
) {
  return restPrices.map((p) => {
    const live = livePrices.get(p.assetPair)
    if (live && live.timestamp >= p.timestamp) {
      return { ...p, ...live }
    }
    return p
  })
}

const TOP_MOVERS_COUNT = 3
const SKELETON_COUNT = 8

export function Dashboard() {
  const { prices, loading, error } = usePrices()
  const { livePrices, status } = useWebSocket(prices.map((p) => p.assetPair))
  const navigate = useNavigate()

  const merged = mergePrices(prices, livePrices)

  const sortedPrices = useMemo(() => selectSortedPrices(merged), [merged])
  const avgConfidence = useMemo(() => selectAverageConfidence(merged), [merged])
  const topMovers = useMemo(() => selectTopMovers(merged, TOP_MOVERS_COUNT), [merged])
  const staleAssets = useMemo(() => selectStaleAssets(merged), [merged])

  const handleCardClick = useCallback(
    (pair: string) => navigate(`/price/${encodeURIComponent(pair)}`),
    [navigate],
  )

  return (
    <div>
      <NetworkStatusBanner />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Price Oracle Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Aggregated from Chainlink, Redstone, Band &amp; Reflector
          </p>
        </div>
        <ConnectionBadge status={status} />
      </div>

      {merged.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Avg Confidence</p>
            <p className="text-xl font-bold text-cyan-400">
              {(avgConfidence * 100).toFixed(1)}%
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Stale Assets</p>
            <p className={`text-xl font-bold ${staleAssets.length > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {staleAssets.length}
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Top Movers</p>
            <div className="flex flex-wrap gap-1">
              {topMovers.map((p) => (
                <span key={p.assetPair} className="text-sm text-gray-300">
                  {p.assetPair}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-xl text-sm text-red-400" role="alert">
          {error}
        </div>
      )}

      {loading && prices.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" aria-label="Loading price cards">
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <PriceCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" role="list" aria-label="Price feeds">
          {sortedPrices.map((p) => (
            <PriceCard
              key={p.assetPair}
              price={p}
              isLive={livePrices.has(p.assetPair)}
              onClick={() => handleCardClick(p.assetPair)}
            />
          ))}
        </div>
      )}

      {!loading && merged.length === 0 && (
        <div className="text-center py-32 text-gray-500">
          <p className="text-lg mb-2">No price feeds available</p>
          <p className="text-sm">Connect to the aggregator API to see price data.</p>
        </div>
      )}
    </div>
  )
}
