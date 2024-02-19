import { useNavigate } from "react-router-dom"
import HeaderComponent from "../../../components/shared/general/HeaderComponent"
import { useEffect } from "react"
import FormCategory from "./components/FormCategory"
import { useAdmin } from "../../../contexts/AdminContext"
import { DisableButtonInterface } from '../../../interfaces/Global';



export default function AdminDetailsCategory() {
    const { category } = useAdmin()
    const navigate = useNavigate()

    const disableButtonData: DisableButtonInterface = {
        path: `categories/disable/${category?._id}`,
        status: category?.is_disabled as boolean,
        redirect: '/admin/learn/categories'
    }

    useEffect(() => {
        if (!category) {
            navigate('/admin/learn/categories')
        }
    })

    return (
        <div className="w-full sm:overflow-x-hidden">
            <HeaderComponent title={'Update Category'} disableButton={disableButtonData} />
            <FormCategory action="edit" category={category} />
        </div>
    )
}
