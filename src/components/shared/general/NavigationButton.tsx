import { PlusIcon } from '@heroicons/react/20/solid'
import { NavigationButtonInterface } from '../../../interfaces/global'
import { useNavigate } from 'react-router-dom'

export const NavigationButton = ({ to, text, disbalePlusIcon = false }: NavigationButtonInterface) => {
  const navigate = useNavigate()
  const handlerButton = () => {
    navigate(to)
  }
  return (
    <button
      className={`inline-flex items-center rounded-md ${disbalePlusIcon ? 'bg-gray-500 hover:bg-gray-400' : 'bg-green-800 hover:bg-green-600'}  px-3 py-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline `}
      onClick={handlerButton}
      type="button"
    >
      {
        disbalePlusIcon ? null :
          <PlusIcon aria-hidden="true" className="-ml-0.5 mr-1.5 h-5 w-5" />
      }
      {text}
    </button>
  )
}
