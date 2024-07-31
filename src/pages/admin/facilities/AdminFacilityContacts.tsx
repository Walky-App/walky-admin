/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { CheckCircleIcon } from '@heroicons/react/20/solid'

import { SubHeader } from '../../../components/shared/SubHeader'
import { RequestService } from '../../../services/RequestService'
import { formatPhoneNumber } from '../../../utils/dataUtils'
import { roleChecker } from '../../../utils/roleChecker'
import { clientFacilitiesLink } from '../../client/facilities/clientSubHeaderLinks'
import { adminFacilitiesLinks } from './adminFacilitySubHeaderLinks'

export const AdminFacilityContacts = () => {
  const { facilityId } = useParams()
  const [currentContact, setCurrentContact] = useState<string>('')
  const [facilityContacts, setFacilityContacts] = useState<any>([])
  const [facilityName, setFacilityName] = useState<string>('')
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [facilityFound, setFacilityFound] = useState<any>({})
  const role = roleChecker()

  useEffect(() => {
    const getFacilityContacts = async () => {
      try {
        const facilityFound = await RequestService(`facilities/${facilityId}`)
        const facilityContacts = facilityFound.contacts
        const facilityName = facilityFound.name
        setFacilityContacts(facilityContacts)
        setFacilityFound(facilityFound)
        setFacilityName(facilityName)
      } catch (error) {
        console.error('Error fetching facility contacts', error)
      }
    }
    getFacilityContacts()
  }, [facilityId])

  const handleAddContactForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget

    const target = e.target as typeof e.target & {
      first_name: { value: string }
      last_name: { value: string }
      role: { value: string }
      phone_number: { value: string }
      email: { value: string }
    }

    const formData = {
      first_name: target.first_name.value,
      last_name: target.last_name.value,
      role: target.role.value,
      phone_number: target.phone_number.value,
      email: target.email.value,
    }

    const res = await RequestService(`/facilities/${facilityId}/contacts`, 'PATCH', formData)
    if (res) {
      setFacilityContacts(res)
      setUpdateSuccess(true)
      setTimeout(() => setUpdateSuccess(false), 5000) // Hide message after 5 seconds
      form.reset()
    } else {
      console.error('Error adding contact')
    }
  }

  const handleEditButtonClick = (contact: string) => {
    setCurrentContact(contact)
    setOpenModal(true)
  }

  return (
    <>
      {facilityFound ? (
        <SubHeader data={facilityFound} links={role === 'admin' ? adminFacilitiesLinks : clientFacilitiesLink} />
      ) : null}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Facility contacts</h1>
        </div>
        <div className="mb-12 w-full border-b border-gray-200 pb-5 pt-10">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Add contact: </h3>
        </div>

        <form onSubmit={handleAddContactForm}>
          <div className="space-y-12">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
                <div className="sm:col-span-3">
                  <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-gray-900">
                    First name*
                  </label>
                  <div className="mt-2">
                    <input
                      required
                      type="text"
                      name="first_name"
                      id="first_name"
                      autoComplete="given-name"
                      className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-gray-900">
                    Last name*
                  </label>
                  <div className="mt-2">
                    <input
                      required
                      type="text"
                      name="last_name"
                      id="last_name"
                      autoComplete="family-name"
                      className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email address*
                  </label>
                  <div className="mt-2">
                    <input
                      required
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="phone-number" className="block text-sm font-medium leading-6 text-gray-900">
                    Contact Phone Number*
                  </label>
                  <div className="mt-2">
                    <input
                      required
                      type="tel"
                      name="phone_number"
                      id="phone-number"
                      autoComplete="tel"
                      className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                      pattern="[0-9]{10}"
                      placeholder="9999999999"
                      title="Phone number should be in the format: 9999999999"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">
                    Title*
                  </label>
                  <div className="mt-2">
                    <input
                      required
                      type="text"
                      name="role"
                      id="role"
                      className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            {updateSuccess ? (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">Contact successfully added</p>
                  </div>
                  <div className="ml-auto pl-3">
                    <div className="-mx-1.5 -my-1.5" />
                  </div>
                </div>
              </div>
            ) : null}
            <button
              type="submit"
              className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
              Submit
            </button>
          </div>
        </form>

        {/* Contacts Table */}

        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">List of contacts</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all facility contacts including owner, AP, Onsite and others.
            </p>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              {facilityContacts && facilityContacts.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                        First Name
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                        Last Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Title
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Email
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Phone number
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {facilityContacts.map((singleContact: any) => (
                      <tr key={singleContact._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          {singleContact.first_name}
                        </td>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          {singleContact.last_name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{singleContact.role}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{singleContact.email}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatPhoneNumber(singleContact.phone_number)}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          <button
                            onClick={() => handleEditButtonClick(singleContact)}
                            disabled
                            className="text-green-600 hover:text-green-900"
                            type="button"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                // No contacts found
                <div className="flex h-96 items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-3xl font-semibold text-gray-900">No contacts found</h2>
                    <p className="mt-1 text-sm text-gray-500">Add a contact to the facility</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
