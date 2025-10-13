"use client"
import React, { useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './_components/AppSidebar';
import AppHeader from './_components/AppHeader';
import { useUser } from '@clerk/nextjs';
import { db } from '@/config/FirebaseConfig';
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext';
import { defaultModel as DefaultModel } from '@/shared/AiModelsShared';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { UserDetailContext } from '@/context/UserDetailContext';


function Provider({ children, ...props }) {
  const { user } = useUser();
  const [aiSelectedModels, setAiSelectedModels] = useState(DefaultModel);
  const [userDetail, setUserDetail] = useState();
  const [messages, setMessages] = useState({});

  useEffect(() => {
    if (user) {
      CreateNewUser();
    }
  }, [user]);

  useEffect(() => {
    if (aiSelectedModels) {
      updateAIModelSelectionPref();
    }
  }, [aiSelectedModels]);

  const updateAIModelSelectionPref = async() => {
    if (!user) return; // don't run when user is not available yet
    const userKey =
      user?.primaryEmailAddress?.emailAddress ||
      user?.emailAddresses?.[0]?.emailAddress ||
      user?.id;
    if (!userKey) return;
    try {
      const docRef = doc(db, 'users', userKey);
      await updateDoc(docRef, {
        selectedModelPref: aiSelectedModels
      });
    } catch (err) {
      console.error('Failed updating selected model pref:', err);
    }
  }

  const CreateNewUser = async () => {
    const userKey =
      user?.primaryEmailAddress?.emailAddress ||
      user?.emailAddresses?.[0]?.emailAddress ||
      user?.id;
     const userRef = doc(db, 'users', userKey);
     const userSnap = await getDoc(userRef);
     if (userSnap.exists()) {
       console.log('user already exist');
       const userInfo = userSnap.data();
       setAiSelectedModels(userInfo?.selectedModelPref ?? DefaultModel);
       setUserDetail(userInfo);
       return;
     } else {
       const userData = {
         name: user?.fullName,
         email: user?.primaryEmailAddress?.emailAddress,
         createdAt: new Date(),
         remainingMsg: 5,
         plan: 'free',
         credits: 1000
       };
       await setDoc(userRef, userData);
       console.log('new user created');
       setUserDetail(userData);
     }
   };

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        <AiSelectedModelContext.Provider value={{ aiSelectedModels, setAiSelectedModels, messages, setMessages }}>
          <SidebarProvider>
            <AppSidebar />
            <div className='w-full'>
              <AppHeader />
              {children}
            </div>
          </SidebarProvider>
        </AiSelectedModelContext.Provider>
      </UserDetailContext.Provider>
    </NextThemesProvider>
  );
}

export default Provider
