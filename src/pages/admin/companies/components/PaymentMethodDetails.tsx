import { useEffect, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputMask } from 'primereact/inputmask'
import { InputText } from 'primereact/inputtext'
import { Message } from 'primereact/message'
import { MultiSelect } from 'primereact/multiselect'

import { HTLoadingLogo } from '../../../../components/shared/HTLoadingLogo'
import { HtInputHelpText } from '../../../../components/shared/forms/HtInputHelpText'
import { HtInputLabel } from '../../../../components/shared/forms/HtInputLabel'
import { HtInfoTooltip } from '../../../../components/shared/general/HtInfoTooltip'
import { type IFacility } from '../../../../interfaces/facility'
import { requestService } from '../../../../services/requestServiceNew'
import { useUtils } from '../../../../store/useUtils'
import { roleChecker } from '../../../../utils/roleChecker'
import { type IPaymentMethod } from './AdminCompanyAddPaymentMethod'

export const PaymentMethodDetails = () => {
  const { id, paymentId } = useParams()
  const [paymentMethod, setPaymentMethod] = useState<IPaymentMethod | null>(null)
  const [facilitiesByCompany, setFacilitiesByCompany] = useState<IFacility[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const { showToast } = useUtils()
  const navigate = useNavigate()
  const role = roleChecker()

  useEffect(() => {
    const fetchPaymentMethod = async () => {
      try {
        const response = await requestService({ path: `companies/${id}/payment-method/${paymentId}` })
        if (response.ok) {
          const paymentMethod: IPaymentMethod = await response.json()
          setPaymentMethod(paymentMethod)
        } else {
          console.error('Failed to fetch payment method')
        }
      } catch (error) {
        console.error('Error fetching payment method:', error)
      }
    }

    fetchPaymentMethod()
  }, [id, paymentId])

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

  const handleDeletePaymentMethod = async () => {
    try {
      const response = await requestService({
        path: `companies/${id}/payment-method/${paymentId}`,
        method: 'DELETE',
      })

      showToast({ severity: 'success', summary: 'Success', detail: 'Payment method deleted successfully' })
      if (response.ok) {
        await response.json()

        if (role === 'client') {
          navigate(`/client/companies/${id}/payment`)
        } else {
          navigate(`/admin/companies/${id}/payment`)
        }
      }
    } catch (error) {
      console.error(error)
      showToast({ severity: 'error', summary: 'Error', detail: 'Error deleting payment method' })
    }
  }

  const renderDialogFooter = () => {
    return (
      <div>
        <Button label="No" onClick={() => setShowDialog(false)} className="p-button-text" />
        <Button label="Yes" onClick={handleDeletePaymentMethod} />
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
              {paymentMethod.payment_info.type === 'CC' ? (
                <>
                  <div className="sm:col-span-3">
                    <HtInfoTooltip message="A credit card number is a unique identifier assigned to the card.">
                      <HtInputLabel htmlFor="card_number" asterisk labelText="Card Number" />
                    </HtInfoTooltip>
                    <InputMask
                      id="card_number"
                      value={paymentMethod.payment_info.card_number}
                      mask="9999 9999 9999 9999"
                      slotChar="x"
                      className="mt-2"
                      readOnly
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <HtInfoTooltip message="The expiration date of the credit card.">
                      <HtInputLabel htmlFor="expiration_date" asterisk labelText="Expiration Date" />
                    </HtInfoTooltip>
                    <InputMask
                      id="expiration_date"
                      value={paymentMethod.payment_info.expiration_date}
                      mask="99/99"
                      slotChar="x"
                      className="mt-2"
                      readOnly
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <HtInfoTooltip message="The CCV (Card Verification Value) is a 3 or 4 digit number on the back of your credit card.">
                      <HtInputLabel htmlFor="ccv" asterisk labelText="CCV" />
                    </HtInfoTooltip>
                    <InputMask
                      id="ccv"
                      value={paymentMethod.payment_info.ccv}
                      mask="999"
                      slotChar="x"
                      className="mt-2"
                      readOnly
                    />
                  </div>
                </>
              ) : null}

              {paymentMethod.payment_info.type === 'ACH' || paymentMethod.payment_info.type === 'ECheck' ? (
                <>
                  <div className="sm:col-span-3">
                    <HtInfoTooltip message="Name of the bank.">
                      <HtInputLabel htmlFor="bank_name" asterisk labelText="Bank Name" />
                    </HtInfoTooltip>
                    <InputText id="bank_name" value={paymentMethod.payment_info.bank_name} className="mt-2" readOnly />
                  </div>

                  <div className="sm:col-span-3">
                    <HtInfoTooltip message="The account number is the unique identifier for the bank account.">
                      <HtInputLabel htmlFor="account_number" asterisk labelText="Account Number" />
                    </HtInfoTooltip>
                    <InputText
                      id="account_number"
                      value={paymentMethod.payment_info.account_number}
                      className="mt-2"
                      readOnly
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <HtInfoTooltip message="The routing number is a nine-digit number that identifies the bank.">
                      <HtInputLabel htmlFor="routing_number" asterisk labelText="Routing Number" />
                    </HtInfoTooltip>
                    <InputText
                      id="routing_number"
                      value={paymentMethod.payment_info.routing_number}
                      className="mt-2"
                      readOnly
                    />
                  </div>
                </>
              ) : null}

              <div className="sm:col-span-3">
                <HtInfoTooltip message="Name of the account holder.">
                  <HtInputLabel htmlFor="holder_name" asterisk labelText="Holder Name" />
                </HtInfoTooltip>
                <InputText id="holder_name" value={paymentMethod.payment_info.holder_name} className="mt-2" readOnly />
              </div>

              <div className="sm:col-span-3">
                <HtInfoTooltip message="Provide billing address.">
                  <HtInputLabel htmlFor="address" asterisk labelText="Billing Address" />
                </HtInfoTooltip>
                <InputText id="address" value={paymentMethod.payment_info.address} className="mt-2" readOnly />
              </div>

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
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6" />
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-gray-900/10 pb-12 sm:gap-y-10 md:grid-cols-3">
        <h2 className="text-base font-semibold leading-7 text-gray-900">Delete Payment Method</h2>
        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-1 md:col-span-2">
          <div className="flex flex-col items-center sm:col-span-3">
            <Dialog
              visible={showDialog}
              style={{ width: '450px' }}
              header="Confirm"
              modal
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
    </>
  ) : (
    <HTLoadingLogo />
  )
}
