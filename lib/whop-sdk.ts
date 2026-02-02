import { Whop } from "@whop/sdk";

export const whopsdk = new Whop({
	appID: process.env.NEXT_PUBLIC_WHOP_APP_ID,
	apiKey: process.env.WHOP_API_KEY,
	webhookKey: btoa(process.env.WHOP_WEBHOOK_SECRET || ""),
});

export const validateWhopAccess = async (userId: string): Promise<boolean> => {
	try {
		// TODO: Replace 'YOUR_PLAN_ID_PLACEHOLDER' with the real Product ID from the Whop dashboard
		await whopsdk.hasAccess({
			user_id: userId,
			plan_id: "YOUR_PLAN_ID_PLACEHOLDER",
		});

		// TODO: Remove this mock return and return the actual result from hasAccess when ready
		return true;
	} catch (error) {
		console.error("Error validating Whop access:", error);
		return false;
	}
};
