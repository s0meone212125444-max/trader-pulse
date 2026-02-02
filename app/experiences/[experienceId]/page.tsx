'use client'
import { useState, use } from 'react'
import { submitVote } from '@/app/actions'
import confetti from 'canvas-confetti'

export default function ExperiencePage({ params }: { params: Promise<{ experienceId: string }> }) {
  const { experienceId } = use(params)
  const [voted, setVoted] = useState(false)
  const [loading, setLoading] = useState(false)

  // In local dev, we use a fake ID. In production, Whop handles this.
  const userId = "user_dev_123" 
  const companyId = "biz_dev_123"

  const handleVote = async (type: 'bullish' | 'bearish') => {
    setLoading(true)
    await submitVote(userId, companyId, type)
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
    setVoted(true)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-slate-900/50 border border-white/10 rounded-[2rem] p-8 backdrop-blur-2xl shadow-2xl">
        {!voted ? (
          <>
            <div className="text-center mb-10">
              <h2 className="text-sm font-black tracking-[0.2em] text-emerald-500 uppercase mb-2">Market Pulse</h2>
              <p className="text-2xl font-bold">What's the vibe today?</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <button 
                disabled={loading}
                onClick={() => handleVote('bullish')}
                className="group flex items-center justify-between rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-6 transition-all hover:bg-emerald-500 hover:text-white"
              >
                <span className="text-xl font-bold uppercase italic">Bullish</span>
                <span className="text-3xl group-hover:scale-125 transition-transform">🚀</span>
              </button>
              
              <button 
                disabled={loading}
                onClick={() => handleVote('bearish')}
                className="group flex items-center justify-between rounded-2xl bg-rose-500/10 border border-rose-500/20 p-6 transition-all hover:bg-rose-500 hover:text-white"
              >
                <span className="text-xl font-bold uppercase italic">Bearish</span>
                <span className="text-3xl group-hover:scale-125 transition-transform">🐻</span>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🔥</span>
            </div>
            <h2 className="text-3xl font-black mb-2">VOTE CAST!</h2>
            <p className="text-slate-400 mb-8 text-lg">Your 1-day streak has begun.</p>
            
            <div className="space-y-4">
               <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[70%]" />
               </div>
               <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Community: 70% Bullish</p>
            </div>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-white/5 flex justify-center">
          <span className="text-[10px] font-black tracking-widest text-slate-600 uppercase">Powered by TraderPulse Pro</span>
        </div>
      </div>
    </main>
  )
}