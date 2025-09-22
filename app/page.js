"use client";
import { Button } from "@/components/ui/button";
import { Import } from "lucide-react";
import { useTheme } from "next-themes"; 
import Image from "next/image"; 




export default function Home() {
  const { setTheme } = useTheme();
  return (
<div>
       <h1>Welcome to My Website</h1>
      <p>This is a simple Next.js application.</p>
    <Button>Click Me</Button>
    <Button onClick={() => setTheme("light")}>Light Mode</Button>
    <Button onClick={() => setTheme("dark")}>Dark Mode</Button>

  
</div>
  );
}
