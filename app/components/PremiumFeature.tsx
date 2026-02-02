'use client'

import React from 'react'
import { Lock } from 'lucide-react'

interface PremiumFeatureProps {
  hasAccess: boolean
  checkoutUrl: string
  children: React.ReactNode
  title: string
}

export default function PremiumFeature({
  hasAccess,
  checkoutUrl,
  children,
  title,
}: PremiumFeatureProps) {
  if (hasAccess) {
    return <>{children}</>
  }

  const handleUpgrade = () => {
    window.location.href = checkoutUrl
  }

  return (
    <div className='relative overflow-hidden rounded-xl'>
      {/* Blurred Content */}
      <div className='blur-md pointer-events-none select-none opacity-40 relative z-0 transition-all duration-500'>
        {children}
      </div>

      {/* Frosted Overlay */}
      <div className='absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-slate-900/10'>
        <div className='relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-amber-400/30 rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center max-w-sm w-full mx-4 ring-1 ring-amber-400/20'>
            
          {/* Gold Glow Effect */}
          <div className='absolute -top-24 -right-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none' />
          <div className='absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none' />

          <div className='bg-slate-800/50 p-4 rounded-full mb-6 ring-1 ring-white/10 shadow-inner'>
            <Lock className='w-8 h-8 text-indigo-400' />
          </div>
          
          <h3 className='text-2xl font-bold text-white mb-2 tracking-tight'>
            Unlock {title}
          </h3>
          
          <div className='inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-amber-200/10 to-yellow-500/10 border border-amber-500/20 text-amber-200 text-xs font-bold tracking-wider uppercase mb-6 shadow-[0_0_15px_rgba(245,158,11,0.2)]'>
            PRO Feature
          </div>

          <p className='text-slate-400 text-sm mb-8 leading-relaxed'>
            Upgrade to customize your community interaction and unlock full analytics.
          </p>

          <button
            onClick={handleUpgrade}
            className='group relative w-full overflow-hidden rounded-xl bg-indigo-600 p-[1px] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900'
          >
            <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#312E81_50%,#E2E8F0_100%)]' />
            <span className='inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white backdrop-blur-3xl transition-all group-hover:bg-slate-900'>
              Upgrade to Pro
              <span className='ml-2 text-indigo-300 group-hover:text-indigo-200'>(3-Day Trial)</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
