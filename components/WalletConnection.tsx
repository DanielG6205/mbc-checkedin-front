// components/WalletConnection.tsx
"use client";

import { ReactNode, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";

import { RPC_ENDPOINT } from "@/lib/solana";
import "@solana/wallet-adapter-react-ui/styles.css";

type Props = {
  children: ReactNode;
};

// 🔥 Load WalletMultiButton only on the client
const WalletMultiButtonDynamic = dynamic(
  async () => {
    const mod = await import("@solana/wallet-adapter-react-ui");
    return mod.WalletMultiButton;
  },
  { ssr: false }
);

export default function WalletConnection({ children }: Props) {
  const network = WalletAdapterNetwork.Devnet; // just for clarity if you ever use it

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={RPC_ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div
            className="min-h-screen flex flex-col bg-slate-950 text-slate-50"
            suppressHydrationWarning
          >
            {/* Simple top nav */}
            <header className="w-full border-b border-slate-800 bg-slate-900/60 backdrop-blur">
              <div className="mx-auto max-w-3xl flex items-center justify-between px-4 py-3">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-emerald-400">
                    CheckedIn
                  </span>
                </div>
                {/* Button is now purely client-side */}
                <WalletMultiButtonDynamic className="!bg-emerald-500 !text-slate-950 hover:!bg-emerald-400" />
              </div>
            </header>

            <main className="flex-1 flex items-center justify-center px-4 py-8">
              {children}
            </main>

            <footer className="py-3 text-center text-xs text-slate-500">
              Built with Solana · Devnet only · Demo app
            </footer>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
