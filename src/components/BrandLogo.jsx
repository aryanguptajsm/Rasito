import { Link } from 'react-router-dom';

export default function BrandLogo({ light = false, compact = false }) {
  return (
    <Link
      to="/"
      className="flex w-fit shrink-0 items-center gap-2.5"
      aria-label="Restro home"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-[15px] bg-terracotta shadow-[0_5px_14px_rgba(247,206,39,0.2)]">
        <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className="h-7 w-7 text-dark">
          <path d="M8 26h24l-3 8H11l-3-8Z" fill="currentColor" />
          <path d="M10 25c0-2 2-3 4-3s4 1 4 3c0-2 2-3 4-3s4 1 4 3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="m14 19 1-4m5 4v-5m5 5-1-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M13 30h14" stroke="#F7CE27" strokeWidth="1.8" strokeLinecap="round" />
          <path d="m30 8 .8 2.2L33 11l-2.2.8L30 14l-.8-2.2L27 11l2.2-.8L30 8Z" fill="currentColor" />
        </svg>
      </span>
      <span className={compact ? 'hidden min-[360px]:block' : 'block'}>
        <span className={`block text-[19px] font-black leading-[0.95] tracking-[-0.06em] ${light ? 'text-white' : 'text-dark'}`}>
          restro<span className="text-terracotta">.</span>
        </span>
        <span className={`mt-1 block text-[8px] font-bold uppercase tracking-[0.2em] ${light ? 'text-white/50' : 'text-muted'}`}>
          bakery · bites
        </span>
      </span>
    </Link>
  );
}
