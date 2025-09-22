"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
 
export function AppSidebar() {
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
      <button className="mt-4 w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        New Chat
      </button>
      </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup > <h2 className="px-3  text-sm font-bold">Chats</h2>
       <p className="px-3 text-sm font-semibold text-gray-500">sign in to start chating with multiple AI models</p>
       </SidebarGroup>
       </SidebarContent>
      <SidebarFooter>
        <div className="p-3 mb-10">
          <button className="w-full rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300">
            Sign In / Sign Up
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}