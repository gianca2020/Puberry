export default function CoinBadge({ balance }) {
  return (
    <div className="flex items-center gap-2 bg-amber-400 border-b-4 border-amber-600 rounded-full px-5 py-2 shadow-lg">
      <span className="text-2xl">🪙</span>
      <span className="font-black text-white text-xl leading-none">{balance}</span>
      <span className="text-amber-100 text-sm font-bold uppercase tracking-wide">coins</span>
    </div>
  );
}
