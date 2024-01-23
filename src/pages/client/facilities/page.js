import Link from 'next/link'
import FacilitiesHeader from './components/FacilitiesHeader'
import FacilitiesListItem from './components/FacilitiesListItem'
import { RequestService } from '@/services/RequestService'

export default async function Facilities() {
  const facilities = await RequestService('facilities/')
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 lg:px-8">
      <FacilitiesHeader title={'Facilities'} />

      <ul role="list" className="grid mt-10 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {facilities?.map(facility => (
          <Link href={`/client/facilities/${facility._id}`}>
            <FacilitiesListItem key={facility._id} facility={facility} />
          </Link>
        ))}
      </ul>
    </div>
  )
}
