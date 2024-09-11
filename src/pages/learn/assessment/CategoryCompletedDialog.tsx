/* eslint-disable jsx-a11y/media-has-caption */
import { useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'

import { CertificationButton } from '../../admin/HTU/components/Certification'

interface CategoryCompletedProps {
  visible: boolean
  categoryId: string
  setVisible: (visible: boolean) => void
  nextStep: string
}

export const CategoryCompletedDialog = ({ visible, setVisible, categoryId, nextStep }: CategoryCompletedProps) => {
  const navigate = useNavigate()
  return (
    <div className="flex justify-center">
      <Dialog
        visible={visible}
        dismissableMask
        header="Category completed"
        blockScroll
        onHide={() => setVisible(false)}
        className="md:w-4/5 lg:w-10/12">
        <div className="flex w-full flex-col items-center rounded-lg bg-white px-4 py-5 xl:px-8">
          <img src="/assets/logos/logo-horizontal-cropped.png" alt="Hemp Temps logo" className="w-6/12 xl:w-4/12" />
          <div className="mt-4 flex flex-col justify-center gap-x-8 lg:w-11/12 lg:flex-row lg:gap-x-12 2xl:w-10/12 2xl:gap-x-20">
            <div className="mt-6 flex flex-col justify-center gap-y-6 lg:w-1/2 lg:gap-y-8 xl:mt-0 2xl:gap-y-10">
              <h2 className="text-2xl font-bold text-black sm:text-3xl">
                Congratulations, you completed the category!
              </h2>
              <div className=" items-center gap-4">
                <p className="text-sm font-normal leading-tight text-black sm:text-base">
                  {' '}
                  We will be happy to accompany you in this learning process.
                </p>
                <p className="text-sm font-normal leading-tight text-black sm:text-base">
                  {' '}
                  Now you can see your certificate and share it with your colleagues.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mt-4 lg:ml-auto">
              <CertificationButton categoryId={categoryId} />
            </div>
            <div className="mt-4 lg:ml-auto">
              <Button size="large" label="Continue" onClick={() => navigate(`${nextStep}`)} />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
