import { useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'

import { DashboardHeader } from '../../../components/shared/dashboard'
import { useAuth } from '../../../contexts/AuthContext'

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

// interface ICounts {
//   facilities: string
//   jobs: string
//   users: string
// }

export const EmployeeDashboard = () => {
  // const [counts, setCounts] = useState<ICounts | null>()
  // const [facilities, setFacilities] = useState<IFacility[]>([])

  const navigate = useNavigate()

  const { user } = useAuth()

  useEffect(() => {
    if (user?.isOnboarded === false) {
      navigate('/employee/onboarding')
    }
  }, [])

  // useEffect(() => {
  //   const getCounts = async () => {
  //     try {
  //       const response = await RequestService('/dashboard')
  //       setCounts({
  //         facilities: response.facilities,
  //         jobs: response.jobs,
  //         users: response.users,
  //       })
  //     } catch (error) {
  //       console.error('error', error)
  //     }
  //   }

  //   getCounts()

  //   const get5Facilities = async () => {
  //     try {
  //       const response = await RequestService('/facilities?limit=5&sortField=createdAt&sortOrder=desc')
  //       setFacilities(response)
  //     } catch (error) {
  //       console.error('error', error)
  //     }
  //   }

  //   get5Facilities()
  // }, [])

  // const statCardsData: IStatCard[] = [
  //   { name: 'Users', href: '/admin/users', icon: UserCircleIcon, amount: counts?.users },
  //   { name: 'Facilities', href: '/admin/facilities', icon: InformationCircleIcon, amount: counts?.facilities },
  //   { name: 'Jobs', href: '/admin/jobs', icon: BriefcaseIcon, amount: counts?.jobs },
  //   // More items...
  // ]

  // const transactionsData: ITransaction[] = [
  //   {
  //     id: 1,
  //     name: facilities[0]?.name,
  //     href: '#',
  //     amount: '$20,000',
  //     currency: 'USD',
  //     status: facilities[0]?.isApproved ? 'Approved' : 'Pending',
  //     date: new Date(facilities[0]?.createdAt).toLocaleDateString(),
  //     dateTime: facilities[0]?.createdAt,
  //   },
  // ]

  // const facilitiesData: IRecentInfoCard[] = [
  //   {
  //     id: 1,
  //     name: facilities[0]?.name,
  //     imageUrl: facilities[0]?.images[0]?.url,
  //     data: {
  //       date: new Date(facilities[0]?.createdAt).toLocaleDateString(),
  //       dateTime: facilities[0]?.createdAt,
  //       address: facilities[0]?.address,
  //       status: facilities[0]?.isApproved ? 'Approved' : 'Pending',
  //     },
  //   },
  //   {
  //     id: 2,
  //     name: facilities[1]?.name,
  //     imageUrl: facilities[1]?.images[1]?.url,
  //     data: {
  //       date: new Date(facilities[1]?.createdAt).toLocaleDateString(),
  //       dateTime: facilities[1]?.createdAt,
  //       address: facilities[1]?.address,
  //       status: facilities[1]?.isApproved ? 'Approved' : 'Pending',
  //     },
  //   },
  //   {
  //     id: 3,
  //     name: facilities[2]?.name,
  //     imageUrl: facilities[2]?.images[2]?.url,
  //     data: {
  //       date: new Date(facilities[2]?.createdAt).toLocaleDateString(),
  //       dateTime: facilities[2]?.createdAt,
  //       address: facilities[2]?.address,
  //       status: facilities[2]?.isApproved ? 'Approved' : 'Pending',
  //     },
  //   },
  // ]

  return (
    <div className="min-h-full">
      <main className="flex-1 pb-8">
        <DashboardHeader>
          <Button
            label="My Jobs"
            severity="secondary"
            outlined
            size="small"
            onClick={() => navigate('/employee/myjobs')}
          />
          <Button label="Jobs" size="small" onClick={() => navigate('/employee/jobs')} />
        </DashboardHeader>

        {/* <div className="mt-8"> */}

        {/* <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg font-medium leading-6 text-gray-900">Overview</h2>
            <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <StatCards cards={statCardsData} />
            </div>
          </div> */}

        {/* <h2 className="mx-auto mt-8 max-w-6xl px-4 text-lg font-medium leading-6 text-gray-900 sm:px-6 lg:px-8">
            Recent activity
          </h2>
          <RecentActivityTable transactions={transactionsData} /> */}

        {/* Recent client list*/}
        {/* <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium leading-6 text-gray-900">Recently added</h2>
                <Button text label="View all" outlined size="small" onClick={() => navigate('/admin/facilities')} />
              </div>
              <RecentInfoCards items={facilitiesData} />
            </div>
          </div> */}
        {/* </div> */}
      </main>
    </div>
  )
}
