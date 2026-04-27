import type { DotStatus } from '../types'

interface ActiveDotProps {
  status: DotStatus
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'h-2.5 w-2.5',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
}

export function ActiveDot({ status, size = 'md' }: ActiveDotProps) {
  const sz = sizeMap[size]

  if (status === 'live') {
    return (
      <span className="relative flex shrink-0" style={{ width: sizeMap[size].split(' ')[1].replace('w-', '') === '3.5' ? '14px' : size === 'sm' ? '10px' : '16px', height: sizeMap[size].split(' ')[0].replace('h-', '') === '3.5' ? '14px' : size === 'sm' ? '10px' : '16px' }}>
        <span
          className={`animate-ping absolute inline-flex ${sz} rounded-full bg-red-500 opacity-75`}
        />
        <span className={`relative inline-flex ${sz} rounded-full bg-red-500`} />
      </span>
    )
  }

  if (status === 'done_today') {
    return <span className={`shrink-0 ${sz} rounded-full bg-[#00FF6A]`} />
  }

  return <span className={`shrink-0 ${sz} rounded-full bg-[#3A3A3A]`} />
}

interface ActiveDotLabelProps {
  status: DotStatus
}

export function ActiveDotLabel({ status }: ActiveDotLabelProps) {
  if (status === 'live') return <span className="text-red-400 text-xs font-semibold tracking-wide">LIVE NOW</span>
  if (status === 'done_today') return <span className="text-[#00FF6A] text-xs font-semibold">Done today</span>
  return <span className="text-[#555] text-xs">Not yet</span>
}
