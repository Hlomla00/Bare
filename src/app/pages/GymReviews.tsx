import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, Send } from 'lucide-react'
import { MOCK_GYMS, MOCK_REVIEWS } from '../../data/mockData'
import { format } from 'date-fns'

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} onClick={() => onChange?.(n)} type="button">
          <Star className={`w-6 h-6 transition-all ${n <= value ? 'text-[#CAFF00]' : 'text-[#2A2A2A]'}`} fill={n <= value ? '#CAFF00' : 'none'} />
        </button>
      ))}
    </div>
  )
}

function RatingBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="flex items-center gap-2">
      <span className="text-[#555] text-xs w-4">{label}</span>
      <div className="flex-1 h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
        <div className="h-full bg-[#CAFF00] rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[#555] text-xs w-4">{count}</span>
    </div>
  )
}

export function GymReviews() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const gym = MOCK_GYMS.find(g => g.id === id)
  const reviews = MOCK_REVIEWS.filter(r => r.gym_id === id)

  const [showForm, setShowForm] = useState(false)
  const [myRating, setMyRating] = useState(5)
  const [myReview, setMyReview] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1000))
    setSubmitting(false)
    setSubmitted(true)
    setShowForm(false)
  }

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0
  const dist = [5, 4, 3, 2, 1].map(n => ({ star: n, count: reviews.filter(r => r.rating === n).length }))

  if (!gym) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center"><p className="text-[#555]">Gym not found</p></div>

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24">
      <div className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-[#1E1E1E]/50 pt-safe">
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-[#111] border border-[#1E1E1E]">
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <h1 className="text-white font-black text-lg flex-1">{gym.name}</h1>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-5">
        {/* Summary card */}
        <div className="p-5 rounded-2xl bg-[#111] border border-[#1E1E1E]">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-[#CAFF00] font-black text-5xl">{avg.toFixed(1)}</p>
              <StarRating value={Math.round(avg)} />
              <p className="text-[#555] text-xs mt-1">{reviews.length} reviews</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {dist.map(d => <RatingBar key={d.star} label={String(d.star)} count={d.count} total={reviews.length} />)}
            </div>
          </div>
        </div>

        {/* Write review button */}
        {!submitted ? (
          <button onClick={() => setShowForm(true)} className="w-full py-3.5 rounded-2xl bg-[#CAFF00]/10 border border-[#CAFF00]/30 text-[#CAFF00] font-bold text-sm flex items-center justify-center gap-2">
            <Star className="w-4 h-4" />
            Write a Review
          </button>
        ) : (
          <div className="w-full py-3.5 rounded-2xl bg-[#00FF6A]/10 border border-[#00FF6A]/30 text-[#00FF6A] font-bold text-sm flex items-center justify-center gap-2">
            ✓ Review submitted — thanks!
          </div>
        )}

        {/* Reviews list */}
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r.id} className="p-4 rounded-2xl bg-[#111] border border-[#1E1E1E]">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#CAFF00]/30 to-[#CAFF00]/10 flex items-center justify-center text-[#CAFF00] font-bold text-sm">
                    {r.user_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{r.user_name}</p>
                    <p className="text-[#555] text-xs">{format(new Date(r.created_at), 'dd MMM yyyy')}</p>
                  </div>
                </div>
                <StarRating value={r.rating} />
              </div>
              <p className="text-[#888] text-sm leading-relaxed">{r.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Write review sheet */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
          <div className="w-full bg-[#111] rounded-t-3xl border-t border-[#1E1E1E] p-6">
            <h3 className="text-white font-black text-lg mb-1">Rate {gym.name}</h3>
            <p className="text-[#555] text-sm mb-5">Share your experience with the community</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2">Your rating</p>
                <StarRating value={myRating} onChange={setMyRating} />
              </div>
              <div>
                <p className="text-[#888] text-xs font-semibold uppercase tracking-wider mb-2">Your review</p>
                <textarea value={myReview} onChange={e => setMyReview(e.target.value)} rows={4} placeholder="What did you love? What could be better?"
                  className="w-full bg-[#0A0A0A] border border-[#242424] rounded-2xl px-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#CAFF00]/50 resize-none" />
              </div>
              <button type="submit" disabled={!myReview || submitting}
                className="w-full bg-[#CAFF00] text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-sm disabled:opacity-40">
                <Send className="w-4 h-4" />
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="w-full text-[#555] text-sm py-2">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
