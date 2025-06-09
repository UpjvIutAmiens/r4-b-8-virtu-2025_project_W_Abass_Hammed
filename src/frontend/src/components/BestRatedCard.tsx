"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

function BestRatedCard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "group/panel h-full relative rounded-lg md:rounded-xl p-px bg-surface-75 bg-gradient-to-b from-border to-border/50 dark:to-surface-100 transition-all hover:shadow-md flex items-center justify-center",
        "hover:bg-none hover:!bg-border-stronger",
      )}
    >
      <div
        className={cn(
          "relative z-10 w-full h-full rounded-[7px] md:rounded-[11px] bg-surface-75 overflow-hidden text-foreground-light",
          "bg-surface-75 group/panel",
        )}
      >
        <div className="flex flex-col justify-between">
          <div className="relative w-full aspect-[3/1] bg flex items-center justify-center gap-4 overflow-hidden">
            {/** The poster will come here, if no image show film icon */}
          </div>

          <div className="p-5 flex flex-col gap-2 border-t border-muted">
            <div className="flex items-start justify-between">
              <h4 className="text-foreground text-lg">
                {/** Movie title will come here */}
              </h4>
            </div>
            <p className="text-sm text-foreground-lighter">
              {/** Movie description will come here */}
            </p>
          </div>
        </div>
        <div>
          <div className="flex flex-col justify-between p-5 pt-0">
            <div className="flex items-stretch gap-2">
              {/** we can add the stars here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BestRatedCard;
