import { useState, useEffect } from 'react'
import type { Friend } from '../types'
import { MOCK_FRIENDS } from '../data/mockData'

export function useActiveDots() {
  const [friends, setFriends] = useState<Friend[]>(MOCK_FRIENDS)
  const [liveCount, setLiveCount] = useState(124)

  // Simulate real-time live count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount((c) => {
        const delta = Math.floor(Math.random() * 5) - 2
        return Math.max(80, Math.min(200, c + delta))
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const live = friends.filter((f) => f.dot_status === 'live')
  const doneToday = friends.filter((f) => f.dot_status === 'done_today')
  const notYet = friends.filter((f) => f.dot_status === 'not_yet')

  return { friends, live, doneToday, notYet, liveCount, setFriends }
}
