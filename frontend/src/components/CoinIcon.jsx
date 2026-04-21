import coinPng from '../assets/coin-svgrepo-com.png';

export default function CoinIcon({ className = 'w-5 h-5' }) {
  return (
    <img
      src={coinPng}
      alt="coin"
      className={className}
      aria-hidden="true"
    />
  );
}
