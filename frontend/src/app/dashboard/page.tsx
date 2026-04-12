export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8 gap-4">
      <h1 className="text-4xl tracking-tighter sm:text-5xl lg:text-7xl">
        AegisGuard <span className="text-zinc-500 font-mono tracking-tight">SOC</span>
      </h1>
      <p className="text-xl text-zinc-400 font-mono">
        Real-time monitoring active. Standing by for auto-signed transactions.
      </p>
    </div>
  );
}
