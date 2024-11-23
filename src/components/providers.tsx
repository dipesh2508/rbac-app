'use client'

import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes"
import { Toaster } from "@/components/ui/toaster"

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      {children}
      <Toaster />
    </NextThemesProvider>
  )
} 