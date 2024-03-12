import { useRef, useState } from 'react'

import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'

import { GetAcceptIframe } from '../../../../components/shared/GetAccept/GetAcceptIframe'
import { type StepProps } from '../ClientOnboardingPage'
import { FinishOnboardingDialog } from './FinishOnboardingDialog'

const documents = ['https://app.getaccept.com/v/jxz92hv3x24z/4rjxkv3sjqek88/a/d0e4125ed59490a3c7c1ef88ffbd459b']

export function joinTruthyStrings(strings: (string | undefined)[], separator: string): string {
  return strings.filter(Boolean).join(separator)
}

export const Step5 = ({ step, setStep }: StepProps) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)

  const toast = useRef(null)

  const showSavedToast = () => {
    setIsLoading(true)
    // @ts-expect-error toast.current may be null
    toast.current?.show({
      severity: 'success',
      summary: 'Success',
      detail: 'Changes saved successfully.',
      life: 2000,
    })
  }

  const onRemove = () => {
    setIsLoading(false)
    setVisible(true)
  }

  return (
    <div className="space-y-12">
      <FinishOnboardingDialog visible={visible} setVisible={setVisible} />
      <Toast ref={toast} onRemove={onRemove} />
      {/* Do you have more locations to add?  */}
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-4">
        <div className="sm:col-span-1">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Terms and Conditions</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Please read the terms & conditions of HempTemps.</p>
        </div>

        <div className="grid max-w-full grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-3">
          <div className="sm:col-span-5">
            <ul className="grid-cols-full grid auto-rows-fr gap-x-6 gap-y-8 xl:gap-x-8">
              {documents.map((documentUrl, index) => (
                <li key={documentUrl + index} className="overflow-hidden rounded-xl border border-gray-200">
                  <GetAcceptIframe documentUrl={documentUrl} className="h-dvh w-full" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button severity="secondary" label="Back" outlined onClick={() => setStep(step - 1)} />
        <Button label="Agree" onClick={showSavedToast} loading={isLoading} />
      </div>
    </div>
  )
}
