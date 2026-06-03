import type { PriceData } from '../types'

function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (price >= 1) return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
  return price.toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 8 })
}

function timeAgo(ts: number): string {
  const sec = Math.floor((Date.now() - ts) / 1000)
  if (sec < 60) return `${sec}s ago`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  return `${Math.floor(min / 60)}h ago`
}

const SOURCE_COLORS: Record<string, string> = {
  chainlink: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  redstone: 'bg-red-500/20 text-red-400 border-red-500/30',
  band: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  reflector: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
}

interface PriceCardProps {
  price: PriceData
  onClick?: () => void
  isLive?: boolean
}

export function PriceCard({ price, onClick, isLive }: PriceCardProps) {
  const confidencePct = (price.confidence * 100).toFixed(1)

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 hover:bg-gray-900/80 transition-all shadow-lg shadow-black/20"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-100">{price.assetPair}</h3>
        {isLive && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
      </div>

      <div className="text-3xl font-bold text-white mb-3 font-mono tracking-tight">
        ${formatPrice(price.price)}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <span>Updated {timeAgo(price.timestamp)}</span>
        <span className="text-cyan-400">{confidencePct}% confidence</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {price.sources.map((src) => (
          <span
            key={src}
            className={`px-2 py-0.5 rounded text-xs font-medium border ${SOURCE_COLORS[src] ?? 'bg-gray-800 text-gray-400 border-gray-700'}`}
          >
            {src}
          </span>
        ))}
      </div>
    </button>
  )
}
