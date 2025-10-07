"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { SignIn } from "@clerk/nextjs"
import { SignInButton, useUser } from "@clerk/nextjs"
import React from "react"
import { useTheme } from "next-themes"
import Image from "next/image"
import { Bolt, User2, Zap } from "lucide-react"
import UsageCreditProgress from "./UsageCreditProgress"
 
export function AppSidebar() {
  const {theme, setTheme} = useTheme();
  const {user} = useUser();
  return (
    <Sidebar>
      <SidebarHeader>
      <div className="p-3">   
        <div className="flex items-center justify-center">
        <div className="flex items-center gap-3"> 
       <img src="/logo.svg" alt="Logo" width={60} height={60} className="w-[40px] h-[40px]" />
      <h2 className="text-lg font-bold">AI Fusion</h2>
      </div> 
      </div>
      {user?
      <button className="mt-4 w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        New Chat
      </button>:
      <SignInButton mode="modal">
      <button className="mt-4 w-full rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300">
        Sign In to start Chatting
      </button>
      </SignInButton> 
      }
      </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup > <h2 className="px-3  text-sm font-bold">Chats</h2>
       {!user && <p className="px-3 text-sm font-semibold text-gray-500">sign in to start chating with multiple AI models</p> }
       </SidebarGroup>
       </SidebarContent>
      <SidebarFooter>
        <div className="p-3 mb-10">

          {!user? <SignInButton mode="modal">
            <button className="w-full rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300">
              Sign In / Sign Up
            </button>
          </SignInButton>
          : 
          <div>
            <UsageCreditProgress />
            <button className="w-full mb-3 rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 flex items-center gap-3 justify-center">
              <Zap />
              <h2>Upgrade</h2>
            </button>
            <button className="w-full mb-3 rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 flex items-center gap-3 justify-center">
              <User2 /> <h2>Settings</h2>
            </button>
          </div>
          }
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}