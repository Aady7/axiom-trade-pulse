"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, ReactNode} from "react";
import { ReduxProvider } from "./redux-provider";
import {TooltipProvider} from "@/components/ui/tooltip";

export  function Providers({children}: {children: ReactNode}) {
    const [queryClient] = useState(() => new QueryClient(
        {
            defaultOptions: {
                queries: {
                    staleTime: 30_000,
                    refetchOnWindowFocus: false,
                },
            },
        }
    ));
    return (
        <ReduxProvider>
        <QueryClientProvider client={queryClient}>
            <TooltipProvider delayDuration={150}>   {children}</TooltipProvider>
           
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        </ReduxProvider>
    )
}