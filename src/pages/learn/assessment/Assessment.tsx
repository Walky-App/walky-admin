import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { ProgressBar } from 'primereact/progressbar'

import { HeadingComponent } from '../../../components/shared/general/HeadingComponent'
import { useAdmin } from '../../../contexts/AdminContext'
import type { IAssessmentResponse } from '../../../interfaces/unit'
import { RequestService } from '../../../services/RequestService'
import { useLearn } from '../../../store/useLearn'
import { useUtils } from '../../../store/useUtils'
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
  const [nextStep, setNextStep] = useState<string>('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [validatorResponse, setValidatorResponse] = useState<IAssessmentResponse>({
    correct_questions: 0,
    minimum_score: 0,
    incorrect_questions: 0,
    pass_assessment: false,
    percentagea_assessment: 0,
  })

  const { setRecord, expireTime, setExpireTime } = useLearn()
  const { showToast } = useUtils()

  useEffect(() => {
    const fetchData = async () => {
      const response = await RequestService(`units/${params.unitId}`)
      if (response) {
        setUnit(response)
      }
    }
    if (!unit) {
      fetchData()
    }
    const sendDataAssessment = async () => {
      const response = await RequestService(`units/assessment/validator`, 'POST', {
        userAnswers: assessmentArray,
        unitId: params.unitId,
      })
      setRecord(response.AssessmentRecord)
      setValidatorResponse(response.reponseAssessment)
      setNextStep(response.nextStep)
      if (response.nextStep == '/learn') {
        setCategoryId(response.categoryId)
      }
      setFinishAssessment(true)
      showToast({ severity: 'error', detail: 'Assessment sent due to time expiration', summary: 'Information' })
    }
    if (expireTime) {
      sendDataAssessment()
      setExpireTime(false)
    }
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [expireTime, unit, params.unitId, setUnit, assessmentArray, setRecord, setExpireTime, showToast])

  const handlerControllerQuestion = () => {
    if (indexQuestion === (unit?.assessments?.questions?.length ?? 0) - 1) {
      //submit
      confirmDialog({
        message: 'Are you sure you want to finish?',
        header: 'Finish assessment',
        icon: 'pi pi-info-circle',
        defaultFocus: 'accept',
        acceptClassName: 'p-button',
        rejectClassName: 'p-button-danger',
        style: { width: '50vw' },
        breakpoints: { '1100px': '75vw', '960px': '100vw' },
        accept: async () => {
          const assessmentData = [...(assessmentArray ?? [])]
          assessmentData.push(selectAnswer)
          const response = await RequestService(`units/assessment/validator`, 'POST', {
            userAnswers: assessmentData,
            unitId: params.unitId,
          })
          setRecord(response.AssessmentRecord)
          setValidatorResponse(response.reponseAssessment)
          setNextStep(response.nextStep)
          if (response.nextStep === '/learn') {
            setCategoryId(response.categoryId)
          }
          setFinishAssessment(true)
        },
      })
    } else {
      //next
      const assessmentData = [...(assessmentArray ?? [])]
      if (indexQuestion >= assessmentArray.length) {
        assessmentData.push(selectAnswer)
        setAssessmentArray(assessmentData)
      }
      const updateAnswer = assessmentData.map((item, index) => {
        if (index === indexQuestion) {
          return selectAnswer
        }
        return item
      })
      if (assessmentArray[indexQuestion + 1]) {
        setAssessmentArray(updateAnswer)
        setSelectAnswer(assessmentArray[indexQuestion + 1])
      } else {
        setAssessmentArray(updateAnswer)
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
      {!finishAssessment ? (
        <div>
          <HeadingComponent title={`Assessement - ${unit?.title}`} />
          <Timer initialSeconds={unit?.time ?? 0} />
          <p className="gray-500 mb-2 text-sm">
            {indexQuestion + 1} / {unit?.assessments.questions?.length}
          </p>
          <ProgressBar className="h-2" value={progressValue} showValue={false} />

          <div className="mt-3 select-none text-xl font-semibold">
            {unit?.assessments.questions?.[indexQuestion]?.header}
          </div>

          <div className="my-3 gap-5">
            {unit?.assessments.questions?.[indexQuestion]?.options?.map((option, index) => {
              return (
                <div key={index} className="my-2 flex items-center">
                  <button
                    className={cn(
                      selectAnswer.code === index ? 'border-green-500' : 'border-gray-300',
                      'flex w-full select-none gap-2 rounded-md  border-2 p-2 hover:border-green-500 sm:w-4/5',
                    )}
                    onClick={() => handleAddAnswer(option, index)}
                    type="button">
                    {option}
                  </button>
                </div>
              )
            })}
          </div>

          <div className="flex justify-between gap-2 sm:justify-end">
            <Button
              onClick={() => handlerPreviousQuestion()}
              disabled={indexQuestion === 0}
              size="small"
              label="Previous"
              type="button"
            />
            <Button
              onClick={() => handlerControllerQuestion()}
              disabled={selectAnswer.code === 99}
              size="small"
              label={indexQuestion === (unit?.assessments?.questions?.length ?? 0) - 1 ? 'Finish' : 'Next'}
              type="button"
            />
          </div>
        </div>
      ) : (
        <AssessmentResponse validatorResponse={validatorResponse} nextStep={nextStep} categoryId={categoryId} />
      )}
    </div>
  )
}
