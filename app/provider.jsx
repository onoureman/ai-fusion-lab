"use client"
import React from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
function Provider({ children, ...props }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

export default Provider
    