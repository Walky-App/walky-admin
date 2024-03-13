import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Controller, useForm } from "react-hook-form"
import { classNames } from "primereact/utils"
import { Toast } from "primereact/toast"
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/20/solid"
import { QuestionDialog } from "./QuestionDialog"
import { Questions } from "../../../../interfaces/unit"
import { InputNumber } from "primereact/inputnumber"
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"
import { RequestService } from "../../../../services/RequestService"
import { useAdmin } from "../../../../contexts/AdminContext"



interface Props {
    action: "create" | "update"
}

export const FormAssessment = ({ action }: Props) => {
    const { setUnit, assessment } = useAdmin()
    const [visible, setVisible] = useState(false)
    const [questions, setQuestions] = useState<Questions[]>(assessment?.questions || [])
    const [selectedQuestion, setSelectedQuestion] = useState<Questions>()
    const [actionDialog, setActionDialog] = useState<'create' | 'update'>('create')
    const navigate = useNavigate()
    const params = useParams()


    const toast = useRef<Toast>(null);

    const show = (severity: "success" | "info" | "warn" | "error" | undefined, summary: string, detail: string) => {
        if (toast.current) {
            toast.current.show({ severity, summary, detail });
        }
    };

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
    } = useForm({ defaultValues });

    const onSubmit = async (data: { time: number, min_score: number }) => {
        if (data.time === 0 || data.min_score === 0) {
            show('error', 'Error', 'Please fill all the required fields')
            return
        }

        if (questions.length === 0) {
            show('error', 'Error', 'Please add at least one question')
            return
        }

        const bodyRequest = {
            assessments: {
                time: data.time,
                min_score: data.min_score,
                questions: questions,
            },
            unitId: params.unitId
        }

        if (action === 'create') {
            try {
                const response = await RequestService(`units/assessment`, 'POST', bodyRequest)
                if (response.message === 'Unit not found') {
                    show('error', 'Error', 'Unit not found')
                    return
                }
                if (response) {
                    show('success', 'Assessment created', 'Assessment created successfully')
                    setUnit(response)
                    navigate(`/admin/learn/modules/${params.moduleId}/units/${params.unitId}/assessment/${response.assessments?._id}`)
                }
            } catch (error) {
                show('error', 'Error', 'An error occurred')
            }
        } else {
            try {
                const response = await RequestService(`units/assessment`, 'PATCH', bodyRequest)
                if (response.message === 'Unit not found') {
                    show('error', 'Error', 'Unit not found')
                    return
                }
                if (response) {
                    show('success', 'Assessment updated', 'Assessment updated successfully')
                    setUnit(response)
                }
            } catch (error) {
                show('error', 'Error', 'An error occurred')
            }
        }
    }

    const getFormErrorMessage = (name: string) => {
        return errors[name as keyof typeof errors] ? <small className="p-error">{errors[name as keyof typeof errors]?.message}</small> : <small className="p-error">&nbsp;</small>;
    };

    const handlerSetAssessment = () => {
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
            accept: () => {
                const newQuestions = questions.filter((item) => item.header !== question.header)
                setQuestions(newQuestions)
                show('success', 'Question deleted', 'Question deleted successfully')
            },
            reject: () => {
                // Add your reject logic here
            }
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Toast position="bottom-right" ref={toast} />
            <QuestionDialog
                action={actionDialog}
                selectedQuestion={selectedQuestion}
                setQuestions={setQuestions}
                setVisible={setVisible}
                show={show}
                visible={visible}
            />
            <ConfirmDialog />
            <div className="pb-12">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <div className="mt-2">
                            <Controller
                                control={control}
                                name="time"
                                render={({ field, fieldState }) => (
                                    <>
                                        <label className={classNames({ 'p-error': errors.time }, 'ml-1')} htmlFor={field.name} >
                                            Assessment times*
                                            <span className="p-float-label ml-1 pt-1">
                                                <InputNumber
                                                    className={classNames({ 'p-invalid': fieldState.error })}
                                                    onValueChange={(e) => field.onChange(e.target.value)}
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
                                        <label className={classNames({ 'p-error': errors.time }, 'ml-1')} htmlFor={field.name} >
                                            Min Score*
                                            <span className="p-float-label ml-1 pt-1">
                                                <InputNumber
                                                    className={classNames({ 'p-invalid': fieldState.error })}
                                                    max={100}
                                                    maxLength={5}
                                                    onValueChange={(e) => field.onChange(e.target.value)}
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
                        <label className="block text-sm font-medium leading-6 text-gray-900" htmlFor="description" >
                            Questions
                        </label>
                        <div className="flex flex-col h-auto mt-3">
                            <button className="mx-3 flex flex-row justify-center rounded-2xl border bg-green-600 p-3 text-left text-sm text-white hover:bg-green-500 " onClick={handlerSetAssessment} type="button">
                                <PlusIcon className="h-5 w-5" />
                                <div>Add Questions</div>
                            </button>

                            {
                                questions.map((question) => {
                                    return (
                                        <div className='mt-3 border-2 border-gray-200 rounded-lg flex p-2 shadow-md' key={question._id}>
                                            <div className="flex flex-1 items-center">{question.header}</div>
                                            <div className="flex">
                                                <button className="p-2 hover:text-green-400" onClick={() => handlerEditQuestion(question)} type="button"><PencilIcon className="w-5 h-5" /></button>
                                                <button className="p-2 hover:text-red-600" type="button"><TrashIcon className="w-5 h-5" /></button>
                                            </div>
                                        </div>
                                    );
                                })
                            }

                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    className="text-sm font-semibold leading-6 text-gray-900"
                    onClick={() => { navigate(`/admin/learn/modules/${params.moduleId}/units`) }}
                    type="button"
                >
                    Cancel
                </button>
                <button
                    className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                    type="submit"
                >
                    {action === 'create' ? 'Create' : 'Save'}
                </button>
            </div>
        </form>
    )
}
