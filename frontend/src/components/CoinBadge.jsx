import CoinIcon from './CoinIcon';

export default function CoinBadge({ balance }) {
  return (
    <div className="flex items-center gap-1.5 bg-amber-100 border-b-2 border-amber-300 rounded-pill px-3 py-1 shadow-sm">
      <CoinIcon className="w-4 h-4" />
      <span className="font-black text-amber-700 text-sm leading-none">{balance}</span>
      <span className="text-amber-500 text-xs font-bold uppercase tracking-wide">coins</span>
    </div>
  );
}
