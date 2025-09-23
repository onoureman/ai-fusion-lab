"use client";
import { Button } from "@/components/ui/button";
import { Import } from "lucide-react";
import { useTheme } from "next-themes"; 
import Image from "next/image"; 
import ChatinputBox from "./_components/ChatinputBox";




export default function Home() {
  const { setTheme } = useTheme();
  return (
<div>
     <ChatinputBox />
</div>
  );
}
