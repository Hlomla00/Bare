import { useState, useEffect, useCallback } from 'react'
import { Zap, Users, CheckCircle, X } from 'lucide-react'

export type ToastType = 'flash' | 'friend_live' | 'booking' | 'info'

export interface ToastPayload {
  id: string
  type: ToastType
  title: string
  body: string
  action?: () => void
  actionLabel?: string
  duration?: number
}

type Listener = (t: ToastPayload) => void
const listeners: Set<Listener> = new Set()

export function showToast(t: Omit<ToastPayload, 'id'>) {
  const payload: ToastPayload = { ...t, id: `${Date.now()}-${Math.random().toString(36).slice(2)}` }
  listeners.forEach((l) => l(payload))
}

const ICONS: Record<ToastType, typeof Zap> = {
  flash: Zap,
  friend_live: Users,
  booking: CheckCircle,
  info: CheckCircle,
}

const COLORS: Record<ToastType, string> = {
  flash: '#FF3547',
  friend_live: '#0EA5E9',
  booking: '#00FF6A',
  info: '#CAFF00',
}

function ToastItem({ toast, onDismiss }: { toast: ToastPayload; onDismiss: () => void }) {
  const Icon = ICONS[toast.type]
  const color = COLORS[toast.type]

  useEffect(() => {
    const timer = setTimeout(onDismiss, toast.duration ?? 4500)
    return () => clearTimeout(timer)
  }, [toast.duration, onDismiss])

  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#141414] border border-[#1E1E1E] shadow-2xl animate-slide-up">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}18` }}
      >
        <Icon className="w-4 h-4" style={{ color }} fill={toast.type === 'flash' ? color : 'none'} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-bold leading-tight">{toast.title}</p>
        <p className="text-[#888] text-xs mt-0.5 leading-snug">{toast.body}</p>
        {toast.action && (
          <button
            onClick={() => { toast.action?.(); onDismiss() }}
            className="mt-2 text-xs font-bold"
            style={{ color }}
          >
            {toast.actionLabel ?? 'View'} →
          </button>
        )}
      </div>
      <button onClick={onDismiss} className="p-1 shrink-0">
        <X className="w-3.5 h-3.5 text-[#444]" />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastPayload[]>([])

  useEffect(() => {
    const listener: Listener = (t) => setToasts((prev) => [t, ...prev].slice(0, 3))
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 left-4 right-4 z-[9999] space-y-2 pt-safe">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>
  )
}
