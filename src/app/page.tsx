import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-lg tracking-tight">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-bold">
              CF
            </span>
            CloseFlow
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 mb-4">
              AI Revenue Recovery
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Turn missed opportunities into revenue
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              CloseFlow finds the leads, quotes, and inactive customers your
              business is already losing — then helps you recover that revenue
              with AI-powered follow-ups you control.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700 transition"
              >
                Start 14-day free trial
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                See how it works
              </Link>
            </div>
          </div>

          {/* Money metrics preview */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Revenue at risk", value: "$12,450", sub: "Inactive opportunities" },
              { label: "Unanswered leads", value: "17", sub: "Need follow-up" },
              { label: "Unclosed quotes", value: "$4,820", sub: "8 quotes pending" },
              { label: "Recovered this month", value: "$2,840", sub: "Verified recovery" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{item.value}</p>
                <p className="mt-1 text-xs text-slate-400">{item.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-t border-slate-200 bg-white py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-10">
              Built for local service businesses
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Import your data",
                  desc: "Connect customers, leads, and quotes via CSV or future integrations. CloseFlow analyzes everything.",
                },
                {
                  title: "See money at risk",
                  desc: "Instantly surface stale quotes, unanswered leads, and customers who haven't returned.",
                },
                {
                  title: "Recover with AI",
                  desc: "AI drafts personalized follow-ups. You approve. CloseFlow tracks what revenue comes back.",
                },
              ].map((step) => (
                <div key={step.title}>
                  <h3 className="font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} CloseFlow by CBDEVS. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
