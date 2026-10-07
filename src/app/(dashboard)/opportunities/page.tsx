'use client';

import { useState } from 'react';
import {
  MOCK_OPPORTUNITIES,
  formatCurrency,
  getCustomerName,
  daysSince,
} from '@/data/mock';
import type { Opportunity } from '@/types/database';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'quote_followup', label: 'Quote pending' },
  { id: 'new_lead', label: 'New leads' },
  { id: 'reactivation', label: 'Reactivation' },
  { id: 'high_score', label: 'High score' },
];

export default function OpportunitiesPage() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<Opportunity | null>(null);

  const filtered = MOCK_OPPORTUNITIES.filter((o) => {
    if (o.status !== 'open') return false;
    if (filter === 'all') return true;
    if (filter === 'high_score') return o.recovery_score >= 85;
    return o.type === filter;
  }).sort((a, b) => b.recovery_score - a.recovery_score);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Opportunities
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {filtered.length} open · sorted by recovery score
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              filter === f.id
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-3 space-y-2">
          {filtered.map((opp) => (
            <button
              key={opp.id}
              onClick={() => setSelected(opp)}
              className={`w-full text-left rounded-xl border p-4 transition ${
                selected?.id === opp.id
                  ? 'border-indigo-300 bg-indigo-50/40 ring-1 ring-indigo-200'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 truncate">{opp.title}</p>
                  <p className="text-xs text-slate-500 mt-1 capitalize">
                    {opp.type.replace('_', ' ')}
                    {opp.last_activity_at &&
                      ` · ${daysSince(opp.last_activity_at)}d ago`}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-slate-900">
                    {formatCurrency(opp.estimated_value)}
                  </p>
                  <ScoreBadge score={opp.recovery_score} />
                </div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500 text-sm">
              No opportunities match this filter.
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2">
          {selected ? (
            <OpportunityDetail
              opp={selected}
              onClose={() => setSelected(null)}
            />
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-400 text-sm sticky top-6">
              Select an opportunity to review and act.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OpportunityDetail({
  opp,
  onClose,
}: {
  opp: Opportunity;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(generateDraft(opp));
  const [sent, setSent] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm sticky top-6">
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              {opp.type.replace('_', ' ')}
            </p>
            <h2 className="mt-1 font-semibold text-slate-900 leading-snug">
              {getCustomerName(opp.customer_id) !== 'Unknown'
                ? getCustomerName(opp.customer_id)
                : opp.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg leading-none"
          >
            ×
          </button>
        </div>
        <p className="mt-2 text-2xl font-bold text-slate-900">
          {formatCurrency(opp.estimated_value)}
        </p>
        <div className="mt-2">
          <ScoreBadge score={opp.recovery_score} large />
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Why this opportunity
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">{opp.reason}</p>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Recommended action
          </p>
          <p className="text-sm font-medium text-slate-900 mb-2">
            {opp.type === 'new_lead'
              ? 'Send a quick response'
              : opp.type === 'reactivation'
                ? 'Send reactivation message'
                : 'Send follow-up on quote'}
          </p>

          {!sent ? (
            <>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={5}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setSent(true)}
                  className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
                >
                  Approve & Send
                </button>
                <button
                  onClick={() => setDraft(generateDraft(opp))}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  Regenerate
                </button>
              </div>
            </>
          ) : (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-3 text-sm text-emerald-800">
              Message approved and queued for send (demo). In production this
              would go through your email provider after confirmation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function generateDraft(opp: Opportunity): string {
  const name = getCustomerName(opp.customer_id);
  const first = name !== 'Unknown' ? name.split(' ')[0] : 'there';

  if (opp.type === 'new_lead') {
    return `Hi ${first},\n\nThanks for reaching out about our services. I'd be happy to help and can get you scheduled this week.\n\nDo you have any questions, or would you like me to hold a time for you?\n\nBest regards`;
  }
  if (opp.type === 'reactivation') {
    return `Hey ${first}, it's been a while since we last worked together.\n\nIf you're looking to get your vehicle looking sharp again, we have availability this week. Happy to put together a quick estimate.\n\nJust reply and let me know.`;
  }
  return `Hey ${first}, just checking in on the estimate we sent over.\n\nIf you'd like to move forward, I can get you scheduled this week. If you have any questions about the estimate, just let me know.\n\nThanks!`;
}

function ScoreBadge({ score, large }: { score: number; large?: boolean }) {
  const color =
    score >= 85
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : score >= 70
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-slate-50 text-slate-600 border-slate-200';
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${color} ${
        large ? 'px-2.5 py-1 text-sm' : 'px-2 py-0.5 text-xs mt-1'
      }`}
    >
      AI Score {score}/100
    </span>
  );
}
