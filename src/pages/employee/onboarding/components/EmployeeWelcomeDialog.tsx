/* eslint-disable jsx-a11y/media-has-caption */
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'

const welcomeBullets = [
  {
    text: 'Answer a few questions and start building your profile.',
  },
  {
    text: 'Apply for open roles or list services for client to buy.',
  },
  {
    text: 'Get paid safely and know we’re there to help.',
  },
]

interface WelcomeDialogProps {
  visible: boolean
  setVisible: (visible: boolean) => void
}

export const EmployeeWelcomeDialog = ({ visible, setVisible }: WelcomeDialogProps) => {
  return (
    <div className="flex justify-center">
      <Dialog
        visible={visible}
        dismissableMask
        header="Welcome to HempTemps"
        blockScroll
        onHide={() => setVisible(false)}
        className="md:w-4/5 lg:w-10/12">
        <div className="flex w-full flex-col items-center rounded-lg bg-white px-4 py-5 xl:px-8">
          <img src="/assets/logos/logo-horizontal-cropped.png" alt="Hemp Temps logo" className="w-6/12 xl:w-4/12" />
          <div className="mt-4 flex flex-col justify-center gap-x-8 lg:w-11/12 lg:flex-row lg:gap-x-12 2xl:w-10/12 2xl:gap-x-20">
            <div>
              <video
                className="aspect-video w-full"
                src="https://hemptemps-prod.s3.amazonaws.com/Videos/orientation/job-seeker-orientation-final-cut.mp4"
                title="job-seeker-orientation-video"
                autoPlay
                controls
              />
            </div>
            <div className="mt-6 flex flex-col justify-center gap-y-6 lg:w-1/2 lg:gap-y-8 xl:mt-0 2xl:gap-y-10">
              <h2 className="text-2xl font-bold text-black sm:text-3xl">Hey, Ready for your next big opportunity?</h2>
              {welcomeBullets.map((bullet, index) => (
                <div key={index} className="flex items-center gap-x-4 pl-2">
                  <i className="pi pi-check text-2xl sm:text-3xl" />
                  <p className="text-sm font-normal leading-tight text-black sm:text-base">{bullet.text}</p>
                </div>
              ))}
              <div className="mb-2">
                <p className="text-wrap text-sm text-gray-500 sm:text-base">
                  It only takes 5-10 minutes and you can edit it later. We’ll save as you go.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 lg:ml-auto">
            <Button size="large" label="Continue" onClick={() => setVisible(false)} />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
