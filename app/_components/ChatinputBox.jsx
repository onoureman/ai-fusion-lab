import { Paperclip } from 'lucide-react';
import React from 'react';
import { Mic } from 'lucide-react';

function ChatinputBox() {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-50">
      <div className="flex bg-white dark:bg-gray-800 shadow-lg rounded-md p-2">
        <input
          type="text"
          className="flex-grow p-2 border border-gray-300 dark:border-gray-700 rounded-l-md bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none"
          placeholder="Type your message..."
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600">
          Send
        </button>
        <div className="ml-2 flex items-center space-x-2">
          <button className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
            <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">
            <Mic className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      
      </div>
    </div>
  );
}

export default ChatinputBox;