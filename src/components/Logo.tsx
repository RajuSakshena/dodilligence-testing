import { cn } from "@/lib/utils";

interface LogoProps {
  size?: number;
  animate?: boolean;
  className?: string;
  color?: string;
}

const Logo = ({ size = 32, animate = false, className, color = "#1A6478" }: LogoProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(animate && "logo-draw", className)}
  >
    <polyline
      points="4,52 20,16 32,36"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <polyline
      points="32,36 32,44 40,44 40,36 48,36 48,28 56,28 56,20 60,20"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <line x1="4" y1="52" x2="60" y2="52" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
  </svg>
);

export default Logo;
