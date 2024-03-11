import { useRef, useState } from 'react'

import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'

import { type StepProps } from '../ClientOnboardingPage'
import { FinishOnboardingDialog } from './FinishOnboardingDialog'

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
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">Terms and Conditions</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">Please read the terms & conditions of HempTemps.</p>
        </div>

        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 md:col-span-2">
          <div className="sm:col-span-full">
            <ul className="grid-cols-full grid auto-rows-fr gap-x-6 gap-y-8 xl:gap-x-8">
              <li className="overflow-hidden rounded-xl border border-gray-200">
                {/* Card Header */}
                <div className="flex h-full flex-col justify-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                  <div className="flex justify-between">
                    <div className="mb-3 text-sm font-semibold leading-6 text-gray-900">Version : 1.1</div>
                    <p className="mb-3 text-sm font-semibold leading-6 text-gray-900">Last updated : 05/09/2023</p>
                  </div>
                  <article className="flex flex-col gap-y-2 text-sm leading-6 text-gray-600">
                    <p>
                      Please read these Terms and Conditions (“Terms”, “Terms and Conditions”) carefully before using
                      https://hemptemps.com (the “Site”) operated by Hemp Temps (“us”, “we”, or “our”).
                    </p>

                    <p>
                      Your access to and use of the Site is conditioned upon your acceptance of and compliance with
                      these Terms. These Terms apply to all visitors, users, and others who wish to access or use the
                      Site.
                    </p>

                    <p>
                      By accessing or using the Site, you agree to be bound by these Terms. If you disagree with any
                      part of the Terms, then you do not have permission to access the Site.
                    </p>

                    <section>
                      <h2>Content:</h2>
                      <p>
                        Our Site allows you to post, link, store, share, and otherwise make available certain
                        information, text, graphics, videos, or other material (“Content”). You are responsible for the
                        accuracy, quality, legality, and appropriateness of all Content you submit to the Site.
                      </p>
                    </section>

                    <section>
                      <h2>Intellectual Property:</h2>
                      <p>
                        The Site and its original content, features, and functionality are owned by Hemp Temps and are
                        protected by international copyright, trademark, patent, trade secret, and other intellectual
                        property or proprietary rights laws.
                      </p>
                    </section>
                  </article>
                </div>
              </li>
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
