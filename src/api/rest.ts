import { config } from '../config'
import type { PriceData, PriceHistoryResponse } from '../types'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${config.apiUrl}${path}`
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`${res.status} ${res.statusText}: ${text}`)
  }
  return res.json() as Promise<T>
}

export async function fetchAllPrices(pairs?: string[]): Promise<PriceData[]> {
  const params = pairs?.length ? `?pairs=${pairs.join(',')}` : ''
  return request<PriceData[]>(`/api/prices${params}`)
}

export async function fetchPrice(pair: string): Promise<PriceData> {
  return request<PriceData>(`/api/prices/${encodeURIComponent(pair)}`)
}

export async function fetchPriceHistory(
  pair: string,
  limit = 100,
  offset = 0
): Promise<PriceHistoryResponse> {
  return request<PriceHistoryResponse>(
    `/api/prices/${encodeURIComponent(pair)}/history?limit=${limit}&offset=${offset}`
  )
}

export async function fetchHealth(): Promise<{ status: string; uptime: number }> {
  return request('/health')
}
