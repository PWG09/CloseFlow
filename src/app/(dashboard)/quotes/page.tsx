import {
  MOCK_QUOTES,
  formatCurrency,
  getCustomerName,
  daysSince,
} from '@/data/mock';

const STATUS_COLOR: Record<string, string> = {
  draft: 'bg-slate-50 text-slate-600 border-slate-200',
  sent: 'bg-blue-50 text-blue-700 border-blue-200',
  viewed: 'bg-amber-50 text-amber-700 border-amber-200',
  pending: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  expired: 'bg-slate-50 text-slate-500 border-slate-200',
  cancelled: 'bg-slate-50 text-slate-500 border-slate-200',
};

export default function QuotesPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Quotes
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {MOCK_QUOTES.length} quotes · follow up on unclosed ones
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="text-left font-medium text-slate-500 px-4 py-3">
                Quote
              </th>
              <th className="text-left font-medium text-slate-500 px-4 py-3">
                Customer
              </th>
              <th className="text-left font-medium text-slate-500 px-4 py-3">
                Status
              </th>
              <th className="text-right font-medium text-slate-500 px-4 py-3">
                Amount
              </th>
              <th className="text-right font-medium text-slate-500 px-4 py-3">
                Age
              </th>
            </tr>
          </thead>
          <tbody>
            {MOCK_QUOTES.map((q) => (
              <tr
                key={q.id}
                className="border-b border-slate-50 hover:bg-slate-50/50 transition"
              >
                <td className="px-4 py-3 font-medium text-slate-900">
                  {q.quote_number}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {getCustomerName(q.customer_id)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${
                      STATUS_COLOR[q.status] ?? STATUS_COLOR.draft
                    }`}
                  >
                    {q.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-semibold text-slate-900">
                  {formatCurrency(q.total)}
                </td>
                <td className="px-4 py-3 text-right text-slate-500">
                  {q.sent_at ? `${daysSince(q.sent_at)}d` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
