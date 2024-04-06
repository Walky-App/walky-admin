import { useContext, useEffect, useState } from 'react'

import { Button } from 'primereact/button'
import { Skeleton } from 'primereact/skeleton'

import { GetAcceptIframe } from '../../../../components/shared/GetAccept/GetAcceptIframe'
import { RequestService } from '../../../../services/RequestService'
import { FormDataContext, type StepProps } from '../ClientOnboardingPage'
import { FinishOnboardingDialog } from './FinishOnboardingDialog'

export function joinTruthyStrings(strings: (string | undefined)[], separator: string): string {
  return strings.filter(Boolean).join(separator)
}

export const Step5 = ({ step, setStep }: StepProps) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const [documentloading, setDocumentLoading] = useState(true)
  const [documentUrl, setDocumentUrl] = useState('')

  const { documentData } = useContext(FormDataContext)

  useEffect(() => {
    setDocumentLoading(true)
    const documentId = documentData?.id

    const getDocumentRecipients = async () => {
      try {
        if (!documentId) {
          setDocumentLoading(false)
          throw 'Document ID is missing'
        }

        const response = await RequestService(`getaccept/${documentId}/recipients`, 'GET')
        if (response.errors) {
          throw response.errors
        }

        setDocumentUrl(response.document_url)
        setDocumentLoading(false)
      } catch (error) {
        console.error('Error fetching document recipients:', error)
        setDocumentLoading(false)
      }
    }

    getDocumentRecipients()
  }, [documentData])

  const handleSaveButton = () => {
    setIsLoading(true)
    setVisible(true)
    setIsLoading(false)
  }

  const renderDocument = () => {
    if (documentloading) {
      return (
        <div className="flex h-dvh items-center justify-center">
          <Skeleton shape="rectangle" size="100%" />
        </div>
      )
    }

    if (documentUrl) {
      return <GetAcceptIframe documentUrl={documentUrl} className="h-dvh w-full" />
    }

    return (
      <div className="flex h-dvh items-center justify-center">
        <p className="text-gray-500">No document found</p>
      </div>
    )
  }

  return (
    <div className="">
      <FinishOnboardingDialog visible={visible} setVisible={setVisible} />
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-4">
        <div className="grid max-w-full grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-full">
          <div className="sm:col-start-2 sm:col-end-6">
            <div className="mb-4">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Terms and Conditions</h2>
            </div>
            <ul className="grid-cols-full grid auto-rows-fr gap-x-6 gap-y-8 xl:gap-x-8">
              <li className="overflow-hidden rounded-xl border border-gray-200">{renderDocument()}</li>
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
