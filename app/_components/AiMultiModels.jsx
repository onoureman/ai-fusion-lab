import React,{useState} from 'react'
import AiModelList from './../../shared/AiModelList.json'


function AiMultiModels() {
    const [aiModelList, setAiModelList] = useState(AiModelList)
  return (
    <div className='text-center text-gray-500 dark:text-gray-400'>
      <p>AI Multi Models Component Placeholder</p>
    </div>
  )
}

export default AiMultiModels