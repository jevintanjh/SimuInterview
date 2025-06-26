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
      <path d="M12 2L1 21h4l1.5-4h9l1.5 4h4L12 2zm-1.25 11L12 6.5l1.25 6.5h-2.5z" />
    </svg>
  );
}
