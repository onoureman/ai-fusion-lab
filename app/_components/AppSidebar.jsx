"use client";
import React, { useState, useEffect, useContext } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { User2, Zap } from "lucide-react";
import UsageCreditProgress from "./UsageCreditProgress";
import Link from "next/link";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import moment from "moment";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { AiSelectedModelContext } from "@/context/AiSelectedModelContext";


export function AppSidebar() {
  const { theme, setTheme } = useTheme();
  const { user } = useUser();
  const [chatHistory, setChatHistory] = useState([]);
  const [freeMsgCount, setFreeMsgCount] = useState(0);
  const { aiSelectedModels, setAiSelectedModels, messages, setMessages } = useContext(AiSelectedModelContext);

  useEffect(() => {
    if (user) {
     user && GetChatHistory();
   
    }
  }, [user])

  useEffect(()=>{
    GetRemainingTokenMsgs();
  },[messages])

  const GetChatHistory = async () => {
    const q = query(
      collection(db, "chatHistory"),
      where("userEmail", "==", user?.primaryEmailAddress?.emailAddress)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      setChatHistory((prev) => [...prev, doc.data()]);
    })
  }

  const GetLastUserMessageFromChat = (chat) => {
    const allMessages = Object.values(chat.messages).flat();
    const userMessages = allMessages.filter((msg) => msg.role === "user");
    const lastUserMessage =
      userMessages[userMessages.length - 1]?.content || "New Chat";
    const lastUpdated = chat.lastUpdated ?? Date.now();
    const formattedDate = moment(lastUpdated).fromNow();
    return {
      chatId: chat.chatId,
      message: lastUserMessage,
      lastMsgDate: formattedDate,
    };
  }

  const GetRemainingTokenMsgs = async () => {
    const result = await axios.POST("/api/user-remaining-msgs");
    console.log(result);
    setFreeMsgCount(result?.data?.remainingToken);
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-3">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <img
                src="/logo.svg"
                alt="Logo"
                width={60}
                height={60}
                className="w-[40px] h-[40px]"
              />
              <h2 className="text-lg font-bold">AI Fusion</h2>
            </div>
          </div>

          {user ? (
            <Link href={`/`}>
              <button className="mt-4 w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                + New Chat
              </button>
            </Link>
          ) : (
            <SignInButton mode="modal">
              <button className="mt-4 w-full rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300">
                Sign In to start Chatting
              </button>
            </SignInButton>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <div className="p-3">
            <h2 className="px-3 text-sm font-bold">Chats</h2>
            {!user && (
              <p className="px-3 text-sm font-semibold text-gray-500">
                Sign in to start chatting with multiple AI models
              </p>
            )}

            {chatHistory.map((chat, index) => {
              const { chatId, message, lastMsgDate } =
                GetLastUserMessageFromChat(chat);
              return (
                <Link
                  href={`?chatId=${chatId}`}
                  key={index}
                  className="mt-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-2 cursor-pointer"
                >
                  <h2 className="text-sm text-gray-400">{lastMsgDate}</h2>
                  <h2 className="text-lg line-clamp-1">{message}</h2>
                  <hr className="my-3" />
                </Link>
              );
            })}
          </div>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-3 mb-10">
          {!user ? (
            <SignInButton mode="modal">
              <button className="w-full rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300">
                Sign In
              </button>
            </SignInButton>
          ) : (
            <div>
              <UsageCreditProgress remainingToken={freeMsgCount} />
              <Button className="w-full mb-3">
                <Zap /> Upgrade Plan
              </Button>
              <Button className="w-full mb-3">
                <User2 /> <h2>Settings</h2>
              </Button>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}