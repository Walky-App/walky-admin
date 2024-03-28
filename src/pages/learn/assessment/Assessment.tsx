import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { ProgressBar } from 'primereact/progressbar'

import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import { useAdmin } from '../../../contexts/AdminContext'
import type { IAssessmentResponse } from '../../../interfaces/unit'
import { RequestService } from '../../../services/RequestService'
import { cn } from '../../../utils/cn'
import { Timer } from '../components/Timer'
import { AssessmentResponse } from './AssessmentResponse'

interface IAssessment {
  _id: string
  answer: string
  code: number
}

export const Assessment = () => {
  const [indexQuestion, setIndexQuestion] = useState(0)
  const [progressValue, setProgressValue] = useState(0)
  const { unit, setUnit } = useAdmin()
  const [assessmentArray, setAssessmentArray] = useState<IAssessment[]>([])
  const [selectAnswer, setSelectAnswer] = useState<IAssessment>({ _id: '', answer: '', code: 99 })
  const params = useParams()
  const [finishAssessment, setFinishAssessment] = useState(false)
  const [validatorResponse, setValidatorResponse] = useState<IAssessmentResponse>({
    correctQuestions: 0,
    minimumScore: 0,
    incorrectQuestions: 0,
    passAssessment: false,
    percentageAssessment: 0,
  })

  const fetchData = async () => {
    const response = await RequestService(`units/${params.unitId}`)
    if (response) {
      setUnit(response)
    }
  }

  useEffect(() => {
    if (!unit) {
      fetchData()
    }
  })

  const handlerControllerQuestion = () => {
    if (indexQuestion === (unit?.assessments?.questions?.length ?? 0) - 1) {
      //submit
      confirmDialog({
        message: 'Are you sure you want to finish?',
        header: 'Finish assessment',
        icon: 'pi pi-info-circle',
        defaultFocus: 'accept',
        acceptClassName: 'p-button-success',
        rejectClassName: 'p-button-danger',
        style: { width: '50vw' },
        breakpoints: { '1100px': '75vw', '960px': '100vw' },
        accept: async () => {
          const assessmentData = [...(assessmentArray ?? [])]
          assessmentData.push(selectAnswer)
          const response: IAssessmentResponse = await RequestService(`units/assessment/validator`, 'POST', {
            userAnswers: assessmentData,
            unitId: params.unitId,
          })
          setValidatorResponse(response)
          setFinishAssessment(true)
        },
      })
    } else {
      //next
      if (selectAnswer.code !== 99) {
        const assessmentData = [...(assessmentArray ?? [])]
        assessmentData.push(selectAnswer)
        setAssessmentArray(assessmentData)
      }
      if (assessmentArray[indexQuestion + 1]) {
        setSelectAnswer(assessmentArray[indexQuestion + 1])
      } else {
        setSelectAnswer({ code: 99, answer: '', _id: '' })
      }
      setIndexQuestion(indexQuestion + 1)
      setProgressValue(((indexQuestion + 1) / ((unit?.assessments?.questions?.length ?? 0) - 1)) * 100)
    }
  }

  const handlerPreviousQuestion = () => {
    setIndexQuestion(indexQuestion - 1)
    setProgressValue(((indexQuestion - 1) / (unit?.assessments?.questions?.length ?? 0)) * 100)
    setSelectAnswer(assessmentArray[indexQuestion - 1])
  }

  const handleAddAnswer = (answer: string, code: number) => {
    setSelectAnswer({ code, answer, _id: unit?.assessments?.questions?.[indexQuestion]?._id ?? '' })
  }

  return (
    <div>
      <ConfirmDialog />

      {!finishAssessment ? (
        <div>
          <HeaderComponent title={`Assessement - ${unit?.title}`} />
          <Timer initialSeconds={unit?.time ?? 0} />
          <p className="gray-500 mb-2 text-sm">
            {indexQuestion + 1} / {unit?.assessments.questions?.length}
          </p>
          <ProgressBar className="h-2" value={progressValue} showValue={false} />

          <div className="mt-3 text-xl font-semibold">{unit?.assessments.questions?.[indexQuestion]?.header}</div>

          <div className="my-3 gap-5">
            {unit?.assessments.questions?.[indexQuestion]?.options?.map((option, index) => {
              return (
                <div key={index} className="my-2 flex items-center">
                  <button
                    className={cn(
                      selectAnswer.code === index ? 'border-green-500' : 'border-gray-300',
                      'flex w-full gap-2 rounded-md border-2  p-2 hover:border-green-500 sm:w-4/5',
                    )}
                    onClick={() => handleAddAnswer(option, index)}
                    type="button">
                    {option}
                  </button>
                </div>
              )
            })}
          </div>

          <div className="flex justify-between gap-2 sm:justify-end ">
            <button
              className={cn(
                indexQuestion == 0 ? 'bg-gray-300' : ' bg-green-600 hover:bg-green-500',
                'rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ',
              )}
              onClick={() => handlerPreviousQuestion()}
              disabled={indexQuestion === 0}
              type="button">
              Previous
            </button>
            <button
              className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
              onClick={() => handlerControllerQuestion()}
              type="button">
              {indexQuestion === (unit?.assessments?.questions?.length ?? 0) - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      ) : (
        <AssessmentResponse validatorResponse={validatorResponse} />
      )}
    </div>
  )
}
