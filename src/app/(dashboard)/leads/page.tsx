import { MOCK_LEADS, formatCurrency, daysSince } from '@/data/mock';

const STATUS_COLOR: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  contacted: 'bg-amber-50 text-amber-700 border-amber-200',
  qualified: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  quoted: 'bg-purple-50 text-purple-700 border-purple-200',
  won: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  lost: 'bg-slate-50 text-slate-600 border-slate-200',
  inactive: 'bg-slate-50 text-slate-500 border-slate-200',
};

export default function LeadsPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leads</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {MOCK_LEADS.length} leads · prioritize fast response
        </p>
      </div>

      <div className="space-y-3">
        {MOCK_LEADS.map((lead) => (
          <div
            key={lead.id}
            className="rounded-xl border border-slate-200 bg-white p-4 flex items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-slate-900">
                  {lead.service ?? 'General inquiry'}
                </p>
                <span
                  className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${
                    STATUS_COLOR[lead.status] ?? STATUS_COLOR.new
                  }`}
                >
                  {lead.status}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                {lead.source ?? 'Unknown source'}
                {lead.created_at && ` · ${daysSince(lead.created_at)}d ago`}
              </p>
              {lead.notes && (
                <p className="text-xs text-slate-400 mt-0.5">{lead.notes}</p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="font-semibold text-slate-900">
                {lead.estimated_value
                  ? formatCurrency(lead.estimated_value)
                  : '—'}
              </p>
              {lead.status === 'new' && (
                <button className="mt-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 transition">
                  Respond
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
