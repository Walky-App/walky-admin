import type { ChangeEvent } from 'react'
import { useEffect, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { RadioButton } from 'primereact/radiobutton'

import { useAdmin } from '../../../../contexts/AdminContext'
import type { Questions } from '../../../../interfaces/unit'
import { RequestService } from '../../../../services/RequestService'
import { useUtils } from '../../../../store/useUtils'

interface QuestionDialogProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  setQuestions: (questions: Questions[]) => void
  selectedQuestion?: Questions
  action: 'create' | 'update'
}

interface IAnswer {
  code: number
  value: string
}

export const QuestionDialog = ({
  visible,
  setVisible,
  setQuestions,
  selectedQuestion,
  action,
}: QuestionDialogProps) => {
  const { showToast } = useUtils()
  const { setUnit, setAssessment, unit, assessment } = useAdmin()
  const [header, setHeader] = useState<string>(selectedQuestion?.header ?? '')
  const [options, setOptions] = useState<string[]>(selectedQuestion?.options || [])
  const [answer, setAnswer] = useState<IAnswer>({ code: 99, value: 'No select' })
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (selectedQuestion && action === 'update') {
      setHeader(selectedQuestion.header)
      setOptions(selectedQuestion.options)
      const indexAnswer = selectedQuestion.options.findIndex(option => option === selectedQuestion.answer)
      setAnswer({ code: indexAnswer, value: selectedQuestion.answer })
    } else {
      clearStates()
    }
  }, [selectedQuestion, action])

  const handleAddOption = (value: ChangeEvent<HTMLInputElement>, index: number) => {
    const newOptions = [...options]
    newOptions[index] = value.target.value
    setOptions(newOptions)
  }

  const handleAddAnswer = (button: IAnswer) => {
    setAnswer({ code: button.code, value: button.value })
  }

  const onSave = async () => {
    const newQuestion = {
      questions: {
        header,
        options,
        answer: answer.value,
      },
      assessment: {
        time: assessment?.time,
        min_score: assessment?.min_score,
      },
      unitId: params.unitId,
    }
    if (action === 'create') {
      const response = await RequestService(`units/assessment/questions`, 'POST', newQuestion)
      setAssessment(response.assessments)
      setQuestions(response.assessments.questions)
      showToast({ severity: 'success', detail: 'Question added', summary: 'The question has been added successfully' })
      if (unit?.assessments === undefined) {
        setUnit(response)
        navigate(
          `/admin/learn/modules/${params.moduleId}/units/${params.unitId}/assessment/${response.assessments?._id}`,
        )
      }
      setUnit(response)
      clearStates()
      setVisible(false)
    } else {
      if (newQuestion.questions.options.includes(newQuestion.questions.answer)) {
        const response = await RequestService(
          `units/assessment/questions/${selectedQuestion?._id}`,
          'PATCH',
          newQuestion,
        )
        setAssessment(response.assessments)
        setQuestions(response.assessments.questions)
        setUnit(response)
        showToast({
          severity: 'success',
          detail: 'Question updated',
          summary: 'The question has been updated successfully',
        })
        setVisible(false)
        clearStates()
      } else {
        setAnswer({ code: 99, value: 'No select' })
        showToast({ severity: 'error', detail: 'Error', summary: 'The answer must be one of the options' })
      }
    }
  }

  const onCancel = () => {
    setVisible(false)
  }

  const clearStates = () => {
    setHeader('')
    setOptions([])
    setAnswer({ code: 99, value: 'No select' })
  }

  const handleDisableControl = () => {
    return ![header, ...options].every(item => item !== '')
  }

  return (
    <div className="flex justify-center">
      <Dialog
        blockScroll
        className="w-4/5"
        content={
          <div className="flex flex-col rounded-lg bg-white px-8 py-5 sm:w-full">
            <div className="my-3">
              <label className="block font-medium leading-6 text-gray-900 " htmlFor="title">
                Question text
              </label>
              <div className="mt-2 flex">
                <InputText
                  className="flex flex-1"
                  id="question_text"
                  onChange={e => setHeader(e.target.value)}
                  placeholder="What are you going to ask?"
                  value={header}
                />
              </div>
            </div>
            <div className="my-3">
              <label className="block font-medium leading-6 text-gray-900" htmlFor="title">
                Options
              </label>
              <div className="my-2">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex w-4/5 items-center justify-center gap-2">
                    <RadioButton
                      checked={answer.code === 0}
                      name="option"
                      onChange={e => handleAddAnswer(e.value)}
                      value={{ code: 0, value: options[0] }}
                    />
                    <InputText
                      className="flex flex-1"
                      id="text_option"
                      onChange={e => handleAddOption(e, 0)}
                      placeholder="Option A*"
                      value={options[0]}
                    />
                  </div>
                  <div className="flex w-4/5 items-center justify-center gap-2">
                    <RadioButton
                      checked={answer.code === 1}
                      name="option"
                      onChange={e => handleAddAnswer(e.value)}
                      value={{ code: 1, value: options[1] }}
                    />
                    <InputText
                      className="flex flex-1"
                      id="text_option"
                      onChange={e => handleAddOption(e, 1)}
                      placeholder="Option B*"
                      value={options[1]}
                    />
                  </div>
                  <div className="flex w-4/5 items-center justify-center gap-2">
                    <RadioButton
                      checked={answer.code === 2}
                      name="option"
                      onChange={e => handleAddAnswer(e.value)}
                      value={{ code: 2, value: options[2] }}
                    />
                    <InputText
                      className="flex flex-1"
                      id="text_option"
                      onChange={e => handleAddOption(e, 2)}
                      placeholder="Option C*"
                      value={options[2]}
                    />
                  </div>
                  <div className="flex w-4/5 items-center justify-center gap-2">
                    <RadioButton
                      checked={answer.code === 3}
                      name="option"
                      onChange={e => handleAddAnswer(e.value)}
                      value={{ code: 3, value: options[3] }}
                    />
                    <InputText
                      className="flex flex-1"
                      id="text_option"
                      onChange={e => handleAddOption(e, 3)}
                      placeholder="Option D*"
                      value={options[3]}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button label="Cancel" onClick={onCancel} severity="secondary" type="button" />
              <Button disabled={handleDisableControl()} label="Save" onClick={() => onSave()} />
            </div>
          </div>
        }
        modal
        onHide={() => setVisible(false)}
        visible={visible}
      />
    </div>
  )
}
