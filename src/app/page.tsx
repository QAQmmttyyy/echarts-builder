import { Builder } from "@/components/builder/builder";

export default function Home() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <header className="border-b px-6 py-4 bg-card">
        <h1 className="text-xl font-bold tracking-tight">ECharts Builder</h1>
      </header>
      <main className="flex-1 overflow-hidden">
        <Builder />
      </main>
    </div>
  );
}
