// lib/program.ts
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";

// Program + RPC from env
const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_ID ??
    "11111111111111111111111111111111" // will be overridden by env
);

export const RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_RPC_ENDPOINT ?? "https://api.devnet.solana.com";

// Anchor instruction discriminator for `global:check_in`
// SHA256("global:check_in").slice(0, 8)
const CHECK_IN_DISCRIMINATOR = Uint8Array.from([
  0xd1, 0xfd, 0x04, 0xd9, 0xfa, 0xf1, 0xcf, 0x32,
]);

// PDA helper
export function getUserStreakPda(user: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("user-streak"), user.toBuffer()],
    PROGRAM_ID
  );
  return pda;
}

// Types used by the UI
export type UserStreakData = {
  user: PublicKey;
  streakCount: number;
  lastCheckIn: number;
};

// Very small custom parser for the UserStreak account
// Layout: 8 (discriminator) + 32 (Pubkey) + 8 (u64) + 8 (i64)
function parseUserStreakAccount(data: Buffer): UserStreakData {
  // skip the 8-byte account discriminator
  let offset = 8;

  const user = new PublicKey(data.slice(offset, offset + 32));
  offset += 32;

  const streakBuf = data.slice(offset, offset + 8);
  offset += 8;

  const lastBuf = data.slice(offset, offset + 8);

  const streakCount = Number(streakBuf.readBigInt64LE(0)); // u64 fits in JS number for small values
  const lastCheckIn = Number(lastBuf.readBigInt64LE(0)); // i64

  return { user, streakCount, lastCheckIn };
}

// Fetch streak for a given wallet
export async function fetchUserStreak(
  connection: Connection,
  user: PublicKey
): Promise<UserStreakData | null> {
  const pda = getUserStreakPda(user);
  const info = await connection.getAccountInfo(pda);

  if (!info || !info.data) return null;

  return parseUserStreakAccount(info.data as Buffer);
}

// Send the check_in instruction
export async function sendCheckIn(
  connection: Connection,
  wallet: WalletContextState
): Promise<string> {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected");
  }
  if (!wallet.sendTransaction) {
    throw new Error("Wallet does not support sendTransaction");
  }

  const user = wallet.publicKey;
  const userStreakPda = getUserStreakPda(user);

  const ix = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: user, isSigner: true, isWritable: true },
      { pubkey: userStreakPda, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data: Buffer.from(CHECK_IN_DISCRIMINATOR),
  });

  const tx = new Transaction().add(ix);
  tx.feePayer = user;

  const latest = await connection.getLatestBlockhash("confirmed");
  tx.recentBlockhash = latest.blockhash;

  try {
    const signature = await wallet.sendTransaction(tx, connection);
    await connection.confirmTransaction(
      {
        signature,
        blockhash: latest.blockhash,
        lastValidBlockHeight: latest.lastValidBlockHeight,
      },
      "confirmed"
    );
    console.log("✅ Check-in tx signature:", signature);
    return signature;
  } catch (err) {
    console.error("❌ Wallet sendTransaction error:", err);
    throw err;
  }
}
