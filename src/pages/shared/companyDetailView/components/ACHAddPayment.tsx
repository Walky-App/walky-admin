import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { Button } from 'primereact/button'
import { Checkbox, type CheckboxChangeEvent } from 'primereact/checkbox'
import { Image } from 'primereact/image'
import { InputText } from 'primereact/inputtext'
import { MultiSelect } from 'primereact/multiselect'

import { HtInputHelpText } from '../../../../components/shared/forms/HtInputHelpText'
import { HtInputLabel } from '../../../../components/shared/forms/HtInputLabel'
import { HtFileUpload } from '../../../../components/shared/general/HtFileUpload'
import { HtInfoTooltip } from '../../../../components/shared/general/HtInfoTooltip'
import { type ICompany } from '../../../../interfaces/company'
import { type IFacility } from '../../../../interfaces/facility'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'
import { requiredFieldsNoticeText } from '../../../../utils/formUtils'

interface IACHAddPaymentFormData {
  ach_account_number: string
  ach_routing_number: string
  ach_bank_name: string
  ach_account_name: string
  ach_is_approved: boolean
  isDefault: boolean
  facilities?: string[]
}

export const ACHAddPayment = ({
  setSelectedCompanyData,
}: {
  setSelectedCompanyData: React.Dispatch<React.SetStateAction<ICompany>>
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<IACHAddPaymentFormData>({
    ach_account_number: '',
    ach_routing_number: '',
    ach_bank_name: '',
    ach_account_name: '',
    ach_is_approved: false,
    isDefault: true,
    facilities: [],
  })
  const [facilitiesByCompany, setFacilitiesByCompany] = useState<IFacility[]>([])
  const [isCheckImageUploaded, setIsCheckImageUploaded] = useState(false)

  const { id } = useParams()
  const { showToast } = useUtils()

  useEffect(() => {
    const getAllFacilities = async () => {
      try {
        const response = await requestService({ path: `facilities/company/${id}` })
        if (response.ok) {
          const fetchedFacilities: IFacility[] = await response.json()
          setFacilitiesByCompany(fetchedFacilities)
        } else {
          setFacilitiesByCompany([])
        }
      } catch (error) {
        console.error('Error fetching facilities data:', error)
      }
    }

    getAllFacilities()
  }, [id])

  const handleAddACHPayment = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await requestService({
        path: `companies/${id}/add-ach`,
        method: 'POST',
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedCompanyData = await response.json()
        setSelectedCompanyData(updatedCompanyData)
        setFormData({
          ach_account_number: '',
          ach_routing_number: '',
          ach_bank_name: '',
          ach_account_name: '',
          ach_is_approved: false,
          isDefault: true,
          facilities: [],
        })

        showToast({ severity: 'success', summary: 'Success', detail: 'ACH Payment method added successfully' })
      }
    } catch (error) {
      console.error(error)
      showToast({ severity: 'error', summary: 'Error', detail: 'Error adding payment method' })
    } finally {
      setLoading(false)
    }
  }

  const handleFormUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleCheckboxChange = (e: CheckboxChangeEvent, fieldName: string) => {
    setFormData(prevState => ({
      ...prevState,
      [fieldName]: e.checked ?? false,
    }))
  }

  const uploaderTemplate = (
    <p>
      Drag-and-drop or choose your{' '}
      <strong>
        <u>Voided Check image</u>
      </strong>{' '}
      to upload. Maximum file size: 5MB
    </p>
  )

  return (
    <div className="p-fluid space-y-4 sm:space-y-12">
      <form onSubmit={handleAddACHPayment}>
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-12 sm:gap-y-10 md:grid-cols-3">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">Add Payment Information</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please take a moment to fill out payment information.
            </p>
            {requiredFieldsNoticeText}
          </div>
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-1 md:col-span-2">
            <div className="sm:col-span-3">
              <HtInfoTooltip message="The account number is the unique identifier for the bank account.">
                <HtInputLabel htmlFor="ach_account_number" asterisk labelText="Account Number" />
              </HtInfoTooltip>
              <InputText
                required
                id="ach_account_number"
                name="ach_account_number"
                value={formData.ach_account_number}
                onChange={handleFormUpdate}
                className="mt-2"
              />
            </div>

            <div className="sm:col-span-3">
              <HtInfoTooltip message="Name of the financial institution.">
                <HtInputLabel htmlFor="ach_bank_name" asterisk labelText="Bank Name" />
              </HtInfoTooltip>
              <InputText
                required
                id="ach_bank_name"
                name="ach_bank_name"
                value={formData.ach_bank_name}
                onChange={handleFormUpdate}
                className="mt-2"
              />
            </div>

            <div className="sm:col-span-3">
              <HtInfoTooltip message="The routing number is a nine-digit number that identifies the bank.">
                <HtInputLabel htmlFor="ach_routing_number" asterisk labelText="Routing Number" />
              </HtInfoTooltip>
              <InputText
                required
                id="ach_routing_number"
                name="ach_routing_number"
                value={formData.ach_routing_number}
                onChange={handleFormUpdate}
                className="mt-2"
              />
            </div>

            <div className="sm:col-span-3">
              <HtInfoTooltip message="Name of person or entity on the account.">
                <HtInputLabel htmlFor="ach_account_name" asterisk labelText="Account Name" />
              </HtInfoTooltip>
              <InputText
                required
                id="ach_account_name"
                name="ach_account_name"
                value={formData.ach_account_name}
                onChange={handleFormUpdate}
                className="mt-2"
              />
            </div>

            <div className="sm:col-span-3">
              <HtInfoTooltip message="All facilities related to this company which will be using this payment method to list jobs">
                <HtInputLabel htmlFor="facilities" asterisk labelText="Facilities" />
              </HtInfoTooltip>
              <MultiSelect
                id="facilities"
                value={formData.facilities}
                optionLabel="name"
                options={facilitiesByCompany}
                display="chip"
                selectAll
                selectAllLabel="Select All"
                onChange={e => setFormData(prevState => ({ ...prevState, facilities: e.value }))}
                placeholder="Select facilities"
                className="mt-2"
              />
              <HtInputHelpText
                fieldName="facilities"
                helpText="Please select all facilities which will be using this payment method as primary."
              />
            </div>

            <div className="sm:col-span-3">
              <HtInputLabel htmlFor="ach_check_upload" asterisk labelText="Upload Voided Check" />
              <HtFileUpload
                inputId="ach_check_upload"
                path={`companies/${id}/documents`}
                acceptMultipleFiles={false}
                emptyUploaderTemplate={uploaderTemplate}
                onUploadSuccess={async () => setIsCheckImageUploaded(true)}
                disabled={
                  formData.ach_account_name === '' ||
                  formData.ach_account_number === '' ||
                  formData.ach_bank_name === '' ||
                  formData.ach_routing_number === '' ||
                  formData.facilities?.length === 0
                }
              />
              <HtInputHelpText
                fieldName="ach_check_upload"
                helpText="Please upload a photo of a voided paper check for payment method verification. Example:"
              />
              <Image src="/assets/ht-voided-check-sample.png" alt="Voided Check" width="300" />
            </div>

            <div className="my-6 flex flex-col space-y-4 text-zinc-500 sm:col-span-3">
              <span className="underline underline-offset-2">Please accept the terms below:</span>
              <div className="flex items-center gap-3">
                <Checkbox
                  inputId="ach_is_approved"
                  name="ach_is_approved"
                  onChange={e => handleCheckboxChange(e, 'ach_is_approved')}
                  checked={formData.ach_is_approved}
                />
                <label htmlFor="ach_is_approved">
                  "I approve this ACH payment method to be used for future payments"
                </label>
              </div>
              <div>
                <Button
                  type="submit"
                  size="large"
                  label="Add ACH Payment Method"
                  disabled={!isCheckImageUploaded || !formData.ach_is_approved}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
