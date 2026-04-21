import CoinIcon from './CoinIcon';

export default function CoinBadge({ balance }) {
  return (
    <div className="flex items-center gap-2 bg-amber-100 border-b-4 border-amber-300 rounded-pill px-5 py-2 shadow-md">
      <CoinIcon className="w-7 h-7" />
      <span className="font-black text-amber-700 text-xl leading-none">{balance}</span>
      <span className="text-amber-500 text-sm font-bold uppercase tracking-wide">coins</span>
    </div>
  );
}
