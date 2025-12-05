// app/study/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StudyPage() {
  const [hasStarted, setHasStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!hasStarted || secondsLeft === null) return;
    if (secondsLeft <= 0) {
      setDone(true);
      return;
    }

    const id = setTimeout(() => {
      setSecondsLeft((prev) => (prev !== null ? prev - 1 : prev));
    }, 1000);

    return () => clearTimeout(id);
  }, [hasStarted, secondsLeft]);

  const handleStart = () => {
    if (hasStarted) return;
    setHasStarted(true);
    setSecondsLeft(10);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
      <div className="max-w-md w-full px-6 py-8 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg">
        <h1 className="text-xl font-semibold tracking-tight text-center">
          Study Session
        </h1>
        <p className="mt-2 text-sm text-slate-400 text-center">
          Hit start and focus for 10 seconds. When the timer ends, you&apos;ll
          be able to check in.
        </p>

        {/* Start button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleStart}
            disabled={hasStarted}
            className="rounded-xl bg-emerald-500 text-slate-950 font-semibold px-5 py-2.5 text-sm
                       hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {hasStarted ? "Studying..." : "Start studying"}
          </button>
        </div>

        {/* Timer display */}
        {hasStarted && (
          <p className="mt-4 text-center text-sm text-slate-300">
            {done
              ? "Nice job! Your 10 seconds are up."
              : `Time left: ${secondsLeft}s`}
          </p>
        )}

        {/* Button to /check after done */}
        {done && (
          <div className="mt-6 flex justify-center">
            <Link
              href="/check"
              className="inline-flex items-center justify-center rounded-xl border border-emerald-500/60 text-emerald-300 px-4 py-2 text-sm hover:bg-emerald-500/10 transition"
            >
              Go to Check-In
            </Link>
          </div>
        )}

        {/* Back home */}
        <div className="mt-4 flex justify-center">
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-300 underline underline-offset-2"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
