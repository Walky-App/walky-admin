import { PlusIcon } from '@heroicons/react/20/solid'
import { NavigationButtonInterface } from '../../../interfaces/Global'
import { useNavigate } from 'react-router-dom'

export default function NavigationButton({ to, text, disbalePlusIcon = false }: NavigationButtonInterface) {
  const navigate = useNavigate()
  const handlerButton = () => {
    navigate(to)
  }
  return (
    <button
      type="button"
      onClick={handlerButton}
      className={`inline-flex items-center rounded-md ${disbalePlusIcon ? 'bg-gray-500 hover:bg-gray-400' : 'bg-green-800 hover:bg-green-600'}  px-3 py-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline `}>
      {
        disbalePlusIcon ? null :
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
      }
      {text}
    </button>
  )
}
