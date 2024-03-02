import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'

interface WelcomeDialogProps {
  visible: boolean
  setVisible: (visible: boolean) => void
}

export const WelcomeDialog = ({ visible, setVisible }: WelcomeDialogProps) => {
  return (
    <>
      <div className="flex justify-center">
        <Dialog
          visible={visible}
          modal
          blockScroll
          onHide={() => setVisible(false)}
          content={
            <div className="flex flex-col rounded-lg bg-white px-8 py-5 sm:w-full">
              <div className="flex justify-center">
                <iframe
                  className="aspect-[4/3] w-5/6"
                  src="https://www.youtube.com/embed/5NaQa0Y_s28?autoplay=1&mute=1&rel=0&controls=1&showinfo=0&modestbranding=1&loop=1&"
                  title="YouTube video player"
                  allow="autoplay"></iframe>
              </div>
              <div className="mb-3 mt-3 text-center sm:mb-5 sm:mt-5">
                <h3 className="text-base font-semibold leading-6 text-gray-900">Welcome to HempTemps</h3>
                <div className="mt-2">
                  <p className="text-wrap text-sm text-gray-500">
                    Congratulations! Your account is successfully created. We need a bit more information to complete
                    your onboarding.
                  </p>
                </div>
              </div>
              <div className="mx-auto">
                <Button label="Continue" onClick={() => setVisible(false)} />
              </div>
            </div>
          }></Dialog>
      </div>
    </>
  )
}
