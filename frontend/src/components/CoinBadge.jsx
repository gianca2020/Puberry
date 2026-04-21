import CoinIcon from './CoinIcon';

export default function CoinBadge({ balance }) {
  return (
    <div className="flex items-center gap-1.5 bg-brand-gold border-b-2 border-brand-gold-dark rounded-pill px-3 py-1 shadow-badge">
      <CoinIcon className="w-4 h-4" />
      <span className="font-black text-amber-900 text-sm leading-none">{balance}</span>
      <span className="text-amber-800 text-xs font-bold uppercase tracking-wide">coins</span>
    </div>
  );
}
