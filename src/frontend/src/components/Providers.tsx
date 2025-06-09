"use client";

import type * as React from "react";
import { useRootQueryClient } from "@/data/query-client";
import {
  dehydrate,
  HydrationBoundary,
  QueryClientProvider,
} from "@tanstack/react-query";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = useRootQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        {children}
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
