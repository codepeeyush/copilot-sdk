export function Dashboard() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome to {{projectName}}</h1>
          <p className="text-muted-foreground">
            Your AI-powered application is ready
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Users" value="1,234" change="+12%" />
        <StatCard title="Active Sessions" value="56" change="+5%" />
        <StatCard title="AI Conversations" value="892" change="+23%" />
      </div>

      {/* Info Section */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Getting Started</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="text-green-500">&#10003;</span>
            AI Copilot is ready in the sidebar
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">&#10003;</span>
            Powered by {{providerClass}}
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">&#10003;</span>
            Customize this dashboard as needed
          </li>
        </ul>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
}: {
  title: string;
  value: string;
  change: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-green-600">{change}</p>
    </div>
  );
}
