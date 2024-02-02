import { PlusIcon } from "@heroicons/react/20/solid";
import { NavigationButtonInterface } from "../../../interfaces/Global";
import { useNavigate } from "react-router-dom";


export default function NavigationButton({ to, text }: NavigationButtonInterface) {
    const navigate = useNavigate()
    const handlerButton = () => {
        navigate(to)
    }
    return (
        <button
            type="button"
            onClick={handlerButton}
            className="inline-flex items-center rounded-md bg-green-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            {text}
        </button>
    )
}
