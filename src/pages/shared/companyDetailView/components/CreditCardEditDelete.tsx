import { useEffect, useState } from 'react'

import { Button } from 'primereact/button'
import { Chip } from 'primereact/chip'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Message } from 'primereact/message'
import { MultiSelect } from 'primereact/multiselect'
import { Password } from 'primereact/password'

import { HTLoadingLogo } from '../../../../components/shared/HTLoadingLogo'
import { HtInputHelpText } from '../../../../components/shared/forms/HtInputHelpText'
import { HtInputLabel } from '../../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../../components/shared/general/HtInfoTooltip'
import { type ICompanyPaymentMethod, type ICompany } from '../../../../interfaces/company'
import { type IFacility } from '../../../../interfaces/facility'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'
import { roleChecker } from '../../../../utils/roleChecker'

export const CreditCardEditDelete = ({
  companyId,
  selectedPaymentId,
  setSelectedPaymentId,
  setSelectedCompanyData,
}: {
  companyId: string
  selectedPaymentId: string
  setSelectedPaymentId: (paymentId: string) => void
  setSelectedCompanyData: (company: ICompany) => void
}) => {
  const [paymentMethod, setPaymentMethod] = useState<ICompanyPaymentMethod | null>(null)
  const [facilitiesByCompany, setFacilitiesByCompany] = useState<IFacility[]>([])
  const [showDialog, setShowDialog] = useState(false)

  const { showToast } = useUtils()
  const role = roleChecker()

  useEffect(() => {
    const fetchPaymentMethod = async () => {
      try {
        if (!selectedPaymentId) return
        const response = await requestService({ path: `companies/${companyId}/payment-method/${selectedPaymentId}` })
        if (response.ok) {
          const paymentMethod: ICompanyPaymentMethod = await response.json()
          setPaymentMethod(paymentMethod)
        } else {
          console.error('Failed to fetch payment method')
        }
      } catch (error) {
        console.error('Error fetching payment method:', error)
      }
    }

    fetchPaymentMethod()
  }, [companyId, selectedPaymentId])

  useEffect(() => {
    const getAllFacilities = async () => {
      try {
        const response = await requestService({ path: `facilities/company/${companyId}` })
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
  }, [companyId])

  const handleDeletePaymentMethod = async () => {
    try {
      if (paymentMethod?.is_default)
        throw new Error('Please set another payment method as default before deleting this one.')
      const response = await requestService({
        path: `companies/${companyId}/payment-method/${selectedPaymentId}`,
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete payment method')
      }

      const responseData = await response.json()
      setSelectedCompanyData(responseData)
      setShowDialog(false)
      setSelectedPaymentId('')
      showToast({ severity: 'success', summary: 'Success', detail: 'Payment method deleted successfully' })
    } catch (error) {
      console.error('Error deleting payment method', error)
      const errorMessage = error instanceof Error ? error.message : 'Error deleting payment method'
      showToast({ severity: 'error', summary: 'Error', detail: errorMessage ?? 'Error deleting payment method' })
      setShowDialog(false)
    }
  }

  const setDefaultPayment = async () => {
    try {
      const response = await requestService({
        path: `companies/${companyId}/payment/${selectedPaymentId}/set-as-default`,
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('Failed to set payment method as default')
      }
      const responseData: ICompany = await response.json()
      setSelectedCompanyData(responseData)
      setSelectedPaymentId('')
      showToast({ severity: 'success', summary: 'Success', detail: 'Payment method set as default' })
    } catch (error) {
      console.error('Error setting default payment method: ', error)
      showToast({ severity: 'error', summary: 'Error', detail: 'Error setting default payment method' })
    }
  }

  const renderDialogFooter = () => {
    return (
      <div>
        <Button severity="secondary" label="No" text outlined onClick={() => setShowDialog(false)} />
        <Button severity="danger" label="Yes" onClick={handleDeletePaymentMethod} />
      </div>
    )
  }

  return paymentMethod !== null ? (
    <>
      <div className="p-fluid">
        <div className="space-y-4 sm:space-y-12">
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-12 sm:gap-y-10 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">Payment Information</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Please take a moment to fill out payment information.
              </p>
            </div>
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-1 md:col-span-2">
              {paymentMethod.payment_method === 'CC' ? (
                <>
                  <div className="sm:col-span-3">
                    <HtInfoTooltip message="A credit card number is a unique identifier assigned to the card.">
                      <HtInputLabel htmlFor="card_number" asterisk labelText="Card Number" />
                    </HtInfoTooltip>
                    <InputText
                      id="card_number"
                      value={paymentMethod.payment_info.card_number}
                      className="mt-2"
                      disabled
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <HtInfoTooltip message="Reference name for the card in the application.">
                      <HtInputLabel htmlFor="card_name" asterisk labelText="Card Name" />
                    </HtInfoTooltip>
                    <InputText id="card_name" value={paymentMethod.payment_info.card_name} className="mt-2" disabled />
                  </div>
                  <div className="sm:col-span-3">
                    <HtInfoTooltip message="Provide billing address.">
                      <HtInputLabel htmlFor="address" asterisk labelText="Billing Address" />
                    </HtInfoTooltip>
                    <InputText id="address" value={paymentMethod.payment_info.address} className="mt-2" disabled />
                  </div>
                </>
              ) : null}

              {paymentMethod.payment_method === 'ACH' ? (
                <>
                  <div className="sm:col-span-3">
                    <HtInfoTooltip message="The routing number is a nine-digit number that identifies the bank.">
                      <HtInputLabel htmlFor="ach_account_name" asterisk labelText="Account Name" />
                    </HtInfoTooltip>
                    <InputText
                      id="ach_account_name"
                      value={paymentMethod.payment_info.ach_account_name}
                      className="mt-2"
                      disabled
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <HtInfoTooltip message="Name of the bank.">
                      <HtInputLabel htmlFor="ach_bank_name" asterisk labelText="Bank Name" />
                    </HtInfoTooltip>
                    <InputText
                      id="ach_bank_name"
                      value={paymentMethod.payment_info.ach_bank_name}
                      className="mt-2"
                      disabled
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <HtInfoTooltip message="The account number is the unique identifier for the bank account.">
                      <HtInputLabel htmlFor="ach_account_number" asterisk labelText="Account Number" />
                    </HtInfoTooltip>
                    <Password
                      id="ach_account_number"
                      value={paymentMethod.payment_info.ach_account_number}
                      className="mt-2"
                      disabled
                      toggleMask
                      pt={{
                        panel: { className: 'hidden' },
                      }}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <HtInfoTooltip message="The routing number is a nine-digit number that identifies the bank.">
                      <HtInputLabel htmlFor="routing_number" asterisk labelText="Routing Number" />
                    </HtInfoTooltip>
                    <Password
                      id="ach_routing_number"
                      value={paymentMethod.payment_info.ach_routing_number}
                      className="mt-2"
                      disabled
                      toggleMask
                      pt={{
                        panel: { className: 'hidden' },
                      }}
                    />
                  </div>
                </>
              ) : null}

              <div className="sm:col-span-3">
                <HtInfoTooltip message="All facilities related to this company which will be using this payment method to list jobs">
                  <HtInputLabel htmlFor="facilities" asterisk labelText="Facilities" />
                </HtInfoTooltip>
                <MultiSelect
                  id="facilities"
                  value={paymentMethod.facilities}
                  optionLabel="name"
                  options={facilitiesByCompany}
                  display="chip"
                  selectAll
                  selectAllLabel="Select All"
                  disabled
                  placeholder="Select facilities"
                  className="mt-2"
                />
                <HtInputHelpText
                  fieldName="facilities"
                  helpText="All facilities using this payment method as primary."
                />
              </div>

              <div className="sm:col-span-3">
                {paymentMethod.is_default === true ? (
                  <Chip className="ml-2" label="Default Payment Method" icon="pi pi-check" />
                ) : (
                  <Button label="Set as Default" severity="secondary" raised onClick={setDefaultPayment} />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6" />
      </div>
      {role === 'admin' ? (
        <div className="grid grid-cols-1 gap-x-8 gap-y-4  border-gray-900/10 pb-12 sm:gap-y-10 md:grid-cols-3">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Delete Payment Method</h2>
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-1 md:col-span-2">
            <div className="flex flex-col items-center sm:col-span-3">
              <Dialog
                visible={showDialog}
                style={{ width: '450px' }}
                header="Confirm"
                modal
                draggable={false}
                footer={renderDialogFooter()}
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
      ) : null}
    </>
  ) : (
    <HTLoadingLogo />
  )
}
