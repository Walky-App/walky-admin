import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { ChangeEvent, useEffect, useState } from 'react'
import { RadioButton } from 'primereact/radiobutton'
import { Questions } from '../../../../interfaces/unit'
import { RequestService } from '../../../../services/RequestService'
import { useParams } from 'react-router-dom'
import { useAdmin } from '../../../../contexts/AdminContext'

interface QuestionDialogProps {
    visible: boolean
    setVisible: (visible: boolean) => void
    setQuestions: (questions: Questions[]) => void
    selectedQuestion?: Questions
    action: 'create' | 'update'
    show: (severity: "success" | "info" | "warn" | "error" | undefined, summary: string, detail: string) => void
}

interface IAnswer {
    code: number
    value: string
}

export const QuestionDialog = ({ visible, setVisible, setQuestions, selectedQuestion, action, show }: QuestionDialogProps) => {
    const { setUnit, setAssessment } = useAdmin()
    const [header, setHeader] = useState<string>(selectedQuestion?.header || '')
    const [options, setOptions] = useState<string[]>(selectedQuestion?.options || [])
    const [answer, setAnswer] = useState<IAnswer>({ code: 0, value: 'No select' })
    const params = useParams()

    useEffect(() => {
        if (selectedQuestion && action === 'update') {
            setHeader(selectedQuestion.header)
            setOptions(selectedQuestion.options)
            const indexAnswer = selectedQuestion.options.findIndex((option) => option === selectedQuestion.answer)
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
        setAnswer({ code: button.code, value: button.value });
    }


    const onSave = async () => {
        const newQuestion = {
            questions: {
                header,
                options,
                answer: answer.value,
            },
            unitId: params.unitId
        }
        if (action === 'create') {
            const response = await RequestService(`units/assessment/questions`, 'POST', newQuestion)
            setAssessment(response.assessments)
            setQuestions(response.assessments.questions)
            setUnit(response)
            show('success', 'Question added', 'The question has been added successfully')
            setVisible(false)
            clearStates()
        } else {
            if (newQuestion.questions.options.includes(newQuestion.questions.answer)) {
                const response = await RequestService(`units/assessment/questions/${selectedQuestion?._id}`, 'PATCH', newQuestion)
                setAssessment(response.assessments)
                setQuestions(response.assessments.questions)
                setUnit(response)
                show('success', 'Question updated', 'The question has been updated successfully')
                setVisible(false)
                clearStates()
            } else {
                setAnswer({ code: 99, value: 'No select' })
                show('error', 'Error', 'The answer must be one of the options')
            }
        }

    }

    const onCancel = () => {
        setVisible(false)
    }

    const clearStates = () => {
        setHeader('')
        setOptions([])
        setAnswer({ code: 0, value: 'No select' })
    }

    const handleDisableControl = () => {
        if (header !== '' && options[0] !== '' && options[1] !== '' && options[2] !== '' && options[3] !== '') {
            return false
        }
        return true
    }

    return (
        <div>
            <div className="flex justify-center">
                <Dialog
                    blockScroll
                    className='w-4/5'
                    content={
                        <div className="flex flex-col rounded-lg bg-white px-8 py-5 sm:w-full">
                            <div className="flex">
                                Add Question
                            </div>
                            <div className='my-3'>
                                <label className="block text-sm font-medium leading-6 text-gray-900 " htmlFor="title" >
                                    Question text
                                </label>
                                <div className="mt-2 flex ">
                                    <InputText className='flex flex-1' id='question_text' onChange={(e) => setHeader(e.target.value)} placeholder='What are you going to ask?' value={header} />
                                </div>
                            </div>
                            <div className='my-3'>
                                <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="title" >
                                    Options
                                </label>
                                <div className="my-2">
                                    <div className="flex flex-col gap-2 items-center">
                                        <div className="flex justify-center items-center gap-2 w-4/5" >
                                            <RadioButton checked={answer.code === 0} name="option" onChange={(e) => handleAddAnswer(e.value)} value={{ code: 0, value: options[0] }} />
                                            <InputText className='flex flex-1' id='text_option' onChange={(e) => handleAddOption(e, 0)} placeholder='Option A*' value={options[0]} />
                                        </div>
                                        <div className="flex justify-center items-center gap-2 w-4/5" >
                                            <RadioButton checked={answer.code === 1} name="option" onChange={(e) => handleAddAnswer(e.value)} value={{ code: 1, value: options[1] }} />
                                            <InputText className='flex flex-1' id='text_option' onChange={(e) => handleAddOption(e, 1)} placeholder='Option B*' value={options[1]} />
                                        </div>
                                        <div className="flex justify-center items-center gap-2 w-4/5" >
                                            <RadioButton checked={answer.code === 2} name="option" onChange={(e) => handleAddAnswer(e.value)} value={{ code: 2, value: options[2] }} />
                                            <InputText className='flex flex-1' id='text_option' onChange={(e) => handleAddOption(e, 2)} placeholder='Option C*' value={options[2]} />
                                        </div>
                                        <div className="flex justify-center items-center gap-2 w-4/5" >
                                            <RadioButton checked={answer.code === 3} name="option" onChange={(e) => handleAddAnswer(e.value)} value={{ code: 3, value: options[3] }} />
                                            <InputText className='flex flex-1' id='text_option' onChange={(e) => handleAddOption(e, 3)} placeholder='Option D*' value={options[3]} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row justify-between">
                                <Button label="Cancel" onClick={onCancel} severity="secondary" type='button' />
                                <Button disabled={handleDisableControl()} label="Save" onClick={() => onSave()} />
                            </div>
                        </div>
                    }
                    modal
                    onHide={() => setVisible(false)}
                    visible={visible}
                />
            </div>
        </div>
    )
}
