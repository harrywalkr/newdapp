'use client'
import React, { ErrorInfo } from "react";
import { ThemeProvider } from "./theme.provider";
import { WagmiiProvider } from "./wagmi.provider";
import { GlobalContextProvider } from "./context.provider";
import QueryProvider from "./query.provider";
import { Toaster } from "@/components/ui/toast/toaster";
import { ErrorBoundary } from "react-error-boundary";
import { postError } from "@/services/http/error.http";

export default function Providers({ children }: { children: React.ReactNode }) {

  const logError = (error: Error, info: ErrorInfo) => {
    postError({ data: error })
  };

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
            <ErrorBoundary FallbackComponent={Fallback} onError={logError}>
              {children}
            </ErrorBoundary>
          </QueryProvider>
        </GlobalContextProvider>
        <Toaster />
      </WagmiiProvider>
    </ThemeProvider>
  );
}


function Fallback({ error, resetErrorBoundary }: any) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}
