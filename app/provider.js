"use client"
import React from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import {AppSidebar} from './_components/AppSidebar';
function Provider({ children, ...props }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange

    ><SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <div>{children}</div>
    </SidebarProvider>
    </NextThemesProvider>
  );
}

export default Provider
    