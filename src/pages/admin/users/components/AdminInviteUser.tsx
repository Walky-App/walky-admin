import { useEffect, useState } from 'react'

import { format } from 'date-fns'

import { CheckCircleIcon } from '@heroicons/react/20/solid'

import { type ICompany } from '../../../../interfaces/company'
import { type IInvite } from '../../../../interfaces/invite'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'
import { roleTxt } from '../../../../utils/roleChecker'

const client_role = process.env.REACT_APP_CLIENT_ROLE as string

export const AdminInviteUser = () => {
  const [allInvites, setAllInvites] = useState([])
  const [allCompanies, setAllCompanies] = useState([])
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [formData, setFormData] = useState({ invitee: '', role: '', status: 'sent', company_id: '' } as IInvite)
  const { showToast } = useUtils()

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const response = await requestService({ path: 'invite/' })
        if (response.status === 200) {
          const jsonResponse = await response.json()
          setAllInvites(jsonResponse.invites)
          setAllCompanies(jsonResponse.companies)
        }
      } catch (error) {
        console.error('Error fetching invites:', error)
      }
    }
    fetchInvites()
  }, [])

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const response = await requestService({ path: 'invite/', method: 'POST', body: JSON.stringify(formData) })

      const jsonResponse = await response.json()
      if (response.status === 200) {
        setUpdateSuccess(true)
        setAllInvites(jsonResponse)
        showToast({ severity: 'success', summary: 'Success', detail: 'Invite sent successfully' })
        setTimeout(() => setUpdateSuccess(false), 5000)
      } else {
        showToast({ severity: 'error', summary: 'Error', detail: jsonResponse.message })
        throw new Error('Failed to invite user')
      }
    } catch (error) {
      console.error('Error inviting user:', error)
      setUpdateSuccess(false)
    }
  }

  return (
    <form onSubmit={handleForm}>
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-4">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email*
              </label>
              <div className="mt-2">
                <input
                  required
                  type="text"
                  id="email"
                  name="email"
                  autoComplete="email"
                  onChange={e => setFormData({ ...formData, invitee: e.target.value })}
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">
                Select Company Name*
              </label>
              <div className="mt-2">
                <select
                  required
                  id="company_id"
                  name="company_id"
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  onChange={e => setFormData({ ...formData, company_id: e.target.value })}>
                  <option value="">Select Company</option>
                  {allCompanies.map((company: ICompany) => (
                    <option key={company._id} value={company._id}>
                      {company.company_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">
                Select User's Role*
              </label>
              <div className="mt-2">
                <select
                  required
                  id="role"
                  name="role"
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-600 sm:max-w-xs sm:text-sm sm:leading-6">
                  <option value="">Select Role</option>
                  {/* <option value={admin_role}>Admin</option> */}
                  <option value={client_role}>Client</option>
                  {/* <option value={sales_role}>Sales</option> */}
                </select>
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
                <p className="text-sm font-medium text-green-800">Invitation sent successfully</p>
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
      {allInvites.length > 0 ? (
        <div className="mt-12">
          <ul className="mt-4 grid grid-cols-1 gap-y-4 sm:grid-cols-2">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Invitee</th>
                  <th className="text-left">Role</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Company</th>
                  <th className="text-left">Sent on</th>
                </tr>
              </thead>
              <tbody>
                {allInvites.map((invite: IInvite) => (
                  <tr key={invite._id}>
                    <td>{invite.invitee}</td>
                    <td>{roleTxt(invite.role)}</td>
                    <td>{invite.status}</td>
                    <td>{typeof invite.company_id === 'object' ? invite.company_id?.company_name : ''}</td>
                    <td>{format(invite?.createdAt ?? new Date(), 'P')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ul>
        </div>
      ) : null}
    </form>
  )
}
