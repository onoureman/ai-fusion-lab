import { Paperclip } from 'lucide-react';
import React, { useEffect, useContext, useState } from 'react';
import { Mic, Send } from 'lucide-react';
import AiMultiModels from './AiMultiModels';
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext';
import axios from 'axios';
import { useAuth, useUser } from '@clerk/nextjs';
import { v4 as uuidv4 } from 'uuid';
import { useSearchParams } from 'next/navigation.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/config/FirebaseConfig';
import { toast } from 'sonner';

function ChatInputBox() {
  // initialize to empty string to avoid undefined / .trim() errors
  const [userInput, setUserInput] = useState("");
  const { user } = useUser();
  const { aiSelectedModels, setAiSelectedModels, messages, setMessages } = useContext(AiSelectedModelContext);

  const [chatId, setChatId] = useState();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const { has } = useAuth();

  useEffect(() => {
    const chatId_ = params.get('chatId');

    if (chatId_) {
      setChatId(chatId_);
      GetMessages(chatId_);
    } else {
      // messages should be an object keyed by model names
      setMessages({});
      setChatId(uuidv4());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleSend = async () => {
    // guard against empty input
    if (!userInput || !userInput.trim()) return;
    setLoading(true);

    // capture and clear input
    const currentInput = userInput.trim();
    setUserInput("");

    // call only if user free
    if (!has({plan:'unlimted_plan'})){
      // check token limit — try GET first, fallback to POST, treat 404 as "no limit check"
      let remainingToken = Infinity;
      try {
        const res = await axios.get("/api/user-remaining-msgs", { params: { token: 1 } });
        remainingToken = res?.data?.remainingToken ?? remainingToken;
      } catch (errGet) {
        if (errGet?.response?.status === 404) {
          console.warn("/api/user-remaining-msgs not found (GET) — skipping limit check. Create the API route or switch to POST.");
        } else {
          // try POST as a fallback
          try {
            const res2 = await axios.post("/api/user-remaining-msgs", { token: 1 });
            remainingToken = res2?.data?.remainingToken ?? remainingToken;
          } catch (errPost) {
            if (errPost?.response?.status === 404) {
              console.warn("/api/user-remaining-msgs not found (POST) — skipping limit check.");
            } else {
              console.error("Failed checking remaining tokens:", errPost);
            }
          }
        }
      }

      if (Number.isFinite(remainingToken) && remainingToken <= 0) {
        console.log("Limit Exceeded");
        toast.error('Maximum Daily Limit Exceed');
        setLoading(false);
        return;
      }
    }

    // prepare model entries
    const modelEntries = Object.entries(aiSelectedModels || {});

    // 1️⃣ Add user message to all enabled models
    setMessages((prev) => {
      const updated = { ...prev };
      Object.keys(aiSelectedModels || {}).forEach((modelKey) => {
        updated[modelKey] = [
          ...(updated[modelKey] ?? []),
          { role: "user", content: currentInput },
        ];
      });
      return updated;
    });

    // 2️⃣ Fetch response from each enabled model
    modelEntries.forEach(async ([parentModel, modelInfo]) => {
      if (!modelInfo?.modelId || aiSelectedModels[parentModel]?.enable === false) return;

      // Add loading placeholder before API call
      setMessages((prev) => ({
        ...prev,
        [parentModel]: [
          ...(prev[parentModel] ?? []),
          { role: "assistant", content: "Loading...", model: parentModel, loading: true },
        ],
      }));

      try {
        const result = await axios.post("/api/ai-multi-model", {
          model: modelInfo.modelId,
          msg: [{ role: "user", content: currentInput }],
          parentModel,
        });

        const { aiResponse, model } = result.data;
        if (!aiResponse) {
          throw new Error(result.data?.error || "No AI model reply to msg");
        }

        // replace loading with response
        setMessages((prev) => {
          const updated = [...(prev[parentModel] ?? [])];
          const loadingIndex = updated.findIndex((m) => m.loading);

          if (loadingIndex !== -1) {
            updated[loadingIndex] = {
              role: "assistant",
              content: aiResponse,
              model,
              loading: false,
            };
          } else {
            updated.push({
              role: "assistant",
              content: aiResponse,
              model,
              loading: false,
            });
          }

          return { ...prev, [parentModel]: updated };
        });
      } catch (err) {
        console.error("AI response error:", err?.message ?? err);
        setMessages((prev) => ({
          ...prev,
          [parentModel]: [
            ...(prev[parentModel] ?? []),
            { role: "assistant", content: `⚠️ Error: ${err?.message ?? "fetching response"}` },
          ],
        }));
      }
    });
  };

  useEffect(() => {
    if (messages) { SaveMessages(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const SaveMessages = async () => {
    if (!chatId) {
      console.warn("SaveMessages skipped: chatId is not set");
      return;
    }

    try {
      const docRef = doc(db, "chatHistory", chatId);
      await setDoc(docRef, {
        chatId,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        messages,
        lastUpdated: Date.now()
      }, { merge: true });
    } catch (err) {
      console.error("Failed saving messages:", err);
    }
  };

  // Accept an optional id param; guard before calling doc(...)
  const GetMessages = async (idParam) => {
    const id = idParam ?? chatId;
    if (!id) {
      console.warn("GetMessages skipped: chatId is not set");
      return;
    }

    try {
      const docRef = doc(db, "chatHistory", id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        setMessages({});
        return;
      }
      const docData = docSnap.data() ?? {};
      // Ensure messages is an object keyed by model names
      setMessages(docData.messages ?? {});
    } catch (err) {
      console.error("Failed getting messages:", err);
      setMessages({});
    }
  };

  return (
    <div className='relative min-h-screen'>
      {/* Other content of the page would go here */ }
      <div className="pb-20"> <AiMultiModels/> </div> {/* Chat input box fixed at the bottom */ }
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-50">
        <div className="flex bg-white dark:bg-gray-800 shadow-lg rounded-md p-2">
          <input
            type="text"
            value={userInput}
            className="flex-grow p-2 border border-gray-300 dark:border-gray-700 rounded-l-md bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none"
            placeholder="Type your message..."
            onChange={(event) => setUserInput(event.target.value)}
          />
          
          <div className="ml-2 flex items-center space-x-2">
            <button className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
              <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
              <Mic className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button onClick={handleSend} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
              <Send />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInputBox;