import { useContext, useState } from 'react'

import { Button } from 'primereact/button'

import { GetAcceptIframe } from '../../../../components/shared/GetAccept/GetAcceptIframe'
import { HTLoadingLogo } from '../../../../components/shared/HTLoadingLogo'
import { FormDataContext } from '../clientOnboardingUtils'
import { FinishOnboardingDialog } from '../components/FinishOnboardingDialog'

export function joinTruthyStrings(strings: (string | undefined)[], separator: string): string {
  return strings.filter(Boolean).join(separator)
}

export const SignGetAcceptForm = () => {
  const [visible, setVisible] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)

  const { documentUrl, documentLoading } = useContext(FormDataContext)

  const handleSaveButton = () => {
    setIsLoading(true)
    setVisible(true)
    setIsLoading(false)
  }

  const renderDocument = () => {
    if (documentLoading === true) {
      return (
        <div className="flex h-dvh flex-col items-center justify-center">
          <p className="text-gray-500">Loading Document...</p>
          <HTLoadingLogo />
          <p className="text-gray-500">Thank you for your patience.</p>
        </div>
      )
    }

    if (documentUrl) {
      return <GetAcceptIframe documentUrl={documentUrl} className="h-dvh w-full" />
    }

    return (
      <div className="flex h-dvh items-center justify-center">
        <p className="text-gray-500">No document found. Please contact representative.</p>
      </div>
    )
  }

  return (
    <>
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
        <Button label="Finish" onClick={handleSaveButton} loading={isLoading} disabled={documentLoading} />
      </div>
    </>
  )
}
