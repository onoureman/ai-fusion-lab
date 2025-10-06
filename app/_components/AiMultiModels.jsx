import React, { useState } from 'react';
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

function AiMultiModels() {
  const [AiModelLists, setAiModelLists] = useState(AiModelList);

  const onToggleChange = (model, value) => {
    setAiModelLists((prev) =>
      prev.map((m) =>
        m.model === model ? { ...m, enabled: value } : m
      )
    );
  };

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
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={model.subModel[0].name} />
                  </SelectTrigger>
                  <SelectContent>
                    {model.subModel.map((subModel, subIndex) => (
                      <SelectItem key={subIndex} value={subModel.id}>
                        {subModel.name}
                      </SelectItem>
                    ))}
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