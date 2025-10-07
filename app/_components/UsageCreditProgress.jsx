import React from 'react'
import { Progress } from '@/components/ui/progress'


function UsageCreditProgress() {
  return (
    <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Free Plan</h3>
        <p className="text-sm text-gray-600 mb-2">You have used 30 out of 100 credits this month.</p>
        <Progress value={33} />
        <p className="text-xs text-gray-500 mt-1">Credits reset on the 1st of each month.</p>
    </div>
  )
}

export default UsageCreditProgress