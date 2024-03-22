//eslint-disable
import { useCallback, useContext, useEffect, useState } from 'react'

import { Button } from 'primereact/button'

import { GetAcceptIframe } from '../../../../components/shared/GetAccept/GetAcceptIframe'
import { RequestService } from '../../../../services/RequestService'
import { useUtils } from '../../../../store/useUtils'
import { FormDataContext, type StepProps } from '../ClientOnboardingPage'
import { FinishOnboardingDialog } from './FinishOnboardingDialog'

export function joinTruthyStrings(strings: (string | undefined)[], separator: string): string {
  return strings.filter(Boolean).join(separator)
}

export const Step5 = ({ step, setStep }: StepProps) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const [documentUrl, setDocumentUrl] = useState('')

  const { documentData } = useContext(FormDataContext)

  // const documentUrl = documentData.document_url
  // console.log('documentData: ', documentData);

  const { setRemoveToastCallback, showToast } = useUtils()

  useEffect(() => {
    const getDocumentRecipients = async () => {
      try {
        const response = await RequestService(`/getaccept/${documentUrl}/recipients`, 'GET')
        if (response.error) {
          throw response.error
        } else {
          setDocumentUrl(response.document_url)
        }
      } catch (error) {
        console.error('Error fetching document recipients:', error)
      }
    }
    getDocumentRecipients()
  }, [documentData])

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
