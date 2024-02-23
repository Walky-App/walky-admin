import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'

interface WelcomeDialogProps {
  visible: boolean
  setVisible: (visible: boolean) => void
}

export default function WelcomeDialog({ visible, setVisible }: WelcomeDialogProps) {
  return (
    <>
      <div className="flex justify-center">
        <Dialog
          visible={visible}
          modal
          onHide={() => setVisible(false)}
          content={
            <div className="flex flex-col gap-4 rounded-lg bg-white px-8 py-5 sm:w-full sm:max-w-md">
              <div className="mt-3 text-center sm:mt-5">
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
