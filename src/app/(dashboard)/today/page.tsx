import Link from 'next/link';
import {
  MOCK_METRICS,
  MOCK_OPPORTUNITIES,
  formatCurrency,
  getCustomerName,
  daysSince,
} from '@/data/mock';

export default function TodayPage() {
  const topOpps = [...MOCK_OPPORTUNITIES]
    .filter((o) => o.status === 'open')
    .sort((a, b) => b.recovery_score - a.recovery_score)
    .slice(0, 5);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          {greeting}.
        </h1>
        <p className="mt-1 text-slate-600">
          You have{' '}
          <span className="font-semibold text-slate-900">
            {MOCK_METRICS.opportunities_open} opportunities
          </span>{' '}
          worth{' '}
          <span className="font-semibold text-slate-900">
            {formatCurrency(MOCK_METRICS.revenue_at_risk)}
          </span>{' '}
          that deserve attention today.
        </p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Revenue at risk"
          value={formatCurrency(MOCK_METRICS.revenue_at_risk)}
          sub="Open opportunities"
          accent="amber"
        />
        <MetricCard
          label="Highest priority"
          value={formatCurrency(topOpps[0]?.estimated_value ?? 0)}
          sub={topOpps[0]?.title.split('—')[0]?.trim() ?? '—'}
          accent="indigo"
        />
        <MetricCard
          label="Need attention"
          value={String(MOCK_METRICS.opportunities_open)}
          sub="Customers / leads"
          accent="slate"
        />
        <MetricCard
          label="Recovered this month"
          value={formatCurrency(MOCK_METRICS.revenue_recovered)}
          sub="Verified recovery"
          accent="emerald"
        />
      </div>

      {/* Top actions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Your top actions</h2>
          <Link
            href="/opportunities"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            View all →
          </Link>
        </div>

        <div className="space-y-3">
          {topOpps.map((opp, i) => (
            <div
              key={opp.id}
              className="rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-300 transition shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 truncate">
                      {opp.type === 'new_lead'
                        ? 'Respond to new lead'
                        : opp.type === 'reactivation'
                          ? 'Reactivate customer'
                          : 'Follow up on quote'}
                    </p>
                    <p className="text-sm text-slate-600 mt-0.5">
                      {opp.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {opp.reason}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-sm font-semibold text-slate-900">
                    {formatCurrency(opp.estimated_value)}
                  </span>
                  <ScoreBadge score={opp.recovery_score} />
                  <Link
                    href={`/opportunities`}
                    className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 transition"
                  >
                    Review
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick stats row */}
      <section className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Unclosed quotes</p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {MOCK_METRICS.unclosed_quotes_count}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {formatCurrency(MOCK_METRICS.unclosed_quotes_value)} potential
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">New leads</p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {MOCK_METRICS.leads_needing_attention}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Need response</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Reactivation candidates</p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {MOCK_METRICS.reactivation_candidates}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">90+ days inactive</p>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent: 'amber' | 'indigo' | 'slate' | 'emerald';
}) {
  const colors = {
    amber: 'border-amber-200 bg-amber-50/50',
    indigo: 'border-indigo-200 bg-indigo-50/50',
    slate: 'border-slate-200 bg-white',
    emerald: 'border-emerald-200 bg-emerald-50/50',
  };
  return (
    <div className={`rounded-xl border p-4 ${colors[accent]}`}>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-slate-900 tracking-tight">
        {value}
      </p>
      <p className="mt-0.5 text-xs text-slate-400">{sub}</p>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 85
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : score >= 70
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-slate-50 text-slate-600 border-slate-200';
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${color}`}
    >
      Score {score}
    </span>
  );
}
