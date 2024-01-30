'use client'
import { useState, useEffect, useContext } from 'react'
import { OnboardingContext } from './layout'
import { FaCirclePlus } from 'react-icons/fa6'
import { MdOutlineEdit } from 'react-icons/md'
import AddFacility from '../AddFacility'

export default function ClientForm2() {
  const { company } = useContext(OnboardingContext)

  const [facilities, setFacilities] = useState([])

  const [open, setOpen] = useState(false)

  // const getFacilities = async () => {
  //   const res = await fetch(`${process.env.NEXT_PUBLIC_API}/facilities/company/${company._id}`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${user?.access_token}`,
  //     },
  //   })
  //   const data = await res.json()
  //   setFacilities(data)
  // }

  const addFacility = async e => {
    e.preventDefault()
    const form = e.target.parentElement.parentElement
    const formValues = {
      name: form.name.value,
      streetAddress: form.streetAddress.value,
      address2: form.address2.value,
      city: form.city.value,
      state: form.state.value,
      zipCode: form.zipCode.value,
      companyId: company._id,
    }

    await fetch(`${process.env.NEXT_PUBLIC_API}/facilities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${user?.access_token}`,
      },
      body: JSON.stringify(formValues),
    })
    closeForm()
  }

  const closeForm = () => {
    setOpen(false)
    getFacilities()
  }

  useEffect(() => {
    getFacilities()
  }, [])

  return (
    <div className="flex flex-col mt-10">
      <div className="flex flex-col">
        <h1 className="text-3xl flex justify-center">Add Locations</h1>
        <p className="flex justify-center mt-3">
          Add each facility where you will be hiring workers. You must add at least one, but you can add more locations
          later.
        </p>
      </div>

      <section className="mx-auto w-full lg:w-3/4 mt-8 space-y-4">
        <div className="flex gap-4 items-stretch">
          {facilities.length > 0 &&
            facilities.map(facility => (
              <div key={facility._id} className="flex-1">
                <div className="relative rounded-md font-semibold text-zinc-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-600 focus-within:ring-offset-2 hover:text-green-500">
                  <div className="mt-2 flex justify-center rounded-lg bg-zinc-100 px-6 py-10">
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-sm font-medium text-zinc-900">{facility.name}</h3>
                      </div>
                      <p className="mt-1 font-normal truncate text-sm text-zinc-500">{facility.streetAddress}</p>
                      <p className="mt-1 font-normal truncate text-sm text-zinc-500">
                        {facility.city}, {facility.state} {facility.zipCode}
                      </p>
                    </div>
                    <MdOutlineEdit className="h-6 w-6 flex-shrink-0 " />
                  </div>
                  <div></div>
                </div>
              </div>
            ))}

          <div className="flex-1" onClick={() => setOpen(true)}>
            <div className="relative cursor-pointer rounded-md font-semibold text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-600 focus-within:ring-offset-2 hover:text-green-500">
              <div className="mt-2 flex justify-center rounded-lg bg-zinc-100 px-6 py-10">
                <div className="text-center">
                  <FaCirclePlus className="mx-auto h-12 w-12 text-zinc-900" aria-hidden="true" />
                  <div className="mt-4 flex-col text-lg font-medium leading-6 text-zinc-600">
                    <p className="pl-1">Add New Facility</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <AddFacility open={open} setOpen={setOpen} handleSubmit={addFacility} />
        </div>
      </section>
    </div>
  )
}
