import { useState } from 'react'

import { useForm } from 'react-hook-form'

import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import { FormUnits } from './components/FormUnits'
import type { IUnitFormValues } from './components/FormUnits'

export const AdminAddUnit = () => {
  const [unitTypeChosen, setUnitTypeChosen] = useState<string>('blog')
  const defaultValues = {
    title: '',
    time: 0,
    description: '',
    unitType: 'blog',
    urlVideo: '',
    urlCaptions: '',
    urlImage: '',
  }

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<IUnitFormValues>({ defaultValues })

  return (
    <div className="w-full sm:overflow-x-hidden">
      <HeaderComponent title="Create Unit" />
      <FormUnits
        control={control}
        errors={errors}
        handleSubmit={handleSubmit}
        unitTypeChosen={unitTypeChosen}
        setUnitTypeChosen={setUnitTypeChosen}
        action="create"
      />
    </div>
  )
}
