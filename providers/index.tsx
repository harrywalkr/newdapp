import React from "react";
import { ThemeProvider } from "./theme.provider";
import { WagmiiProvider } from "./wagmi.provider";
import { GlobalContextProvider } from "./context.provider";
import QueryProvider from "./query.provider";
import { Toaster } from "@/components/ui/toast/toaster";

//FIXME: implement chain provider. Maybe using thirdWeb (npm)
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <WagmiiProvider>
        {/* FIXME: remove react context provider */}
        <GlobalContextProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </GlobalContextProvider>
        <Toaster />
      </WagmiiProvider>
    </ThemeProvider>
  );
}
