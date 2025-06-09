"use client";

import { Button } from "./button";
import BestRatedCard from "./BestRatedCard";
import { Dispatch, SetStateAction } from "react";

interface BestRatedProps {
  showBestRated: Dispatch<SetStateAction<boolean>>;
}

const BestRated = ({ showBestRated }: BestRatedProps) => {
  return (
    <>
      <div
        id="examples"
        className="sm:py-18 container relative mx-auto px-6 py-16 md:py-24 lg:px-16 lg:py-24 xl:px-20 xl:pt-32 !pb-0"
      >
        <div className="text-center flex flex-col items-center">
          <h3 className="h2">The best-rated movies</h3>
          <p className="p max-w-[300px] md:max-w-none"></p>
          <div className="flex justify-center gap-2 py-4">
            <Button
              size="sm"
              className="h-full"
              onClick={() => showBestRated(false)}
            >
              Show random movie
            </Button>
          </div>
        </div>
      </div>
      <div className="sm:py-18 container mx-auto py-16 md:py-24 lg:py-24 relative w-full !px-0 lg:!px-16 xl:!px-20 !pb-0 mb-16 md:mb-12 lg:mb-12 !pt-6 max-w-[1400px]">
        <div className="hidden lg:grid grid-cols-12 gap-5 mt-4">
          {/* {Examples.slice(0, 6).map((example, i) => {
            return (
              <div
                className={cn(
                  "col-span-12 h-full lg:col-span-6 xl:col-span-4",
                  "flex items-stretch",
                )}
                key={i}
              >
                <BestRatedCard {...example} />
              </div>
            );
          })} */}
        </div>
      </div>
    </>
  );
};

export default BestRated;
