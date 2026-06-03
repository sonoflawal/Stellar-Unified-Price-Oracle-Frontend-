export const config = {
  apiUrl: import.meta.env.VITE_API_URL ?? '/api',
  wsUrl: import.meta.env.VITE_WS_URL ?? `ws://${window.location.hostname}:3000`,
  refreshInterval: 10_000,
  wsReconnectDelay: 3_000,
  wsBroadcastInterval: 5_000,
} as const
