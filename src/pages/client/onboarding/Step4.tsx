import { useContext, useRef, useState } from 'react'

import { Toast, ToastMessage } from 'primereact/toast'
import { Button } from 'primereact/button'
import { FormDataContext, StepProps } from '.'
import AddFacilityDialog from './AddFacilityDialog'
import { ConfirmDialog } from 'primereact/confirmdialog'

export function joinTruthyStrings(strings: (string | undefined)[], separator: string): string {
  return strings.filter(Boolean).join(separator)
}

export const Step4 = ({ step, setStep }: StepProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [visible, setVisible] = useState<boolean>(false)

  const { defaultValues, selectedFacility } = useContext(FormDataContext)

  const toast = useRef(null)

  const showSavedToast = () => {
    setIsLoading(true)
    // @ts-ignore
    toast.current?.show({
      severity: 'success',
      summary: 'Success',
      detail: 'Changes saved successfully.',
      life: 2000,
    })
  }

  const onRemove = (toastData: ToastMessage) => {
    // @ts-ignore
    const severity = toastData.message ? toastData.message.severity : toastData.severity

    if (severity === 'success') {
      setStep(step + 1)
    }

    setIsLoading(false)
  }

  return (
    <div className="space-y-12">
      <AddFacilityDialog
        visible={visible}
        setVisible={setVisible}
        toastRef={toast}
        values={selectedFacility || defaultValues}
      />
      <ConfirmDialog />
      <Toast ref={toast} onRemove={e => onRemove(e)}></Toast>

      {/* Do you have more locations to add?  */}
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 ">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">Payment Information</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Please enter your payment information (like credit card, billing address, Bank account number) in the
            provided space below.
          </p>
        </div>

        <div className="sm:col-span-full">
          <ul className="grid auto-rows-fr grid-cols-1 gap-x-6 gap-y-8 xl:gap-x-8">
            <li className="overflow-hidden rounded-xl border border-gray-200">
              {/* Card Header */}
              <div className="flex h-full flex-col items-center justify-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                <Button icon="pi pi-plus" rounded aria-label="Add" /*  onClick={() => setVisible(true)} */ />
                <div className="mt-4 text-lg font-semibold leading-6 text-gray-900">Billing Methods</div>
                <p className="mt-1 text-sm font-semibold leading-6 text-gray-900">
                  You have not set up any billing methods yet.
                </p>
                <p className="text-center text-sm leading-6 text-gray-600">
                  Your billing method will charged only when your available balance from HempTemp earnings is not
                  sufficient to pay for your monthly membership and/or connects.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button severity="secondary" label="Back" outlined onClick={() => setStep(step - 1)} />
        <Button label="Save" onClick={showSavedToast} loading={isLoading} />
      </div>
    </div>
  )
}
