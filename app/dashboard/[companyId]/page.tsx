import { Button } from '@whop/react/components'
import { headers } from 'next/headers'
import Link from 'next/link'
import { whopsdk } from '@/lib/whop-sdk'
import { getDailyConfig, getAdminStats } from '../../actions'
import AdminForm from '../../components/AdminForm'
import PremiumFeature from '../../components/PremiumFeature'
import { checkProAccess } from '@/lib/subscription'

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ companyId: string }>
}) {
  const { companyId } = await params
  
  let userId = 'user_dev_123'
  if (process.env.NODE_ENV !== 'development') {
    const payload = await whopsdk.verifyUserToken(await headers())
    userId = payload.userId
  }
  
  const [config, stats, isPro] = await Promise.all([
    getDailyConfig(companyId),
    getAdminStats(companyId),
    checkProAccess(userId)
  ])

  const checkoutUrl = process.env.NEXT_PUBLIC_WHOP_CHECKOUT_URL || '#'

  return (
    <div className='min-h-screen bg-slate-950 text-slate-50'>
      {/* Dismissible Banner - Only show if NOT Pro */}
      {!isPro && (
        <div className='bg-indigo-600/20 backdrop-blur-md border-b border-indigo-500/20 px-4 py-3'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <span className='flex rounded-lg bg-indigo-500/20 p-2 text-indigo-300'>
                <svg
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </span>
              <p className='text-sm font-medium text-indigo-100'>
                <span className='md:hidden'>3 Days left on trial.</span>
                <span className='hidden md:inline'>
                  3 Days Remaining on Trial. Upgrade to keep streaks alive.
                </span>
              </p>
            </div>
            <div>
              <a
                href={checkoutUrl}
                className='flex items-center justify-center rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20'
              >
                Upgrade Now
              </a>
            </div>
          </div>
        </div>
      )}

      <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12'>
        <div className='flex justify-between items-end border-b border-slate-800 pb-6'>
          <div>
            <h1 className='text-4xl font-bold text-white tracking-tight mb-2'>
              Admin Dashboard
            </h1>
            <p className='text-slate-400'>Manage your community sentiment poll.</p>
          </div>
          <Link href="https://docs.whop.com/apps" target="_blank">
             <Button variant="classic" size="3">Docs</Button>
          </Link>
        </div>

        {/* Section A: Always Visible Stats */}
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-2'>
          <div className='relative overflow-hidden rounded-2xl bg-slate-900/50 border border-slate-800 p-8 hover:border-slate-700 transition-colors group'>
            <div className='absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
            <dt className='truncate text-sm font-medium text-slate-400 uppercase tracking-widest mb-1'>
                Votes Today
            </dt>
            <dd className='text-5xl font-mono font-bold text-white tracking-tighter'>
                {stats.totalVotesToday}
            </dd>
          </div>
          
          <div className='relative overflow-hidden rounded-2xl bg-slate-900/50 border border-slate-800 p-8 hover:border-slate-700 transition-colors group'>
            <div className='absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
            <dt className='truncate text-sm font-medium text-slate-400 uppercase tracking-widest mb-1'>
                Top Streak
            </dt>
            <dd className='text-5xl font-mono font-bold text-white tracking-tighter'>
                {stats.highestStreak} <span className='text-3xl text-amber-500'>🔥</span>
            </dd>
          </div>
        </div>

        {/* Section B: Locked Poll Configuration */}
        <div className='rounded-3xl border border-slate-800 bg-slate-900/30 overflow-hidden'>
          <div className='border-b border-slate-800 px-8 py-6 bg-slate-900/50'>
            <h3 className='text-xl font-bold text-white'>
              Poll Configuration
            </h3>
            <p className='mt-1 text-sm text-slate-400'>
              Customize the daily question and options.
            </p>
          </div>
          <div className='p-8'>
            <PremiumFeature
              hasAccess={isPro}
              checkoutUrl={checkoutUrl}
              title='Custom Questions & Branding'
            >
              <div className='bg-slate-950 rounded-xl p-6 border border-slate-800'>
                 <AdminForm
                    companyId={companyId}
                    initialQuestion={config.question}
                    initialOptionA={config.option_a}
                    initialOptionB={config.option_b}
                />
              </div>
            </PremiumFeature>
          </div>
        </div>
      </div>
    </div>
  )
}
