import { useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

import { useAdmin } from '../../../contexts/AdminContext'
import type { IAssessmentResponse } from '../../../interfaces/unit'
import { CategoryCompletedDialog } from './CategoryCompletedDialog'

interface AssessmentResponseProps {
  validatorResponse: IAssessmentResponse
  nextStep: string
  categoryId: string
}

export const AssessmentResponse = ({ validatorResponse, nextStep, categoryId }: AssessmentResponseProps) => {
  const params = useParams()
  const navigate = useNavigate()
  const { setModule, setUnit } = useAdmin()

  const [visible, setVisible] = useState<boolean>(false)

  const handleNextStep = () => {
    if (nextStep === '/learn') {
      setVisible(true)
    } else {
      setModule(undefined)
      setUnit(undefined)
      navigate(`${nextStep}`)
    }
  }

  return (
    <div>
      <CategoryCompletedDialog visible={visible} setVisible={setVisible} categoryId={categoryId} nextStep={nextStep} />
      {validatorResponse?.pass_assessment ? (
        <div className="rounded-md border-2 border-gray-300">
          <div className="flex h-96 flex-col items-center justify-center">
            <div>
              <CheckCircleIcon className="h-20 w-20 text-green-600" />
            </div>
            <div className="text-3xl font-semibold">Great Work!</div>
            <div className="text-sm font-semibold text-gray-500">
              Your have score <span className="text-green-600">{validatorResponse.percentagea_assessment}%</span> in
              this assessment.
            </div>
            <div className="my-3 flex gap-5">
              <div className="w-22 flex flex-1 flex-col items-center rounded-xl bg-gray-100 p-3">
                <p className="text-gray-500">Correct</p>
                <p className="font-bold">{validatorResponse.correct_questions}</p>
              </div>
              <div className="w-22 flex flex-col items-center rounded-xl bg-gray-100 p-3">
                <p className="text-gray-500">Incorrect</p>
                <p className="font-bold">{validatorResponse.incorrect_questions}</p>
              </div>
            </div>

            <button
              className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
              onClick={handleNextStep}
              type="button">
              Next unit
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-md border-2 border-gray-300">
          <div className="flex h-96 flex-col items-center justify-center">
            <div>
              <XCircleIcon className="h-20 w-20 text-red-600" />
            </div>
            <div className="text-3xl font-semibold">Don't give up!</div>
            <div className="text-sm font-semibold text-gray-500">
              Your have score{' '}
              <span className="text-red-600">
                {validatorResponse.percentagea_assessment ? validatorResponse.percentagea_assessment : 0}%
              </span>{' '}
              in this assessment.
            </div>
            <div className="text-sm font-semibold text-gray-500">
              The minimum score for this evaluation is{' '}
              <span className="text-green-600">{validatorResponse.minimum_score}%</span>{' '}
            </div>
            <div className="my-3 flex gap-5">
              <div className="w-22 flex flex-1 flex-col items-center rounded-xl bg-gray-100 p-3">
                <p className="text-gray-500">Correct</p>
                <p className="font-bold">{validatorResponse.correct_questions}</p>
              </div>
              <div className="w-22 flex flex-col items-center rounded-xl bg-gray-100 p-3">
                <p className="text-gray-500">Incorrect</p>
                <p className="font-bold">{validatorResponse.incorrect_questions}</p>
              </div>
            </div>

            <button
              className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
              onClick={() => {
                navigate(`/learn/module/${params.moduleId}`)
              }}
              type="button">
              Go back to unit
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
