import { useNavigate } from "react-router-dom"
import HeaderComponent from "../../../components/shared/general/HeaderComponent"
import { useEffect } from "react"
import FormModule from "./components/FormModule"
import { useAdmin } from "../../../contexts/AdminContext"



export default function AdminDetailsModule() {
    const { module } = useAdmin()
    const navigate = useNavigate()

    useEffect(() => {
        if (!module) {
            navigate('/admin/learn/modules')
        }

    }, [])

    return (
        <div className="w-full sm:overflow-x-hidden">
            <HeaderComponent title={'Update Module'} />
            <FormModule action="edit" module={module} />
        </div>
    )
}
