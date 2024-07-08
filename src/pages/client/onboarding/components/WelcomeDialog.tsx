/* eslint-disable jsx-a11y/media-has-caption */
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'

interface WelcomeDialogProps {
  visible: boolean
  setVisible: (visible: boolean) => void
}

export const WelcomeDialog = ({ visible, setVisible }: WelcomeDialogProps) => {
  return (
    <div className="flex justify-center">
      <Dialog
        visible={visible}
        modal
        blockScroll
        onHide={() => setVisible(false)}
        className="md:w-10/12 lg:w-8/12 xl:w-6/12"
        content={
          <div className="flex w-full flex-col rounded-lg bg-white px-8 py-5">
            <div className="mt-4 flex justify-center">
              <div>
                <video
                  className="aspect-video w-full"
                  src="https://hemptemps-prod.s3.amazonaws.com/Videos/orientation/client-orientation-final-cut.mp4"
                  title="client-orientation-video"
                  autoPlay
                  controls
                />
              </div>
            </div>
            <div className="mb-3 mt-3 text-center sm:mb-5 sm:mt-5">
              <h3 className="text-base font-semibold leading-6 text-gray-900">Welcome to HempTemps</h3>
              <div className="mt-2">
                <p className="text-wrap text-sm text-gray-500">
                  Congratulations! Your account is successfully created. We need a bit more information to complete your
                  onboarding.
                </p>
              </div>
            </div>
            <div className="mx-auto">
              <Button label="Continue" onClick={() => setVisible(false)} />
            </div>
          </div>
        }
      />
    </div>
  )
}
