import { whopsdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";

export default async function ExperiencePage({ params }: { params: Promise<{ experienceId: string }> }) {
  const { experienceId } = await params;
  
  let userId = "user_dev_123";
  if (process.env.NODE_ENV !== 'development') {
    try {
      const { userId: id } = await whopsdk.verifyUserToken(await headers());
      userId = id;
    } catch (e) {}
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
        <h2 className="text-2xl font-black text-center mb-8 tracking-tight">COMMUNITY SENTIMENT</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <button className="group relative overflow-hidden rounded-2xl bg-emerald-500 p-6 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <span className="relative z-10 text-4xl mb-2 block">🚀</span>
            <span className="relative z-10 font-bold uppercase tracking-wider">Bullish</span>
          </button>
          
          <button className="group relative overflow-hidden rounded-2xl bg-rose-500 p-6 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
            <span className="relative z-10 text-4xl mb-2 block">🐻</span>
            <span className="relative z-10 font-bold uppercase tracking-wider">Bearish</span>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-slate-400">
          <span className="text-sm font-medium">Daily Streak</span>
          <span className="text-lg font-bold text-emerald-400">🔥 1 Day</span>
        </div>
      </div>
    </main>
  );
}