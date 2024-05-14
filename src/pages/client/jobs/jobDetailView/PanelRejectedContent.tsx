import { Link } from 'react-router-dom'

import { Avatar } from 'primereact/avatar'
import { Button } from 'primereact/button'
import { Rating } from 'primereact/rating'
import { Tag } from 'primereact/tag'

import { type IApplicant } from '../../../../interfaces/job'

interface IPanelRejected {
  role: string
  applicants?: IApplicant[] | undefined
  handleReinstate: (user_id: string) => Promise<void>
}

export const PanelRejectedContent = ({ role, applicants, handleReinstate }: IPanelRejected) => {
  return (
    <div>
      <div className="mt-4 border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
        <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="ml-4 mt-4">
            <p className="mt-1 text-base text-gray-500">
              This is the list of all applicants who have been rejected. You can reinstate them if you wish by clicking
              on the Cancel button. This action will move the applicant back to the pending list.
            </p>
          </div>
          <div className="ml-4 mt-4 flex-shrink-0" />
        </div>
        <ul className="divide-y divide-gray-100">
          {applicants
            ? applicants?.map((applicant?: IApplicant) => {
                if (applicant?.is_approved || applicant?.rejection_reason === '') {
                  return null
                }
                return (
                  <li
                    key={applicant?.user._id}
                    className="relative flex flex-col justify-between gap-x-6 py-5 sm:flex-row">
                    <div className="flex min-w-0 gap-x-4">
                      <Avatar
                        label={applicant?.user.first_name[0]}
                        image={applicant?.user.avatar}
                        size="large"
                        shape="circle"
                      />

                      <div className="min-w-0 flex-auto">
                        <p className="text-base font-semibold leading-6 text-gray-900">
                          {role === 'admin' ? (
                            <Link
                              to={`/admin/users/${applicant?.user?._id}`}
                              className="text-base font-semibold leading-6 text-gray-900 hover:underline">
                              <span className="absolute inset-x-0 -top-px bottom-0" />
                              {applicant?.user.first_name + ' ' + applicant?.user.last_name}
                            </Link>
                          ) : (
                            applicant?.user.first_name + ' ' + applicant?.user.last_name[0] + '.'
                          )}
                          <Tag className="mb-2 ml-2" value="Rejected" severity="danger" />
                          {applicant?.user.score_rating ? (
                            <Rating value={applicant?.user.score_rating} readOnly cancel={false} />
                          ) : (
                            <div className="text-sm font-semibold text-gray-500">No ratings yet</div>
                          )}
                          Reason for rejection: {applicant?.rejection_reason}
                        </p>
                        <p className="mt-1 flex text-sm leading-5 text-gray-500" />
                      </div>
                    </div>
                    <div className="mt-4 flex shrink-0 flex-col items-center gap-x-4 sm:mt-0 sm:flex-row">
                      <div className="flex flex-row items-end">
                        <Button
                          size="small"
                          label="Move back to Pending"
                          severity="warning"
                          onClick={() => {
                            handleReinstate(applicant?.user._id ?? '')
                          }}
                        />
                      </div>
                    </div>
                  </li>
                )
              })
            : null}
        </ul>
      </div>
    </div>
  )
}
