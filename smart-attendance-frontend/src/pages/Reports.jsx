export default function Reports() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold text-slate-900">
        Attendance Reports
      </h1>
      <p className="mb-4 text-sm text-slate-500">
        Placeholder for weekly/monthly attendance analytics.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">
            This week&apos;s average
          </p>
          <p className="mt-2 text-2xl font-semibold text-blue-600">93%</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">
            This month&apos;s average
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600">91%</p>
        </div>
      </div>
    </div>
  );
}


