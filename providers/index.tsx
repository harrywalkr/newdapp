import React from "react";
import { ThemeProvider } from "./theme.provider";
import { WagmiiProvider } from "./wagmi.provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <WagmiiProvider>{children}</WagmiiProvider>
    </ThemeProvider>
  );
}
