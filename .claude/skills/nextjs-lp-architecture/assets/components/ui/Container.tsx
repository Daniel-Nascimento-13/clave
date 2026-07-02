import { cn } from "@/lib/utils";

export default function Container({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mx-auto max-w-6xl px-6 md:px-12", className)} {...props}>
      {children}
    </div>
  );
}
