import { HeaderComponent } from "../../../components/shared/general/HeaderComponent"
import { FormAssessment } from "./components/FormAssessment"

export const AdminAddAssessment = () => {


    return (
        <div className="w-full sm:overflow-x-hidden">
            <HeaderComponent title='Create Assessment' />
            <FormAssessment action='create' />
        </div>
    )
}
