import { useState, useEffect } from 'react'

import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { Avatar } from 'primereact/avatar'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { Rating } from 'primereact/rating'
import { classNames } from 'primereact/utils'

import { type IApplicant } from '../../../../interfaces/job'
import { requestService } from '../../../../services/requestServiceNew'

interface IPanelPending {
  role: string
  applicants: IApplicant[] | undefined
  id: string | undefined
  onSubmit: (user_id: string) => void
  handleAccept: (user_id: string) => void
  handleReject: (user_id: string, rejection_reason: string) => void
}

const defaultValues = { user_id: '' }

const rejectionReasons = [
  { name: 'Not enough experience', value: 'Not enough experience' },
  { name: 'Not enough qualifications', value: 'Not enough qualifications' },
  { name: 'Previous bad experience', value: 'Previous bad experience' },
  { name: 'Too expensive', value: 'Too expensive' },
  { name: 'Low ratings', value: 'Low ratings' },
]

export const PanelPendingContent = ({ role, applicants, id, onSubmit, handleAccept, handleReject }: IPanelPending) => {
  const [rejectionReason, setRejectionReason] = useState<string>()
  const [potentialApplicants, setPotentialApplicants] = useState<IApplicant[]>([])
  const [visibleDialog, setVisibleDialog] = useState<string | null>(null)

  useEffect(() => {
    const getPotentialApplicants = async () => {
      try {
        const response = await requestService({ path: `jobs/${id}/get-potential-applicants` })
        if (response.status === 200) {
          const jsonResponse = await response.json()
          setPotentialApplicants(jsonResponse)
        }
      } catch (error) {
        console.error('Error fetching potential applicants', error)
      }
    }
    if (role === 'admin') {
      getPotentialApplicants()
    }
  }, [role, id])

  const { control, handleSubmit, reset } = useForm({ defaultValues })

  return (
    <>
      {role === 'admin' ? (
        <div className="mt-4 flex justify-center space-x-4 md:justify-end">
          <Controller
            name="user_id"
            control={control}
            rules={{ required: 'Employee selection is required' }}
            render={({ field, fieldState }) => (
              <Dropdown
                id={field.name}
                value={field.value}
                placeholder="Select an applicant"
                name="employee"
                className={classNames({ 'p-invalid': fieldState.error }, 'md:w-1/3')}
                onChange={e => field.onChange(e.target.value)}
                options={potentialApplicants.map((potentialApplicant: IApplicant) => ({
                  value: potentialApplicant._id,
                  label: `${potentialApplicant.first_name} ${potentialApplicant.last_name}`,
                }))}
                optionLabel="label"
                filter
              />
            )}
          />
          <Button
            type="submit"
            label="Add New Applicant"
            onClick={handleSubmit(data => {
              onSubmit(data.user_id)
              reset({ user_id: '' })
            })}
          />
        </div>
      ) : null}
      <div className="mt-4 border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
        <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="ml-4">
            <p className="text-base text-gray-500">
              You can reject the applicants within X hours of the worker accepted the job. If no reject is done in X
              hours then worker is automatically accepted and then the contract is created automatically. you and
              applicant both are notified about the contract.
            </p>
          </div>
          {/* <div className="ml-4 mt-4 flex-shrink-0">
            {applicants &&
            applicants.some((applicant: IApplicant) => !applicant.is_approved && applicant.rejection_reason === '') ? (
              <Button label="Accept All" severity="success" size="small" onClick={handleAcceptAll} />
            ) : null}
          </div> */}
        </div>

        <ul className="divide-y divide-gray-100">
          {applicants?.some(applicant => applicant.is_approved === false) ?? false ? (
            applicants?.map((applicant: IApplicant) => {
              if (applicant.is_approved || applicant.rejection_reason !== '') {
                return null
              }
              return (
                <li
                  key={applicant.user._id}
                  className="relative flex flex-col justify-between gap-x-6 py-5 sm:flex-row">
                  <div className="flex min-w-0 gap-x-4">
                    <Avatar
                      label={applicant?.user.first_name[0]}
                      image={applicant?.user.avatar}
                      size="large"
                      shape="circle"
                    />

                    <div className="min-w-0 flex-auto">
                      {role === 'admin' ? (
                        <Link
                          to={`/admin/users/${applicant?.user?._id}`}
                          className="text-base font-semibold leading-6 text-gray-900 hover:underline">
                          <span className="absolute inset-x-0 -top-px bottom-0" />
                          {applicant?.user.first_name + ' ' + applicant.user.last_name}
                        </Link>
                      ) : (
                        applicant?.user.first_name + ' ' + applicant.user.last_name[0] + '.'
                      )}

                      {applicant.user.score_rating ?? 0 ? (
                        <Rating value={applicant.user.score_rating} readOnly cancel={false} />
                      ) : (
                        <div className="text-sm font-semibold text-gray-500">No ratings yet</div>
                      )}
                      <p className="mt-1 flex text-sm leading-5 text-gray-500" />
                    </div>
                  </div>
                  <div className="mt-4 flex shrink-0 flex-col items-center gap-x-4 sm:mt-0 sm:flex-row">
                    <div className="flex flex-row items-end">
                      <Button
                        size="small"
                        label="Accept"
                        severity="success"
                        onClick={() => {
                          handleAccept(applicant.user._id)
                        }}
                      />
                      <Button
                        size="small"
                        label="Reject"
                        severity="danger"
                        outlined
                        className="ml-2"
                        onClick={() => {
                          setVisibleDialog(applicant.user._id)
                        }}
                      />

                      <Dialog
                        header={
                          <div className="align-items-center justify-content-center inline-flex gap-2">
                            <Avatar
                              label={applicant?.user.first_name[0]}
                              image={applicant?.user.avatar}
                              size="large"
                              shape="circle"
                            />

                            <span className="white-space-nowrap font-bold">
                              {applicant.user.first_name} {applicant.user.last_name[0]}.
                            </span>
                            {applicant.user.score_rating ? (
                              <Rating value={applicant.user.score_rating} readOnly cancel={false} />
                            ) : (
                              <div className="text-sm font-semibold text-gray-500">No ratings yet</div>
                            )}
                          </div>
                        }
                        visible={visibleDialog === applicant.user._id}
                        style={{ width: '50vw' }}
                        onHide={() => setVisibleDialog(null)}
                        footer={
                          <Button
                            size="small"
                            label="Reject Applicant"
                            severity="secondary"
                            className="ml-2"
                            onClick={() => {
                              handleReject(applicant.user._id, rejectionReason ?? '')
                            }}
                          />
                        }>
                        <p>
                          Please select a reason for rejecting this applicant. Note that the employee would not be able
                          to apply for this job again.
                        </p>
                        <Dropdown
                          value={rejectionReason}
                          onChange={e => setRejectionReason(e.value)}
                          options={rejectionReasons}
                          optionLabel="name"
                          placeholder="Select a Rejection Reason"
                          className="md:w-14rem mb-4 mt-4 w-full"
                        />
                      </Dialog>
                    </div>
                  </div>
                </li>
              )
            })
          ) : (
            <p>There are no new applicants for this job.</p>
          )}
        </ul>
      </div>
    </>
  )
}
