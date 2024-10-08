import { useEffect, useState } from 'react'

import { Controller, useForm, useWatch } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

import { confirmDialog } from 'primereact/confirmdialog'
import { InputNumber } from 'primereact/inputnumber'
import { classNames } from 'primereact/utils'

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/20/solid'

import { useAdmin } from '../../../../contexts/AdminContext'
import { type Questions } from '../../../../interfaces/unit'
import { RequestService } from '../../../../services/RequestService'
import { useUtils } from '../../../../store/useUtils'
import { cn } from '../../../../utils/cn'
import { QuestionDialog } from './QuestionDialog'

interface Props {
  action: 'create' | 'update'
}

export const FormAssessment = ({ action }: Props) => {
  const { showToast } = useUtils()
  const { setUnit, assessment, unit, setAssessment } = useAdmin()
  const [visible, setVisible] = useState(false)
  const [questions, setQuestions] = useState<Questions[]>(assessment?.questions || [])
  const [selectedQuestion, setSelectedQuestion] = useState<Questions>()
  const [actionDialog, setActionDialog] = useState<'create' | 'update'>('create')
  const navigate = useNavigate()
  const params = useParams()

  const defaultValues = {
    time: assessment?.time || 0,
    min_score: assessment?.min_score || 0,
  }

  useEffect(() => {
    if (!assessment && action === 'update') {
      navigate(`/admin/learn/modules/${params.moduleId}/units`)
    }
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues })

  const time_watch = useWatch({
    control,
    name: 'time',
  })

  const min_score_watch = useWatch({
    control,
    name: 'min_score',
  })

  const onSubmit = async (data: { time: number; min_score: number }) => {
    if (data.time === 0 || data.min_score === 0) {
      showToast({ severity: 'error', detail: 'Error', summary: 'Please fill all the required fields' })
      return
    }

    if (questions.length === 0) {
      showToast({ severity: 'error', detail: 'Error', summary: 'Please add at least one question' })
      return
    }

    const bodyRequest = {
      assessments: {
        time: data.time,
        min_score: data.min_score,
      },
      assesmentId: unit?.assessments._id,
    }

    if (action === 'update') {
      try {
        const response = await RequestService(`units/assessment`, 'PATCH', bodyRequest)
        if (response.message === 'Unit not found') {
          showToast({ severity: 'error', detail: 'Error', summary: 'Unit not found' })
          return
        }
        if (response) {
          showToast({ severity: 'success', detail: 'Assessment updated', summary: 'Assessment updated successfully' })
          setUnit(response)
        }
      } catch (error) {
        showToast({ severity: 'error', detail: 'Error', summary: 'An error occurred' })
      }
    }
  }

  const getFormErrorMessage = (name: string) => {
    return errors[name as keyof typeof errors] ? (
      <small className="p-error">{errors[name as keyof typeof errors]?.message}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    )
  }

  const handlerSetAssessment = () => {
    setAssessment({
      time: time_watch,
      min_score: min_score_watch,
    })
    setSelectedQuestion(undefined)
    setActionDialog('create')
    setVisible(true)
  }

  const handlerEditQuestion = (question: Questions) => {
    setSelectedQuestion(question)
    setActionDialog('update')
    setVisible(true)
  }

  const handlerDeleteQuestion = (question: Questions) => {
    confirmDialog({
      message: 'Are you sure you want to proceed?',
      header: 'Delete question',
      icon: 'pi pi-info-circle',
      defaultFocus: 'accept',
      acceptClassName: 'p-button-danger',
      style: { width: '50vw' },
      breakpoints: { '1100px': '75vw', '960px': '100vw' },
      accept: async () => {
        const response = await RequestService(`units/assessment/question`, 'DELETE', {
          questionId: question._id,
          unitId: params.unitId,
        })
        setQuestions(response.assessments.questions)
        showToast({ severity: 'success', detail: 'Question deleted', summary: 'Question deleted successfully' })
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <QuestionDialog
        action={actionDialog}
        selectedQuestion={selectedQuestion}
        setQuestions={setQuestions}
        setVisible={setVisible}
        visible={visible}
      />
      <div className="pb-12">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <div className="mt-2">
              <Controller
                control={control}
                name="time"
                render={({ field, fieldState }) => (
                  <>
                    <label className={classNames({ 'p-error': errors.time }, 'ml-1')} htmlFor={field.name}>
                      Assessment times*
                      <span className="p-float-label ml-1 pt-1">
                        <InputNumber
                          className={classNames({ 'p-invalid': fieldState.error })}
                          onValueChange={e => field.onChange(e.target.value)}
                          suffix=" minutes"
                          value={Number(field.value)}
                        />
                      </span>
                    </label>
                    {getFormErrorMessage(field.name)}
                  </>
                )}
                rules={{ required: 'Assessment time is required.' }}
              />
            </div>
          </div>
          <div className="sm:col-span-3">
            <div className="mt-2">
              <Controller
                control={control}
                name="min_score"
                render={({ field, fieldState }) => (
                  <>
                    <label className={classNames({ 'p-error': errors.time }, 'ml-1')} htmlFor={field.name}>
                      Min Score*
                      <span className="p-float-label ml-1 pt-1">
                        <InputNumber
                          className={classNames({ 'p-invalid': fieldState.error })}
                          max={100}
                          maxLength={5}
                          onValueChange={e => field.onChange(e.target.value)}
                          prefix="% "
                          value={Number(field.value)}
                        />
                      </span>
                    </label>
                    {getFormErrorMessage(field.name)}
                  </>
                )}
                rules={{ required: 'Min score is required.' }}
              />
            </div>
          </div>
          <div className="col-span-full">
            <label className="block  font-medium leading-6 text-gray-900" htmlFor="description">
              Questions
            </label>
            <div className="mt-3 flex h-auto flex-col">
              <button
                className={cn(
                  'mx-3 flex flex-row justify-center rounded-2xl border bg-gray-200 p-3 text-left  text-white  ',
                  {
                    'bg-green-600 hover:bg-green-500': time_watch !== 0 && min_score_watch !== 0,
                  },
                )}
                onClick={handlerSetAssessment}
                disabled={time_watch === 0 || min_score_watch === 0}
                type="button">
                <PlusIcon className="h-5 w-5" />
                <div>Add Question</div>
              </button>

              {questions.map(question => {
                return (
                  <div className="mt-3 flex rounded-lg border-2 border-gray-200 p-2 shadow-md" key={question._id}>
                    <div className="flex flex-1 items-center text-xl">{question.header}</div>
                    <div className="flex">
                      <button
                        className="p-2 hover:text-green-400"
                        onClick={() => handlerEditQuestion(question)}
                        type="button">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        className="p-2 hover:text-red-600"
                        onClick={() => handlerDeleteQuestion(question)}
                        type="button">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          className=" font-semibold leading-6 text-gray-900"
          onClick={() => {
            navigate(`/admin/learn/modules/${params.moduleId}/units`)
          }}
          type="button">
          Cancel
        </button>
        <button
          className="rounded-md bg-green-600 px-3 py-2  font-semibold text-white shadow-sm hover:bg-green-500"
          type="submit">
          {action === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </form>
  )
}
