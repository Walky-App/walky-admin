import { useEffect, useState } from "react"
import { useAdmin } from "../../../contexts/AdminContext"
import { RequestService } from "../../../services/RequestService"
import { useNavigate, useParams } from "react-router-dom"
import { cn } from "../../../utils/cn"
import { HeaderComponent } from "../../../components/shared/general/HeaderComponent"
import { ProgressBar } from "primereact/progressbar"
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"

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
    const navigate = useNavigate()

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
                accept: () => {
                    setFinishAssessment(true)
                    console.log(assessmentArray)
                }
            });
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
            {
                !finishAssessment ?

                    <div>
                        <HeaderComponent title={`Assessement - ${unit?.title}`} />
                        <p className="text-sm gray-500 mb-2">{indexQuestion + 1} / {unit?.assessments.questions?.length}</p>
                        <ProgressBar className="h-2" value={progressValue} showValue={false} />

                        <div className="text-xl font-semibold mt-3">
                            {unit?.assessments.questions?.[indexQuestion]?.header}
                        </div>

                        <div className="my-3 gap-5">
                            {unit?.assessments.questions?.[indexQuestion]?.options?.map((option, index) => {
                                return (
                                    <div key={index} className="flex items-center my-2">
                                        <button className={cn(selectAnswer.code === index ? "border-green-500" : 'border-gray-300', "flex gap-2 w-full sm:w-4/5 rounded-md  border-2 p-2 hover:border-green-500")} onClick={() => handleAddAnswer(option, index)} type="button">
                                            {option}
                                        </button>
                                    </div>
                                )
                            })
                            }
                        </div>


                        <div className="flex justify-between sm:justify-end gap-2 ">
                            <button className={cn(indexQuestion == 0 ? 'bg-gray-300' : " bg-green-600 hover:bg-green-500", "rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ")} onClick={() => handlerPreviousQuestion()} disabled={indexQuestion === 0} type="button">Previous</button>
                            <button className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500" onClick={() => handlerControllerQuestion()} type="button">{indexQuestion === (unit?.assessments?.questions?.length ?? 0) - 1 ? 'Submit' : 'Next'}</button>

                        </div>
                    </div> :
                    <div className="border-2 border-gray-300 rounded-md">
                        <div className="flex flex-col justify-center items-center h-96">
                            <div className="text-3xl font-semibold text-green-600">
                                Assessment submitted successfully
                            </div>
                            <div className="text-3xl font-semibold text-gray-500">
                                Coming soon
                            </div>
                            <button className="mt-4 hover:text-green-600" onClick={() => { navigate(`/learn/module/${params.moduleId}/unit/${params.unitId}`) }} type="button">
                                Go back to unit
                            </button>
                        </div>
                    </div>
            }
        </div>
    )
}
