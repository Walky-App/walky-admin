import { useNavigate } from "react-router-dom"
import HeaderComponent from "../../../components/shared/general/HeaderComponent"
import { useEffect } from "react"
import FormModule from "./components/FormModule"
import { useAdmin } from "../../../contexts/AdminContext"



export default function AdminDetailsModule() {
    const { module, categoryOptions } = useAdmin()
    const navigate = useNavigate()

    useEffect(() => {
        if (!module || categoryOptions.length <= 1) {
            console.log(categoryOptions.length)
            navigate('/admin/learn/modules')
        }
    })

    return (
        <div className="w-full sm:overflow-x-hidden">
            <HeaderComponent title={'Update Module'} />
            <FormModule action="edit" module={module} />
        </div>
    )
}
