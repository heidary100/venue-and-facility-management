"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { UserProvider } from "@/providers/user-provider";
import { Toaster } from "@/components/ui/sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <UserProvider>
        {children}
        <Toaster position="top-center" dir="rtl" richColors closeButton />
      </UserProvider>
    </ThemeProvider>
  );
}
