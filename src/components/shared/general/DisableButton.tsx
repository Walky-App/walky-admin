import { useAdmin } from '../../../contexts/AdminContext'
import { DisableButtonInterface } from '../../../interfaces/global'
import { RequestService } from '../../../services/RequestService'
import { useNavigate } from 'react-router-dom'

export const DisableButton = ({ path, status, redirect }: DisableButtonInterface) => {
  const { setCategory, setUnit, setModule } = useAdmin()
  const navigate = useNavigate()
  const handlerButton = async () => {
    await RequestService(path, 'PATCH', { is_disabled: !status })
    setCategory(undefined)
    setUnit(undefined)
    setModule(undefined)
    navigate(redirect)
  }
  return (
    <button
      className={`ml-2 inline-flex items-center rounded-md ${status ? 'bg-green-800 hover:bg-green-600' : 'bg-red-800 hover:bg-red-600'} px-3 py-2 text-sm font-semibold text-white shadow-sm `}
      onClick={handlerButton}
      type="button"
    >
      {status ? 'Active' : 'Disable'}
    </button >
  )
}
