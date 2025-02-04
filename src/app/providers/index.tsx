"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "./get-query-client";
import type * as React from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  if (typeof window !== "undefined") {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "", {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    });
  }

  return (
    <PostHogProvider client={posthog}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools />
      </QueryClientProvider>
    </PostHogProvider>
  );
}
