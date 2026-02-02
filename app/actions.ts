'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseClient } from '@/lib/supabase'

export async function getDailyConfig(companyId: string) {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('daily_config')
    .select('*')
    .eq('company_id', companyId)
    .single()

  if (error || !data) {
    return {
      company_id: companyId,
      question: 'How is the market?',
      option_a: 'Bullish',
      option_b: 'Bearish',
    }
  }

  return data
}

export async function getUserStatus(userId: string) {
  const supabase = createSupabaseClient()
  // UTC start of day
  const todayStart = new Date().toISOString().split('T')[0]

  const { data: votes } = await supabase
    .from('votes')
    .select('vote_type, created_at')
    .eq('user_id', userId)
    .gte('created_at', `${todayStart}T00:00:00Z`)
    .lte('created_at', `${todayStart}T23:59:59Z`)

  const hasVoted = !!(votes && votes.length > 0)
  const lastVoteOption = hasVoted ? votes[0].vote_type : null

  const { data: stats } = await supabase
    .from('user_stats')
    .select('streak, last_vote_date')
    .eq('user_id', userId)
    .single()

  return {
    hasVoted,
    streak: stats?.streak || 0,
    lastVoteOption,
  }
}

export async function submitVote(userId: string, voteType: string, companyId: string) {
  const supabase = createSupabaseClient()
  const now = new Date()
  const todayStr = now.toISOString().split('T')[0]

  // Insert into votes
  const { error: voteError } = await supabase
    .from('votes')
    .insert({
      user_id: userId,
      company_id: companyId,
      vote_type: voteType,
    })

  if (voteError) {
    throw new Error(`Failed to submit vote: ${voteError.message}`)
  }

  // Handle Streak
  const { data: stats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single()

  let newStreak = 1

  if (stats && stats.last_vote_date) {
    const lastVoteDate = new Date(stats.last_vote_date)
    const lastVoteDateStr = lastVoteDate.toISOString().split('T')[0]

    // Calculate yesterday
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    if (lastVoteDateStr === yesterdayStr) {
      newStreak = stats.streak + 1
    } else if (lastVoteDateStr === todayStr) {
      // If already voted today, keep the same streak
      newStreak = stats.streak
    } else {
      // Reset streak if older than yesterday
      newStreak = 1
    }
  }

  // Update user_stats
  const { error: statsError } = await supabase.from('user_stats').upsert(
    {
      user_id: userId,
      company_id: companyId,
      streak: newStreak,
      last_vote_date: now.toISOString(),
    },
    { onConflict: 'user_id' }
  )

  if (statsError) {
    throw new Error(`Failed to update stats: ${statsError.message}`)
  }

  revalidatePath('/')
}

export async function updatePollConfig(
  companyId: string,
  question: string,
  labelA: string,
  labelB: string
) {
  const supabase = createSupabaseClient()

  const { error } = await supabase.from('daily_config').upsert(
    {
      company_id: companyId,
      question,
      option_a: labelA,
      option_b: labelB,
    },
    { onConflict: 'company_id' }
  )

  if (error) {
    throw new Error(`Failed to update config: ${error.message}`)
  }

  revalidatePath('/')
}

export async function getAdminStats(companyId: string) {
  const supabase = createSupabaseClient()
  const todayStart = new Date().toISOString().split('T')[0]

  // Total Votes Today
  const { count: totalVotesToday } = await supabase
    .from('votes')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', companyId)
    .gte('created_at', `${todayStart}T00:00:00Z`)
    .lte('created_at', `${todayStart}T23:59:59Z`)

  // Highest User Streak
  const { data: highestStreakUser } = await supabase
    .from('user_stats')
    .select('streak')
    .eq('company_id', companyId)
    .order('streak', { ascending: false })
    .limit(1)
    .single()

  return {
    highestStreak: highestStreakUser?.streak || 0,
  }
}

export async function getLeaderboard(companyId: string) {
  const supabase = createSupabaseClient()
  
  const { data } = await supabase
    .from('user_stats')
    .select('user_id, streak')
    .eq('company_id', companyId)
    .order('streak', { ascending: false })
    .limit(10)

  return data || []
}
