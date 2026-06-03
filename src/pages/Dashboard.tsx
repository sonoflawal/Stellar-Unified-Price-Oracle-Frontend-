import { useNavigate } from 'react-router-dom'
import { usePrices } from '../hooks/usePrices'
import { useWebSocket } from '../hooks/useWebSocket'
import { PriceCard } from '../components/PriceCard'
import { ConnectionBadge } from '../components/ConnectionBadge'

export function Dashboard() {
  const { prices, loading, error } = usePrices()
  const { livePrices, status } = useWebSocket(prices.map((p) => p.assetPair))
  const navigate = useNavigate()

  const merged = prices.map((p) => ({
    ...p,
    ...(livePrices.get(p.assetPair) ?? {}),
  }))

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Price Oracle Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Aggregated from Chainlink, Redstone, Band &amp; Reflector
          </p>
        </div>
        <ConnectionBadge status={status} />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-xl text-sm text-red-400">
          {error}
        </div>
      )}

      {loading && prices.length === 0 && (
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full" />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {merged.map((p) => (
          <PriceCard
            key={p.assetPair}
            price={p}
            isLive={livePrices.has(p.assetPair)}
            onClick={() => navigate(`/price/${encodeURIComponent(p.assetPair)}`)}
          />
        ))}
      </div>

      {!loading && merged.length === 0 && (
        <div className="text-center py-32 text-gray-500">
          <p className="text-lg mb-2">No price feeds available</p>
          <p className="text-sm">Connect to the aggregator API to see price data.</p>
        </div>
      )}
    </div>
  )
}
