interface SuburbFilterProps {
  suburbs: string[]
  selected: string
  onChange: (suburb: string) => void
}

export function SuburbFilter({ suburbs, selected, onChange }: SuburbFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none px-4">
      {suburbs.map((suburb) => (
        <button
          key={suburb}
          onClick={() => onChange(suburb)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selected === suburb
              ? 'bg-[#CAFF00] text-black'
              : 'bg-[#1A1A1A] text-[#888] border border-[#242424]'
          }`}
        >
          {suburb}
        </button>
      ))}
    </div>
  )
}
