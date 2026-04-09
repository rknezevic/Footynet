export default function Loading() {
  return (
    <div className="min-h-screen bg-neutral-50 grid place-items-center">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">Loading...</p>
      </div>
    </div>
  );
}
