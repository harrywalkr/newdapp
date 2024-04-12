import React from "react";
import { ThemeProvider } from "./theme.provider";
import { WagmiiProvider } from "./wagmi.provider";
import { GlobalContextProvider } from "./context.provider";
import QueryProvider from "./query.provider";


export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <WagmiiProvider>
        <GlobalContextProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </GlobalContextProvider>
      </WagmiiProvider>
    </ThemeProvider>
  );
}
