import { useContext, useState } from 'react'

import { Button } from 'primereact/button'
import { ConfirmDialog } from 'primereact/confirmdialog'

import { FormDataContext, type StepProps } from '../ClientOnboardingPage'
import { AddFacilityDialog } from './AddFacilityDialog'
import { AddPaymentMethodsCard } from './PaymentMethodCard'

export const Step4 = ({ step, setStep }: StepProps) => {
  const [visible, setVisible] = useState<boolean>(false)

  const { defaultValues, selectedFacility } = useContext(FormDataContext)

  const handleSaveButton = () => {
    setStep(step + 1)
  }

  return (
    <div className="space-y-12">
      <AddFacilityDialog visible={visible} setVisible={setVisible} values={selectedFacility || defaultValues} />
      <ConfirmDialog />
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">Payment Information</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Please choose a payment method.</p>
        </div>
        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
          <div className="sm:col-span-full">
            <ul className="grid auto-rows-fr grid-cols-1 gap-x-6 gap-y-8 xl:gap-x-8">
              <li className="overflow-hidden rounded-xl border border-gray-200">
                <AddPaymentMethodsCard />
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button severity="secondary" label="Back" outlined onClick={() => setStep(step - 1)} />
        <Button label="Save" onClick={handleSaveButton} />
      </div>
    </div>
  )
}
