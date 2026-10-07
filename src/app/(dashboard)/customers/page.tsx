import {
  MOCK_CUSTOMERS,
  formatCurrency,
  daysSince,
} from '@/data/mock';

export default function CustomersPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Customers
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {MOCK_CUSTOMERS.length} customers
          </p>
        </div>
        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition">
          Import CSV
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="text-left font-medium text-slate-500 px-4 py-3">
                Customer
              </th>
              <th className="text-left font-medium text-slate-500 px-4 py-3">
                Contact
              </th>
              <th className="text-right font-medium text-slate-500 px-4 py-3">
                Lifetime value
              </th>
              <th className="text-right font-medium text-slate-500 px-4 py-3">
                Last service
              </th>
            </tr>
          </thead>
          <tbody>
            {MOCK_CUSTOMERS.map((c) => (
              <tr
                key={c.id}
                className="border-b border-slate-50 hover:bg-slate-50/50 transition"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">
                    {c.first_name} {c.last_name}
                  </p>
                  {c.notes && (
                    <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">
                      {c.notes}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <p>{c.email}</p>
                  <p className="text-xs text-slate-400">{c.phone}</p>
                </td>
                <td className="px-4 py-3 text-right font-medium text-slate-900">
                  {formatCurrency(c.lifetime_value)}
                </td>
                <td className="px-4 py-3 text-right text-slate-600">
                  {c.last_service_at
                    ? `${daysSince(c.last_service_at)}d ago`
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
