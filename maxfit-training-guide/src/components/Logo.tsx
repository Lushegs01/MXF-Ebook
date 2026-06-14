/**
 * MAXFIT brand logo. Renders the shared SVG assets in `public/`:
 * - `full`  → complete logo (house, figure, MAXFIT wordmark, tagline)
 * - `mark`  → icon-only mark (house + figure), ideal for small/square spots
 */
interface LogoProps {
  variant?: 'full' | 'mark';
  className?: string;
}

export default function Logo({ variant = 'full', className }: LogoProps) {
  const src = variant === 'mark' ? '/favicon.svg' : '/logo.svg';
  return (
    <img
      src={src}
      alt="MAXFIT — Home Fitness Service"
      className={className}
      draggable={false}
    />
  );
}
