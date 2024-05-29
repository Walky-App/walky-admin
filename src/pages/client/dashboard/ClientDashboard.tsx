import { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'

import { DashboardHeader } from '../../../components/shared/dashboard'
import { GetTokenInfo } from '../../../utils/tokenUtil'

export type Status = string

export interface ITransaction {
  id: number
  name: string
  href: string
  amount: string
  currency: string
  status: Status
  date: string
  dateTime: string
}

export const ClientDashboard = () => {
  const navigate = useNavigate()
  const user = GetTokenInfo()

  useEffect(() => {
    if (user?.onboarding?.completed === false) navigate('/client/onboarding')
  }, [navigate, user?.onboarding?.completed])

  return (
    <div className="min-h-full">
      <main className="flex-1 pb-8">
        <DashboardHeader>
          <Button
            label="Facilities"
            severity="secondary"
            outlined
            size="small"
            onClick={() => navigate('/client/facilities')}
          />
          <Button label="My Jobs" size="small" onClick={() => navigate('/client/jobs')} />
        </DashboardHeader>
      </main>
    </div>
  )
}
