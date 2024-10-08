import { useState } from 'react'

import { Button } from 'primereact/button'

import { type ICompany } from '../../../../interfaces/company'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'

export const RequestACHApproval = ({
  selectedCompanyData,
  setSelectedCompanyData,
}: {
  selectedCompanyData: ICompany
  setSelectedCompanyData: React.Dispatch<React.SetStateAction<ICompany>>
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { showToast } = useUtils()

  const handleRequestACHApproval = async () => {
    setLoading(true)
    try {
      const response = await requestService({
        path: `companies/${selectedCompanyData._id}/request-ach`,
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('Failed to request ACH approval')
      }
      const updatedCompany: ICompany = await response.json()
      setSelectedCompanyData(updatedCompany)

      showToast({ severity: 'success', summary: 'Success', detail: 'ACH approval requested' })
    } catch (error) {
      console.error('Error requesting ACH approval: ', error)
      showToast({ severity: 'error', summary: 'Error', detail: 'Failed to request ACH approval' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-4 pb-12 sm:gap-y-10 md:grid-cols-3">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900">ACH Approval</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          You may add ACH as a method of payment by making the request here.
        </p>
        <p className="mt-1 text-sm leading-6 text-gray-600">Our team will reach out to you for more information.</p>
      </div>
      <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-1 md:col-span-2">
        <div className="my-6 flex flex-col space-y-4 text-zinc-500 sm:col-span-3">
          <div>
            <Button
              type="submit"
              size="large"
              label={
                selectedCompanyData.company_ach_requested === true ? 'ACH Approval Requested' : 'Request ACH Approval'
              }
              disabled={selectedCompanyData.company_ach_requested}
              onClick={handleRequestACHApproval}
              loading={loading}
            />
          </div>
          {selectedCompanyData.company_ach_requested === true ? (
            <p className="text-sm text-primary">Our team will reach out to you shortly.</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
