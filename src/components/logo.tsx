import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => (
  <svg
    className={cn("w-16 h-16 text-primary", className)}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L2 7V17L12 22L22 17V7L12 2ZM4 8.23L12 12.5L20 8.23V15.77L12 20L4 15.77V8.23ZM12 4.46L18.97 8.5L12 12.53L5.03 8.5L12 4.46Z"
    />
  </svg>
);

export default Logo;
