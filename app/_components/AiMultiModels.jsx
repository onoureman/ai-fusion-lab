import React, { useState, useContext } from 'react';
import AiModelList from '../../shared/AiModelList.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MessageSquare } from 'lucide-react';
import { FaLock } from 'react-icons/fa'; 
import { SelectGroup, SelectLabel } from '@radix-ui/react-select';
import { useUser } from '@clerk/nextjs';
import { AiSelectedModelContext } from '@/context/AiSelectedModelContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/FirebaseConfig';

function AiMultiModels() {
  const { user } = useUser();
  const [AiModelLists, setAiModelLists] = useState(AiModelList);
  const { aiSelectedModels, setAiSelectedModels } = useContext(AiSelectedModelContext);

  const onToggleChange = (model, value) => {
    setAiModelLists((prev) =>
      prev.map((m) =>
        m.model === model ? { ...m, enabled: value } : m
      )
    );
  }

  const onSelectValue = async (parentModel, value) => {
    setAiSelectedModels((prev) => ({
      ...prev,
      [parentModel]: { modelId: value }
    }));
    //update to firebase database
    const docRef = doc(db, 'users', user?.primaryEmailAddress?.emailAddresses);
    await updateDoc(docRef, {
      selectedModelPref: aiSelectedModels
    });
  }

  return (
    <div className='flex flex-1 h-[75vh] border-b'>
      {AiModelLists.map((model, index) => (
        <div
          key={index}
          className='flex flex-col border-r w-[300px] last:border-0 '
        >
          <div className='flex w-full items-center justify-between p-2'>
            <div className='flex items-center gap-2'>
              <img
                src={model.icon}
                alt={model.model}
                width={24}
                height={24}
                className='mr-2'
              />
              {model.enabled && (
                <Select defaultValue={aiSelectedModels[model.model].modelId} onValueChange={(value) => onSelectValue(model.model, value)} >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={aiSelectedModels[model.model].modelId} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Free</SelectLabel>
                      {model.subModel.map((subModel, subIndex) => subModel.premium === false && (
                        <SelectItem key={subIndex} value={subModel.id}>
                          {subModel.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectGroup className='px-3'>
                      <SelectLabel>Premium</SelectLabel>
                      {model.subModel.map((subModel, i) => subModel.premium === true && (
                        <SelectItem key={i} value={subModel.id} disabled={subModel.premium}>
                          {subModel.name} {subModel.premium && <FaLock className='inline-block ml-2 h-3 w-3' />}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>
            <div>
            {model.enabled ? <Switch
              checked={model.enabled}
              onCheckedChange={(checked) =>
                onToggleChange(model.model, checked)
              }
            />
            :<MessageSquare className='text-gray-400' onClick={() => onToggleChange(model.model, true)} />}
            </div>
          </div>
          {model.premium && model.enabled && (
            <div className='items-center justify-center text-center text-sm text-gray-500 h-full'>
              <button className='m-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50'>
  <FaLock className='inline-block mr-2 h-4 w-4' />
  Upgrade to unlock
</button>
            </div>
          )}
        </div>
      ))}

    </div>
  );
}

export default AiMultiModels;