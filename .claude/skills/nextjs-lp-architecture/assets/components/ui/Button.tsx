import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export default function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors",
        variant === "primary" && "bg-amber text-bg hover:opacity-90",
        variant === "ghost" && "border border-fg/20 text-fg hover:bg-fg/5",
        className
      )}
      {...props}
    />
  );
}
