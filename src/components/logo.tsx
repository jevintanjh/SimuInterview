import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-label="Ace8 Logo"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-8 w-8", className)}
    >
      <path
        d="M13.66,15.34h-4.2V9.67a.66.66,0,0,1,.66-.66h5.67a.66.66,0,0,1,.66.66v5.67a.66.66,0,0,1-1.33,0V10.33H14.33v4.35a.66.66,0,0,1-.67.66Z"
      />
      <path
        d="M19,9.67H14.83V4a.66.66,0,0,1,.67-.66H21a.66.66,0,0,1,.66.66V9a.66.66,0,0,1-1.33,0V4.67H15.5V9a.67.67,0,0,1-.67.67Z"
      />
    </svg>
  );
}
