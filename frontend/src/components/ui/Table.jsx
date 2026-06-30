import React from 'react';
import EmptyState from './EmptyState.jsx';

export default function Table({ columns, data, emptyState }) {
  if (!data || data.length === 0) {
    return emptyState ?? (
      <EmptyState heading="No records found" />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-hairline">
            {columns.map((col) => (
              <th
                key={col.key}
                className="font-body font-medium text-xs text-slate uppercase tracking-wide py-2.5 pr-4 first:pl-0 last:pr-0"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row._id || row.certId || row.institutionId || i} className="border-b border-hairline last:border-0">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="font-body text-sm text-ink py-3 pr-4 first:pl-0 last:pr-0 align-top"
                >
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
