// components/CheckInButton.tsx
"use client";

import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { sendCheckIn } from "@/lib/program";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

type Props = {
  onCheckedIn: () => Promise<void> | void;
};

export default function CheckInButton({ onCheckedIn }: Props) {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "success" | "already" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClick = async () => {
    if (!wallet.publicKey) {
      setStatus("error");
      setErrorMessage("Please connect your wallet first.");
      return;
    }

    setLoading(true);
    setStatus("idle");
    setErrorMessage(null);

    try {
      const sig = await sendCheckIn(connection, wallet);
      console.log("Check-in tx:", sig);
      setStatus("success");
      await onCheckedIn();
    } catch (err: any) {
      const msg = err?.toString?.() || "Unknown error";
      console.error("Check-in error:", err);

      // Anchor error code 6000 (0x1770) for AlreadyCheckedInToday
      if (msg.includes("0x1770") || msg.includes("You already checked in")) {
        setStatus("already");
        setErrorMessage("You already checked in today.");
      } else {
        setStatus("error");
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
      setTimeout(() => {
        setStatus("idle");
        setErrorMessage(null);
      }, 4000);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      <button
        onClick={handleClick}
        disabled={loading || !wallet.connected}
        className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all
          ${
            wallet.connected
              ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
              : "bg-slate-700 text-slate-400 cursor-not-allowed"
          }
          ${loading ? "opacity-70" : ""}
        `}
      >
        {loading
          ? "Sending transaction..."
          : wallet.connected
          ? "Check In Today"
          : "Connect Wallet to Check In"}
      </button>

      {/* Status messages */}
      <div className="h-10 flex items-center justify-center w-full">
        {status === "success" && (
          <div className="flex items-center gap-2 text-emerald-400 animate-bounce">
            <CheckCircleIcon className="h-5 w-5" />
            <span className="text-xs">Check-in successful! Streak updated.</span>
          </div>
        )}
        {status === "already" && (
          <div className="flex items-center gap-2 text-amber-400">
            <ExclamationTriangleIcon className="h-5 w-5" />
            <span className="text-xs">You already checked in today.</span>
          </div>
        )}
        {status === "error" && errorMessage && (
          <div className="flex items-center gap-2 text-rose-400">
            <XCircleIcon className="h-5 w-5" />
            <span className="text-xs">{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
