"use client"
import React, { use } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import {AppSidebar} from './_components/AppSidebar';
import AppHeader from './_components/AppHeader';
import App from 'next/app';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { db } from '@/config/FirebaseConfig';

import { doc, getDoc, setDoc } from 'firebase/firestore';

function Provider({ children, ...props }) {

const {user} = useUser();

useEffect(() => {
  if (user) {
    CreateNewUser();
  }
  }, [user])
 


  const CreateNewUser = async() => {
    //if user exist
    const userRef=doc(db,'users',user?.primaryEmailAddress?.emailAddresses);
    const userSnap=await getDoc(userRef);
    if(userSnap.exists()){
      console.log('user already exist');
      return;

    } else {
       const userData = {
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        createdAt: new Date(),
        remainingMsg:5,
        plan:'free',
        credits:1000
    }
    await setDoc(userRef,userData);
    console.log('new user created');
    
  }
 
}

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange

    ><SidebarProvider>
      <AppSidebar />

      <div className='w-full'>
        <AppHeader />
        {children} 
      </div>
    </SidebarProvider>
    </NextThemesProvider>
  );
}

export default Provider
    