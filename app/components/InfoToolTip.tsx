import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ReactNode } from "react";
interface InfoToolTipProps {
    label: string;
    children: ReactNode;
}

export function InfoToolTip({ label, children }: InfoToolTipProps) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
          <TooltipContent className="border-zinc-700 bg-zinc-950 text-xs text-zinc-100">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }