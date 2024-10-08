import { useEffect, useState } from 'react'

import { requestService } from '../../../services/requestServiceNew'
import { WeeklyOpenShiftsTable } from './components/WeeklyOpenShiftsTable'

export const AdminOpenShifsWeek = () => {
  const [openShifts, setOpenShifts] = useState([])

  useEffect(() => {
    const fetchOpenShifts = async () => {
      try {
        const response = await requestService({ path: 'shifts/open' })

        if (response.ok) {
          const data = await response.json()
          setOpenShifts(data)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchOpenShifts()
  }, [])
  return (
    <>
      <h1>Admin Open Shifts Week </h1>
      <WeeklyOpenShiftsTable data={openShifts} width="w-full" />
    </>
  )
}
