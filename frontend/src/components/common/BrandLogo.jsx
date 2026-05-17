import { Link } from 'react-router-dom';

export default function BrandLogo({ compact = false }) {
  return (
    <Link to="/" className="inline-flex shrink-0 items-center gap-3 text-stone-950">
      <span className="font-serif text-2xl font-semibold leading-none text-plum-900">A</span>
      {!compact && (
        <span className="text-xl font-semibold tracking-normal">
          Aureva
        </span>
      )}
    </Link>
  );
}
