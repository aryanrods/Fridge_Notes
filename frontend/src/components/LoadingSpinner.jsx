export default function LoadingSpinner({ fullScreen = false, size = "md" }) {
  const sizes = { sm: "w-4 h-4", md: "w-8 h-8", lg: "w-12 h-12" };

  const spinner = (
    <div
      className={`${sizes[size]} border-2 border-stone-200 border-t-sage-500 rounded-full animate-spin`}
    />
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center gap-4">
        <div className="text-3xl animate-bounce-in">🥬</div>
        {spinner}
        <p className="text-sm text-stone-400 font-body">Loading FridgeNotes…</p>
      </div>
    );
  }

  return <div className="flex justify-center items-center py-8">{spinner}</div>;
}
