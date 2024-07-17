import { Dialog } from 'primereact/dialog'

interface WelcomeDialogProps {
  visible: boolean
  setVisible: (visible: boolean) => void
}

export const SignupDialog = ({ visible, setVisible }: WelcomeDialogProps) => {
  return (
    <div className="flex justify-center">
      <Dialog
        visible={visible}
        blockScroll
        header="Welcome to HempTemps"
        dismissableMask
        draggable={false}
        onHide={() => setVisible(false)}
        className="md:w-4/5 lg:w-10/12">
        <div className="flex w-full flex-col items-center rounded-lg bg-white px-4 py-5 xl:px-8">
          <img
            src="/assets/logos/logo-horizontal-cropped.png"
            alt="Hemp Temps logo"
            className="w-8/12 md:w-6/12 xl:w-4/12"
          />
          <div className="mt-4 flex w-full flex-col justify-center gap-x-8 lg:w-11/12 lg:flex-row lg:gap-x-12 2xl:w-10/12 2xl:gap-x-20">
            <iframe
              src="https://www.youtube.com/embed/PYgARhpA0FU?si=Ru878SjeGE95lRJm"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="aspect-video w-full xl:w-8/12"
            />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
