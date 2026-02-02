  /* biome-ignore lint/nursery/useSortedClasses: <explanation> */
import { getDailyConfig, getLeaderboard, getUserStatus } from './actions'
import VotingInterface from './components/VotingInterface'

export default async function VotingPage() {
  const companyId = 'demo-company' // Public voting for the demo company
  // Mock User ID for public voting demo (In a real app, this would be auth'd or IP-based)
  // For the purpose of this visual overhaul, we'll assume a consistent user to show the streak.
  const userId = 'mock-user-123' 

  const config = await getDailyConfig(companyId)
  const userStatus = await getUserStatus(userId)
  const leaderboard = await getLeaderboard(companyId)

  return (
    <VotingInterface
      companyId={companyId}
      question={config.question}
      optionA={config.option_a}
      optionB={config.option_b}
      userStatus={userStatus}
      userId={userId}
      leaderboard={leaderboard}
    />
  )
}
