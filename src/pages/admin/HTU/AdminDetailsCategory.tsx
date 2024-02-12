import { useNavigate } from "react-router-dom"
import HeaderComponent from "../../../components/shared/general/HeaderComponent"
import { useEffect } from "react"
import FormCategory from "./components/FormCategory"
import { useAdmin } from "../../../contexts/AdminContext"



export default function AdminDetailsCategory() {
    const { category } = useAdmin()
    const navigate = useNavigate()

    useEffect(() => {
        if (!category) {
            navigate('/admin/learn/categories')
        }
    })

    return (
        <div className="w-full sm:overflow-x-hidden">
            <HeaderComponent title={'Update Category'} />
            <FormCategory action="edit" category={category} />
        </div>
    )
}
