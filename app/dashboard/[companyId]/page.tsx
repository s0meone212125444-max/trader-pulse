import { whopsdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { checkProAccess } from "@/lib/subscription";

export default async function DashboardPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  
  let userId = "user_dev_123";
  if (process.env.NODE_ENV !== 'development') {
    try {
      const { userId: id } = await whopsdk.verifyUserToken(await headers());
      userId = id;
    } catch (e) {}
  }

  const isPro = await checkProAccess(userId);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-black text-white italic">TRADER PULSE DASHBOARD</h1>
          <p className="text-slate-500 mt-2">Monitoring community engagement for {companyId}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl">
            <p className="text-slate-500 text-sm uppercase font-bold tracking-widest">Total Votes</p>
            <p className="text-4xl font-black mt-2">1,284</p>
          </div>
          <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl">
            <p className="text-slate-500 text-sm uppercase font-bold tracking-widest">Global Sentiment</p>
            <p className="text-4xl font-black mt-2 text-emerald-500">68% BULL</p>
          </div>
        </div>

        {/* PRO GATE */}
        {!isPro ? (
          <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-amber-500/5 p-12 text-center backdrop-blur-xl">
             <span className="text-4xl mb-4 block">🔒</span>
             <h3 className="text-xl font-bold text-white">Unlock Custom Polls</h3>
             <p className="text-slate-400 mt-2 mb-6">Change your question and branding with Pro.</p>
             <a href={process.env.NEXT_PUBLIC_WHOP_CHECKOUT_URL} className="inline-block bg-white text-black font-black px-8 py-3 rounded-full hover:bg-slate-200 transition-colors">
               UPGRADE NOW (3-DAY FREE TRIAL)
             </a>
          </div>
        ) : (
          <div className="bg-slate-900 border border-emerald-500/20 p-8 rounded-3xl">
            <h3 className="text-white font-bold mb-4 text-xl">Custom Poll Configuration</h3>
            <input className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-white mb-4" placeholder="Enter your question..." />
            <button className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl">SAVE SETTINGS</button>
          </div>
        )}
      </div>
    </div>
  );
}