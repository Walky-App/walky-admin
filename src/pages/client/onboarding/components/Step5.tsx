import { useCallback, useEffect, useState } from 'react'

import { Button } from 'primereact/button'
import { InputTextarea } from 'primereact/inputtextarea'

import { GetAcceptIframe } from '../../../../components/shared/GetAccept/GetAcceptIframe'
import { useUtils } from '../../../../store/useUtils'
import { type StepProps } from '../ClientOnboardingPage'
import { FinishOnboardingDialog } from './FinishOnboardingDialog'

export function joinTruthyStrings(strings: (string | undefined)[], separator: string): string {
  return strings.filter(Boolean).join(separator)
}

export const Step5 = ({ step, setStep }: StepProps) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const [documentUrl, setDocumentUrl] = useState(
    'https://app.getaccept.com/v/46ygvhewmmgm/8gkzzyzbrmjdd5/a/9bc9875eacee8b30a1b8c1eb2d6a268a',
  )

  const { setRemoveToastCallback, showToast } = useUtils()

  const handleRemoveToast = useCallback(() => {
    setIsLoading(false)
    setVisible(true)
  }, [setIsLoading, setVisible])

  useEffect(() => {
    setRemoveToastCallback(handleRemoveToast)
  }, [handleRemoveToast, setRemoveToastCallback])

  const handleSaveButton = () => {
    setIsLoading(true)

    showToast({
      severity: 'success',
      summary: 'Success',
      detail: 'Changes saved successfully.',
      life: 2000,
    })
  }

  return (
    <div className="space-y-12">
      <FinishOnboardingDialog visible={visible} setVisible={setVisible} />

      {/* Do you have more locations to add?  */}
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-4">
        <div className="sm:col-span-1">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Terms and Conditions</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Please read the terms & conditions of HempTemps.</p>
          <br />
          <strong className="block text-sm font-medium text-gray-700">*Testing only*</strong>
          <InputTextarea
            value={documentUrl}
            onChange={e => setDocumentUrl(e.target.value)}
            placeholder="Document URL"
            rows={7}
          />
        </div>

        <div className="grid max-w-full grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-3">
          <div className="sm:col-span-5">
            <ul className="grid-cols-full grid auto-rows-fr gap-x-6 gap-y-8 xl:gap-x-8">
              <li className="overflow-hidden rounded-xl border border-gray-200">
                {documentUrl ? <GetAcceptIframe documentUrl={documentUrl} className="h-dvh w-full" /> : null}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button severity="secondary" label="Back" outlined onClick={() => setStep(step - 1)} />
        <Button label="Finish" onClick={handleSaveButton} loading={isLoading} />
      </div>
    </div>
  )
}
