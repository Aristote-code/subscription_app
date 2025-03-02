import { cn } from "@/lib/utils";

type SeparatorWithTextProps = {
  text: string;
  className?: string;
};

export function SeparatorWithText({ text, className }: SeparatorWithTextProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-muted" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-background px-2 text-muted-foreground">{text}</span>
      </div>
    </div>
  );
}
