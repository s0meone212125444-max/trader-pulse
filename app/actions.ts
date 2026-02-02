'use server'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 1. GET THE POLL QUESTION (Required for build)
export async function getDailyConfig(companyId: string) {
  const { data } = await supabase
    .from('daily_config')
    .select('*')
    .eq('company_id', companyId)
    .single()
  
  return data || { 
    question_text: "What's the market vibe today?", 
    option_a_label: "Bullish 🚀", 
    option_b_label: "Bearish 🐻" 
  }
}

// 2. GET USER STATUS (Required for build)
export async function getUserStatus(userId: string) {
  const today = new Date().toISOString().split('T')[0]
  
  const { data: vote } = await supabase
    .from('votes')
    .select('*')
    .eq('whop_user_id', userId)
    .gte('created_at', today)
    .single()

  const { data: stats } = await supabase
    .from('user_stats')
    .select('current_streak')
    .eq('whop_user_id', userId)
    .single()

  return {
    hasVoted: !!vote,
    streak: stats?.current_streak || 0,
    lastVoteOption: vote?.sentiment || null
  }
}

// 3. GET LEADERBOARD (Required for build)
export async function getLeaderboard() {
  const { data } = await supabase
    .from('user_stats')
    .select('whop_user_id, current_streak')
    .order('current_streak', { ascending: false })
    .limit(5)
  
  return data || []
}

// 4. SUBMIT THE VOTE
export async function submitVote(userId: string, companyId: string, sentiment: 'bullish' | 'bearish') {
  // Save the vote
  await supabase.from('votes').insert({ 
    whop_user_id: userId, 
    company_id: companyId, 
    sentiment 
  })

  // Update/Insert Streak
  const { data: stats } = await supabase.from('user_stats').select('*').eq('whop_user_id', userId).single()
  
  if (stats) {
    await supabase.from('user_stats').update({ 
      current_streak: (stats.current_streak || 0) + 1 
    }).eq('whop_user_id', userId)
  } else {
    await supabase.from('user_stats').insert({ 
      whop_user_id: userId, 
      company_id: companyId, 
      current_streak: 1 
    })
  }

  revalidatePath('/')
}