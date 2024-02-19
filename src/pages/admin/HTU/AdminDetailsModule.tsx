import { useNavigate } from "react-router-dom"
import HeaderComponent from "../../../components/shared/general/HeaderComponent"
import { useEffect } from "react"
import FormModule from "./components/FormModule"
import { useAdmin } from "../../../contexts/AdminContext"
import { DisableButtonInterface } from "../../../interfaces/Global"



export default function AdminDetailsModule() {
    const { module, categoryOptions } = useAdmin()
    const navigate = useNavigate()

    const disableButtonData: DisableButtonInterface = {
        path: `modules/disable/${module?._id}`,
        status: module?.is_disabled as boolean,
        redirect: '/admin/learn/modules'
    }

    useEffect(() => {
        if (!module || categoryOptions.length <= 1) {
            console.log(categoryOptions.length)
            navigate('/admin/learn/modules')
        }
    })

    return (
        <div className="w-full sm:overflow-x-hidden">
            <HeaderComponent title={'Update Module'} disableButton={disableButtonData} />
            <FormModule action="edit" module={module} />
        </div>
    )
}
