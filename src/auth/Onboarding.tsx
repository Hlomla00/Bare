import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Zap } from 'lucide-react'

const GOALS = ['Build Strength', 'Lose Weight', 'Improve Cardio', 'Flexibility & Mobility', 'Stress Relief', 'Just Explore']
const CLASS_TYPES = ['HIIT', 'Strength', 'Yoga', 'Pilates', 'CrossFit', 'Boxing', 'Spin', 'Functional']
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const PLANS = [
  { tier: 'starter', name: 'Starter', price: 299, visits: 5, color: '#888', desc: 'Perfect to try it out' },
  { tier: 'explorer', name: 'Explorer', price: 549, visits: 10, color: '#CAFF00', desc: 'Most popular', popular: true },
  { tier: 'active', name: 'Active', price: 799, visits: 16, color: '#CAFF00', desc: 'Serious training' },
  { tier: 'daily', name: 'Daily', price: 1399, visits: 26, color: '#FF3547', desc: 'Unlimited lifestyle' },
]

export function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [goals, setGoals] = useState<string[]>([])
  const [classes, setClasses] = useState<string[]>([])
  const [days, setDays] = useState<string[]>([])
  const [plan, setPlan] = useState('explorer')

  const toggleItem = (list: string[], setList: (v: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item])
  }

  const steps = [
    {
      title: "What brings you to Bare?",
      subtitle: "Select all that apply",
      content: (
        <div className="grid grid-cols-2 gap-3">
          {GOALS.map(g => (
            <button key={g} onClick={() => toggleItem(goals, setGoals, g)}
              className={`p-4 rounded-2xl border text-left text-sm font-medium transition-all ${goals.includes(g) ? 'bg-[#CAFF00]/10 border-[#CAFF00]/50 text-[#CAFF00]' : 'bg-[#111] border-[#242424] text-[#888]'}`}>
              {g}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "Favourite class types?",
      subtitle: "We'll surface these first",
      content: (
        <div className="grid grid-cols-2 gap-3">
          {CLASS_TYPES.map(c => (
            <button key={c} onClick={() => toggleItem(classes, setClasses, c)}
              className={`p-4 rounded-2xl border text-left text-sm font-medium transition-all ${classes.includes(c) ? 'bg-[#CAFF00]/10 border-[#CAFF00]/50 text-[#CAFF00]' : 'bg-[#111] border-[#242424] text-[#888]'}`}>
              {c}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "When do you usually train?",
      subtitle: "Pick your typical days",
      content: (
        <div className="grid grid-cols-4 gap-3">
          {DAYS.map(d => (
            <button key={d} onClick={() => toggleItem(days, setDays, d)}
              className={`py-4 rounded-2xl border text-sm font-bold transition-all ${days.includes(d) ? 'bg-[#CAFF00] text-black border-[#CAFF00]' : 'bg-[#111] border-[#242424] text-[#888]'}`}>
              {d}
            </button>
          ))}
        </div>
      ),
    },
    {
      title: "Pick your plan",
      subtitle: "Change anytime. Cancel anytime.",
      content: (
        <div className="space-y-3">
          {PLANS.map(p => (
            <button key={p.tier} onClick={() => setPlan(p.tier)}
              className={`w-full p-4 rounded-2xl border text-left transition-all relative ${plan === p.tier ? 'bg-[#CAFF00]/10 border-[#CAFF00]/50' : 'bg-[#111] border-[#242424]'}`}>
              {p.popular && <span className="absolute -top-2 right-4 text-[10px] font-black bg-[#CAFF00] text-black px-2 py-0.5 rounded-full">MOST POPULAR</span>}
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-bold ${plan === p.tier ? 'text-[#CAFF00]' : 'text-white'}`}>{p.name}</p>
                  <p className="text-[#555] text-xs mt-0.5">{p.desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-black">R{p.price}<span className="text-[#555] text-xs font-normal">/mo</span></p>
                  <p className="text-[#555] text-xs">{p.visits} visits</p>
                </div>
              </div>
            </button>
          ))}
          <p className="text-center text-[#555] text-xs pt-2">First month 50% off with code <span className="text-[#CAFF00] font-bold">NEWMEMBER</span></p>
        </div>
      ),
    },
  ]

  const currentStep = steps[step]
  const isLast = step === steps.length - 1

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col px-6 pt-14 pb-10">
      {/* Progress */}
      <div className="flex gap-1 mb-8">
        {steps.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-[#CAFF00]' : 'bg-[#1E1E1E]'}`} />
        ))}
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-4 h-4 text-[#CAFF00]" fill="#CAFF00" />
          <p className="text-[#555] text-xs font-bold uppercase tracking-widest">Step {step + 1} of {steps.length}</p>
        </div>
        <h1 className="text-white font-black text-2xl">{currentStep.title}</h1>
        <p className="text-[#555] text-sm mt-1">{currentStep.subtitle}</p>
      </div>

      <div className="flex-1">
        {currentStep.content}
      </div>

      <button
        onClick={() => isLast ? navigate('/app') : setStep(s => s + 1)}
        className="w-full bg-[#CAFF00] text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-sm mt-8"
      >
        {isLast ? "Let's go →" : <><span>Continue</span><ArrowRight className="w-4 h-4" /></>}
      </button>

      {!isLast && (
        <button onClick={() => setStep(s => s + 1)} className="w-full text-center text-[#555] text-sm py-3 mt-2">
          Skip for now
        </button>
      )}
    </div>
  )
}
