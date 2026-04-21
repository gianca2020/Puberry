import CoinIcon from './CoinIcon';

export default function CoinBadge({ balance }) {
  return (
    <div className="flex items-center gap-2 bg-brand-gold border-b-4 border-brand-gold-dark rounded-pill px-5 py-2 shadow-badge">
      <CoinIcon className="w-7 h-7" />
      <span className="font-black text-white text-xl leading-none">{balance}</span>
      <span className="text-amber-100 text-sm font-bold uppercase tracking-wide">coins</span>
    </div>
  );
}
