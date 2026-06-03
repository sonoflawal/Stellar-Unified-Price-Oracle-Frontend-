import { config } from '../config'
import type { WsMessage, WsSubscribeMessage, WsUnsubscribeMessage } from '../types'

type MessageHandler = (msg: WsMessage) => void
type StatusHandler = (status: ConnectionStatus) => void

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting'

export class WebSocketClient {
  private ws: WebSocket | null = null
  private messageHandlers = new Set<MessageHandler>()
  private statusHandlers = new Set<StatusHandler>()
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private destroyed = false
  private subscribedPairs = new Set<string>()

  private _status: ConnectionStatus = 'disconnected'
  get status(): ConnectionStatus {
    return this._status
  }

  private setStatus(status: ConnectionStatus) {
    this._status = status
    this.statusHandlers.forEach((h) => h(status))
  }

  connect() {
    if (this.destroyed) return
    this.setStatus('connecting')
    this.ws = new WebSocket(config.wsUrl)

    this.ws.onopen = () => {
      this.setStatus('connected')
      if (this.subscribedPairs.size > 0) {
        this.send({
          action: 'subscribe',
          assetPairs: Array.from(this.subscribedPairs),
        })
      }
    }

    this.ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data) as WsMessage
        this.messageHandlers.forEach((h) => h(msg))
      } catch {
        // ignore malformed messages
      }
    }

    this.ws.onclose = () => {
      this.setStatus('disconnected')
      this.scheduleReconnect()
    }

    this.ws.onerror = () => {
      this.ws?.close()
    }
  }

  private scheduleReconnect() {
    if (this.destroyed || this.reconnectTimer) return
    this.setStatus('reconnecting')
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this.connect()
    }, config.wsReconnectDelay)
  }

  disconnect() {
    this.destroyed = true
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    this.ws?.close()
    this.ws = null
    this.setStatus('disconnected')
  }

  send(msg: WsSubscribeMessage | WsUnsubscribeMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg))
    }
  }

  subscribe(pairs: string | string[]) {
    const arr = typeof pairs === 'string' ? [pairs] : pairs
    arr.forEach((p) => this.subscribedPairs.add(p))
    this.send({ action: 'subscribe', assetPairs: arr })
  }

  unsubscribe(pairs: string | string[]) {
    const arr = typeof pairs === 'string' ? [pairs] : pairs
    arr.forEach((p) => this.subscribedPairs.delete(p))
    this.send({ action: 'unsubscribe', assetPairs: arr })
  }

  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler)
    return () => this.messageHandlers.delete(handler)
  }

  onStatusChange(handler: StatusHandler): () => void {
    this.statusHandlers.add(handler)
    return () => this.statusHandlers.delete(handler)
  }
}
