import React, { useEffect, useState } from 'react'

const usersQuantity = 100
const jobsQuantity = 200
const facilitiesQuantity = 50

interface IStat {
  name: string
  stat: number
}

const statsArray: IStat[] = [
  { name: 'Total Users', stat: usersQuantity },
  { name: 'Total Jobs', stat: jobsQuantity },
  { name: 'Total Facilities', stat: facilitiesQuantity },
]

export const StatsDisplay = () => {
  const [stats, setStats] = useState<IStat[]>(statsArray)
  //   const memoFacilitiesData = React.useMemo(() => facilitiesData, [facilitiesData])

  //   useEffect(() => {
  //     setStats([
  //       { name: 'Total Users', stat: usersQuantity },
  //       { name: 'Total Jobs', stat: jobsQuantity },
  //       { name: 'Total Facilities', stat: facilitiesQuantity },
  //     ])
  //   }, [memoFacilitiesData])

  return (
    <div>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map(item => (
          <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
