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
        modal
        blockScroll
        onHide={() => setVisible(false)}
        keepInViewport
        className="w-full xl:w-8/12"
        content={
          <div className="flex w-full flex-col items-center rounded-lg bg-white px-4 py-5 xl:px-8">
            <img src="/assets/logos/logo-horizontal-cropped.png" alt="Hemp Temps logo" className="xl:w-6/12" />
            <div className="mt-4 flex w-9/12 flex-col justify-center gap-x-12 xl:flex-row">
              <iframe
                className="aspect-[4/3] w-full"
                src="https://www.youtube.com/embed/5NaQa0Y_s28?autoplay=1&mute=1&rel=0&controls=1&showinfo=0&modestbranding=1&loop=1&"
                title="YouTube video player"
                allow="autoplay"
              />
              <div className="mt-6 flex flex-col justify-center gap-y-6 xl:mt-0 xl:gap-y-12">
                <div className="text-2xl font-bold text-black">Hey, Ready for your next big opportunity?</div>
                {welcomeBullets.map((bullet, index) => (
                  <div key={index} className="flex items-center gap-x-2">
                    <i className="pi pi-check text-2xl" />
                    <p className="text-sm font-normal leading-tight text-black">{bullet.text}</p>
                  </div>
                ))}
                <div className="mb-2">
                  <p className="text-wrap text-sm text-gray-500">
                    It only takes 5-10 minutes and you can edit it later. We’ll save as you go.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 xl:ml-auto">
              <Button label="Continue" onClick={() => setVisible(false)} />
            </div>
          </div>
        }
      />
    </div>
  )
}
