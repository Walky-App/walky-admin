import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { Button } from 'primereact/button'
import { Checkbox, type CheckboxChangeEvent } from 'primereact/checkbox'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Message } from 'primereact/message'
import { MultiSelect } from 'primereact/multiselect'

import { HtInputHelpText } from '../../../../components/shared/forms/HtInputHelpText'
import { HtInputLabel } from '../../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../../components/shared/general/HtInfoTooltip'
import { type IFacility } from '../../../../interfaces/facility'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'
import { type ICompany } from '../../../../interfaces/company'

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
  const { id } = useParams()
  const [showDialog, setShowDialog] = useState(false)
  const { showToast } = useUtils()
  const [formData, setFormData] = useState<IACHAddPaymentFormData>({
    ach_account_number: '',
    ach_routing_number: '',
    ach_bank_name: '',
    ach_account_name: '',
    ach_is_approved: false,
    isDefault: false,
    facilities: [],
  })
  const [facilitiesByCompany, setFacilitiesByCompany] = useState<IFacility[]>([])

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

    try {
      const response = await requestService({
        path: `payment/${id}`,
        method: 'POST',
        body: JSON.stringify(formData),
      })

      showToast({ severity: 'success', summary: 'Success', detail: 'ACH Payment method added successfully' })
      if (response.ok) {
        const updatedCompanyData = await response.json()
        setSelectedCompanyData(updatedCompanyData)

      }
    } catch (error) {
      console.error(error)
      showToast({ severity: 'error', summary: 'Error', detail: 'Error adding payment method' })
    }
  }

  const handleFormUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleApprovedACH = (e: CheckboxChangeEvent) => {
    setFormData(prevState => ({
      ...prevState,
      ach_is_approved: e.checked ?? false,
    }))
  }
  const handleDefaultACHMethod = (e: CheckboxChangeEvent) => {
    setFormData(prevState => ({
      ...prevState,
      isDefault: e.checked ?? false,
    }))
  }

  return (
    <>
      <div className="p-fluid">
        <div className="space-y-4 sm:space-y-12">
          <form onSubmit={handleAddACHPayment}>
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-12 sm:gap-y-10 md:grid-cols-3">
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">Payment Information</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Please take a moment to fill out payment information.
                </p>
              </div>
              <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-1 md:col-span-2">
                <div className="sm:col-span-3">
                  <HtInfoTooltip message="The account number is the unique identifier for the bank account.">
                    <HtInputLabel htmlFor="ach_account_number" asterisk labelText="Account Number" />
                  </HtInfoTooltip>
                  <InputText
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
                    id="ach_routing_number"
                    name="ach_routing_number"
                    value={formData.ach_routing_number}
                    onChange={handleFormUpdate}
                    className="mt-2"
                  />
                </div>

                <div className="sm:col-span-3">
                  <HtInfoTooltip message="Reference name for the card in the application.">
                    <HtInputLabel htmlFor="ach_account_name" asterisk labelText="Account Name" />
                  </HtInfoTooltip>
                  <InputText
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

                <div className="my-6 flex flex-col space-y-2 text-sm text-zinc-500">
                  <span>Please accept the terms below:</span>
                  <div>
                    <Checkbox
                      inputId="ach_is_approved"
                      name="ach_is_approved"
                      onChange={e => handleApprovedACH(e)}
                      checked={formData.ach_is_approved}
                    />
                    <label htmlFor="ach_is_approved" className="ml-2">
                      I approve this ACH payment method to be used for future payments
                    </label>
                  </div>
                  <div>
                    <Checkbox
                      inputId="isDefault"
                      name="isDefault"
                      onChange={e => handleDefaultACHMethod(e)}
                      checked={formData.isDefault}
                    />
                    <label htmlFor="isDefault" className="ml-2">
                      Select as Default Payment Method
                    </label>
                  </div>
                  <div>
                    <Button type="submit" severity="success" className="mt-2">
                      Add ACH Payment Method
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6" />
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-4  border-gray-900/10 pb-12 sm:gap-y-10 md:grid-cols-3">
        <h2 className="text-base font-semibold leading-7 text-gray-900">Delete Payment Method</h2>
        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-1 md:col-span-2">
          <div className="flex flex-col items-center sm:col-span-3">
            <Dialog
              visible={showDialog}
              style={{ width: '450px' }}
              header="Confirm"
              modal
              // footer={renderDialogFooter()}
              onHide={() => setShowDialog(false)}>
              Are you sure you want to delete this payment method?
            </Dialog>
            <Message
              severity="error"
              text="This will delete this payment method from the company. This action cannot be undone."
            />
            <Button severity="danger" className="mt-2" onClick={() => setShowDialog(true)}>
              Delete Payment Method
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
