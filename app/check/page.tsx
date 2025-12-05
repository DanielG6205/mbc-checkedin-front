// app/check/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { fetchUserStreak } from "@/lib/program";
import CheckInButton from "@/components/CheckInButton";

function shortenAddress(addr: string, chars = 4) {
  return `${addr.slice(0, chars)}...${addr.slice(-chars)}`;
}

export default function HomePage() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();

  const [streak, setStreak] = useState<number | null>(null);
  const [lastCheckIn, setLastCheckIn] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const loadStreak = async () => {
    if (!publicKey) {
      setStreak(null);
      setLastCheckIn(null);
      return;
    }
    setLoading(true);
    try {
      const account = await fetchUserStreak(connection, publicKey);
      if (!account) {
        setStreak(0);
        setLastCheckIn(null);
      } else {
        setStreak(account.streakCount);
        setLastCheckIn(account.lastCheckIn);
      }
    } catch (err) {
      console.error("Failed to fetch user streak:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (connected && publicKey) {
      loadStreak();
    } else {
      setStreak(null);
      setLastCheckIn(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, publicKey?.toBase58()]);

  const lastCheckInText =
    lastCheckIn && lastCheckIn > 0
      ? new Date(lastCheckIn * 1000).toLocaleString()
      : "No check-ins yet";

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-emerald-500/10">
      <h1 className="text-xl font-semibold text-slate-50 mb-2">
        Daily Streak Tracker
      </h1>
      <p className="text-xs text-slate-400 mb-6">
        Check in once per calendar day to grow your on-chain habit streak.
      </p>

      <div className="space-y-4">
        {/* Wallet info */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs">
          <div className="flex justify-between mb-1 text-slate-400">
            <span>Wallet</span>
            <span className="font-mono text-[11px] text-slate-500">
              Devnet
            </span>
          </div>
          {publicKey ? (
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">
                {shortenAddress(publicKey.toBase58())}
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-400">
                Connected
              </span>
            </div>
          ) : (
            <div className="text-slate-500">
              Connect your wallet using the button above.
            </div>
          )}
        </div>

        {/* Streak info */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs text-slate-400">Current Streak</span>
            <span className="text-xs text-slate-500">
              {loading ? "Loading..." : "On-chain"}
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-semibold text-emerald-400">
                {streak ?? (connected ? 0 : "-")}
              </span>
              <span className="text-xs text-slate-400">days</span>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-500">
            Last check-in: {lastCheckInText}
          </div>
        </div>

        {/* Check-in button */}
        <CheckInButton onCheckedIn={loadStreak} />
      </div>
    </div>
  );
}
