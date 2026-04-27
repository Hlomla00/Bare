interface BookingCodeProps {
  code: string
  gymName: string
  slotTitle: string
  startTime: string
}

export function BookingCode({ code, gymName, slotTitle, startTime }: BookingCodeProps) {
  return (
    <div className="rounded-2xl bg-white p-6 flex flex-col items-center gap-4">
      {/* Faux QR grid */}
      <div className="w-48 h-48 relative">
        <QRGrid seed={code} />
      </div>

      <div className="text-center space-y-1">
        <p className="text-black font-mono font-bold text-lg tracking-widest">{code}</p>
        <p className="text-gray-600 text-sm font-medium">{gymName}</p>
        <p className="text-gray-500 text-xs">{slotTitle}</p>
        <p className="text-gray-500 text-xs">{startTime}</p>
      </div>
    </div>
  )
}

function QRGrid({ seed }: { seed: string }) {
  const size = 21
  const cells: boolean[][] = []

  // Deterministic "QR-like" grid from seed
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0
  }

  for (let r = 0; r < size; r++) {
    cells[r] = []
    for (let c = 0; c < size; c++) {
      const pos = r * size + c
      // Finder patterns (corners)
      const inFinder =
        (r < 7 && c < 7) ||
        (r < 7 && c >= size - 7) ||
        (r >= size - 7 && c < 7)
      if (inFinder) {
        const fr = r % 7
        const fc = c < 7 ? c % 7 : c - (size - 7)
        const rr = r >= size - 7 ? r - (size - 7) : r
        const ff = r >= size - 7 ? rr : fr
        const edge = ff === 0 || ff === 6 || fc === 0 || fc === 6
        const inner = ff >= 2 && ff <= 4 && fc >= 2 && fc <= 4
        cells[r][c] = edge || inner
      } else {
        cells[r][c] = ((hash ^ (pos * 2654435761)) & 1) === 1
      }
    }
  }

  const cell = 192 / size

  return (
    <svg viewBox={`0 0 192 192`} width="192" height="192">
      <rect width="192" height="192" fill="white" />
      {cells.flatMap((row, r) =>
        row.map((filled, c) =>
          filled ? (
            <rect
              key={`${r}-${c}`}
              x={c * cell}
              y={r * cell}
              width={cell}
              height={cell}
              fill="#0A0A0A"
            />
          ) : null
        )
      )}
    </svg>
  )
}
