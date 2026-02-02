import { whopsdk } from './whop-sdk';

/**
 * COMPLETELY REPAIRED: 
 * 1. Uses the correct SDK method (memberships.validateAccess)
 * 2. Uses Environment Variables (No more mocks)
 * 3. Handles Trial/Active status automatically
 */
export async function checkProAccess(userId: string): Promise<boolean> {
  // Use the ID from your .env file
  const PRO_PLAN_ID = process.env.PRO_PLAN_ID;

  if (!PRO_PLAN_ID || PRO_PLAN_ID === 'plan_mock_123') {
    console.warn("⚠️ PRO_PLAN_ID is missing or still set to mock. Check your .env file.");
    // In development, you might want to return true to see your UI, 
    // but for production, this MUST be false.
    return process.env.NODE_ENV === 'development';
  }

  try {
    // Correct SDK method call
    const response = await whopsdk.memberships.validateAccess({
      user_id: userId,
      plan_id: PRO_PLAN_ID,
    });

    // Whop returns an object. We check the 'valid' property.
    const hasAccess = response.valid;

    console.log(
      `[Subscription Check] User: ${userId} | Plan: ${PRO_PLAN_ID} | Access: ${hasAccess}`
    );

    return hasAccess;
  } catch (error) {
    // If the user hasn't bought anything, the SDK might throw an error or return valid: false.
    console.error(`[Subscription Error] User ${userId}:`, error);
    return false;
  }
}