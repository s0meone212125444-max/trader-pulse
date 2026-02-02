'use client'

import { useState } from 'react'
import confetti from 'canvas-confetti'
import { submitVote } from '@/app/actions'

interface VotingInterfaceProps {
  companyId: string
  question: string
  optionA: string
  optionB: string
  userStatus: {
    hasVoted: boolean
    streak: number
    lastVoteOption: string | null
  }
  userId: string
  leaderboard: { user_id: string; streak: number }[]
}

export default function VotingInterface({
  companyId,
  question,
  optionA,
  optionB,
  userStatus,
  userId,
  leaderboard
}: VotingInterfaceProps) {
  const [hasVoted, setHasVoted] = useState(userStatus.hasVoted)
  const [selectedOption, setSelectedOption] = useState<string | null>(
    userStatus.lastVoteOption
  )
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async (option: string) => {
    if (hasVoted || isVoting) return
    setIsVoting(true)

    // Trigger Confetti
    const colors = option === optionA ? ['#10B981', '#34D399'] : ['#F43F5E', '#FB7185']
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
    })

    try {
      await submitVote(userId, option, companyId)
      setHasVoted(true)
      setSelectedOption(option)
    } catch (error) {
      console.error('Vote failed:', error)
      alert('Failed to submit vote. Please try again.')
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-slate-950 p-4'>
        {/* Ticker Header */}
      <div className='mb-12 text-center space-y-2'>
        <div className='inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 shadow-xl mb-4'>
            <span className='w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2'></span>
            <span className='text-xs font-mono text-slate-400 uppercase tracking-widest'>Live Market Sentiment</span>
        </div>
        <h1 className='text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500 tracking-tighter'>
          {question}
        </h1>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl'>
        {/* Option A - Emerald */}
        <button
          onClick={() => handleVote(optionA)}
          disabled={hasVoted || isVoting}
          className={`group relative h-64 md:h-80 rounded-3xl transition-all duration-500 transform hover:scale-105 active:scale-95 border border-white/5
            ${
              hasVoted && selectedOption !== optionA
                ? 'opacity-30 blur-sm brightness-50 grayscale'
                : 'opacity-100 hover:shadow-[0_0_50px_-12px_rgba(16,185,129,0.5)]'
            }
          `}
        >
            <div className='absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-emerald-900/20 rounded-3xl pointer-events-none' />
            <div className='absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl' />
            
            <div className='relative flex flex-col items-center justify-center h-full space-y-4'>
                <span className='text-6xl md:text-8xl filter drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]'>🚀</span>
                <span className='text-3xl md:text-4xl font-bold text-emerald-100 tracking-tight group-hover:text-emerald-50 transition-colors'>
                    {optionA}
                </span>
            </div>
            {/* Glossy overlay */}
            <div className='absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl pointer-events-none' />
        </button>

        {/* Option B - Rose */}
        <button
          onClick={() => handleVote(optionB)}
          disabled={hasVoted || isVoting}
          className={`group relative h-64 md:h-80 rounded-3xl transition-all duration-500 transform hover:scale-105 active:scale-95 border border-white/5
            ${
              hasVoted && selectedOption !== optionB
                ? 'opacity-30 blur-sm brightness-50 grayscale'
                : 'opacity-100 hover:shadow-[0_0_50px_-12px_rgba(244,63,94,0.5)]'
            }
          `}
        >
            <div className='absolute inset-0 bg-gradient-to-br from-rose-500/10 to-rose-900/20 rounded-3xl pointer-events-none' />
             <div className='absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl' />

            <div className='relative flex flex-col items-center justify-center h-full space-y-4'>
                <span className='text-6xl md:text-8xl filter drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]'>📉</span>
                <span className='text-3xl md:text-4xl font-bold text-rose-100 tracking-tight group-hover:text-rose-50 transition-colors'>
                    {optionB}
                </span>
            </div>
             {/* Glossy overlay */}
             <div className='absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl pointer-events-none' />
        </button>
      </div>

      {/* Stats / Streak Ticker */}
      <div className='mt-16 flex items-center space-x-8'>
        <div className='text-center'>
            <div className='text-slate-500 text-xs uppercase tracking-widest font-semibold mb-1'>Your Streak</div>
            <div className='text-3xl font-mono font-bold text-white flex items-center justify-center'>
                {userStatus.streak} <span className='text-amber-500 ml-2'>🔥</span>
            </div>
        </div>
      </div>
      
      {hasVoted && (
        <div className='mt-8 animate-fade-in text-slate-400 text-sm'>
            Thanks for voting! Come back tomorrow to keep your streak.
        </div>
      )}

      {/* Leaderboard Section */}
      <div className='mt-20 w-full max-w-2xl'>
        <h2 className='text-2xl font-bold text-white mb-6 text-center tracking-tight'>Top Streaks</h2>
        <div className='bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden'>
             {leaderboard.map((user, index) => {
                 let rankColor = 'bg-slate-800 text-slate-400'
                 if (index === 0) rankColor = 'bg-amber-500 text-amber-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                 if (index === 1) rankColor = 'bg-slate-300 text-slate-900 shadow-[0_0_15px_rgba(203,213,225,0.5)]'
                 if (index === 2) rankColor = 'bg-amber-700 text-amber-100 shadow-[0_0_15px_rgba(180,83,9,0.5)]'

                 return (
                    <div key={user.user_id} className='flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors'>
                        <div className='flex items-center space-x-4'>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${rankColor}`}>
                                {index + 1}
                            </div>
                            <div className='font-mono text-slate-300 text-sm'>
                                {user.user_id.slice(0, 8)}...
                            </div>
                        </div>
                        <div className='font-mono font-bold text-white'>
                            {user.streak} 🔥
                        </div>
                    </div>
                 )
             })}
             {leaderboard.length === 0 && (
                 <div className='p-8 text-center text-slate-500 text-sm'>
                     No streaks yet. Start voting!
                 </div>
             )}
        </div>
      </div>
    </div>
  )
}
