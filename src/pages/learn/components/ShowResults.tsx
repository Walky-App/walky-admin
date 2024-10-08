import { Dialog } from 'primereact/dialog'

import { CheckCircleIcon } from '@heroicons/react/24/outline'

import { useLearn } from '../../../store/useLearn'

interface ShowResultsDialogProps {
  visible: boolean
  setVisible: (visible: boolean) => void
}

export const ShowResultsDialog = ({ visible, setVisible }: ShowResultsDialogProps) => {
  const { currentUnit } = useLearn()
  return (
    <Dialog header="Results" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
      <div className="rounded-md border-2 border-gray-300">
        <div className="flex h-96 flex-col items-center justify-center">
          <div>
            <CheckCircleIcon className="h-20 w-20 text-green-600" />
          </div>
          <div className="text-3xl font-semibold">Passed Assessment</div>
          <div className="text-sm font-semibold text-gray-500">The result of your evaluation is the following:</div>
          <div className="my-3 flex gap-5">
            <div className="w-22 flex flex-1 flex-col items-center rounded-xl bg-gray-100 p-3">
              <p className="text-gray-500">Correct</p>
              <p className="font-bold">{currentUnit.correct_questions}</p>
            </div>
            <div className="w-22 flex flex-col items-center rounded-xl bg-gray-100 p-3">
              <p className="text-gray-500">Incorrect</p>
              <p className="font-bold">{currentUnit.incorrect_questions}</p>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
