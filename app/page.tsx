// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl px-10 py-12 rounded-3xl border border-slate-800 bg-slate-900/60 shadow-2xl">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-center">
          CheckedIn
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-400 text-center">
          Track your focused study sessions with a simple, fast check-in flow.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href="/study"
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 font-semibold px-7 py-3 text-sm sm:text-base hover:bg-emerald-400 transition"
          >
            Start Studying
          </Link>
        </div>
      </div>
    </main>
  );
}
