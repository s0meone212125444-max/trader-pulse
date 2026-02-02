'use server'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function submitVote(userId: string, companyId: string, sentiment: 'bullish' | 'bearish') {
  // 1. Save the vote
  await supabase.from('votes').insert({ 
    whop_user_id: userId, 
    company_id: companyId, 
    sentiment 
  })

  // 2. Update Streak (Simplified for now)
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