import { useEffect } from "react"
import { HeaderComponent } from "../../../components/shared/general/HeaderComponent"
import { useAdmin } from "../../../contexts/AdminContext"
import { FormAssessment } from "./components/FormAssessment"
import { RequestService } from "../../../services/RequestService"
import { useParams } from "react-router-dom"

export const AdminDetailsAssessment = () => {
    const { assessment, setAssessment } = useAdmin()
    const params = useParams()

    const fetchData = async () => {
        const response = await RequestService(`units/${params.unitId}/assessment`)
        setAssessment(response)
    }

    useEffect(() => {
        if (!assessment) {
            fetchData()
        }
    })



    return (
        <div className="w-full sm:overflow-x-hidden">
            <HeaderComponent title='Details Assessment' />
            <FormAssessment action='update' />
        </div>
    )
}
