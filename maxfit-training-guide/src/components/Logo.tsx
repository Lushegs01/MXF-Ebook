/**
 * MAXFIT brand logo. Renders the brand PNG assets in `public/`:
 * - `full`  → complete logo (house, figure, MAXFIT wordmark, tagline)
 * - `mark`  → icon-only emblem (house + figure), ideal for small/square spots
 */
interface LogoProps {
  variant?: 'full' | 'mark';
  className?: string;
}

export default function Logo({ variant = 'full', className }: LogoProps) {
  const src = variant === 'mark' ? '/logo-mark.png' : '/logo.png';
  return (
    <img
      src={src}
      alt="MAXFIT — Home Fitness Service"
      className={className}
      draggable={false}
    />
  );
}
