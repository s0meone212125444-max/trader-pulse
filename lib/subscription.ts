import { whopsdk } from './whop-sdk';

export async function checkProAccess(userId: string): Promise<boolean> {
  const PRO_PLAN_ID = process.env.PRO_PLAN_ID;
  if (!PRO_PLAN_ID || process.env.NODE_ENV === 'development') return true; 

  try {
    const response = await whopsdk.memberships.validateAccess({
      user_id: userId,
      plan_id: PRO_PLAN_ID,
    });
    return response.valid;
  } catch (error) {
    return false;
  }
}