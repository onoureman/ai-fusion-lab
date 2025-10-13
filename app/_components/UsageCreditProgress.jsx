import React from 'react'
import { Progress } from '@/components/ui/progress'



function UsageCreditProgress({remainingToken}) {
  return (
    <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Free Plan</h3>
        <p className="text-sm text-gray-600 mb-2">{5-remainingToken}/5 credits used.</p>
        <Progress value={100-(5-remainingToken / 5) * 100} />
        
    </div>
  )
}

export default UsageCreditProgress