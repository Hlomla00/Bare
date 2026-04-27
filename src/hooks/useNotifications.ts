import { useState, useEffect } from 'react'
import { showToast } from '../components/Toast'

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if (!('Notification' in window)) return 'denied' as const
    const result = await Notification.requestPermission()
    setPermission(result)
    return result
  }

  const send = (title: string, body: string, data?: Record<string, unknown>) => {
    if (permission === 'granted' && 'Notification' in window) {
      const n = new Notification(title, {
        body,
        icon: '/Bare/icon-192.png',
        badge: '/Bare/icon-192.png',
        data,
      })
      n.onclick = () => { window.focus(); n.close() }
    }
  }

  return { permission, requestPermission, send }
}

// Fire a simulated flash slot notification after 15 seconds (demo)
export function useFlashSlotDemo() {
  useEffect(() => {
    const timer = setTimeout(() => {
      showToast({
        type: 'flash',
        title: '⚡ Flash Slot just dropped',
        body: 'Surf & Sweat — 5 spots, Camps Bay. 60 min to book.',
        actionLabel: 'Book now',
        action: () => {},
        duration: 8000,
      })
    }, 15000)
    return () => clearTimeout(timer)
  }, [])
}
