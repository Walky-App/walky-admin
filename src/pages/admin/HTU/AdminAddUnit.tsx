import { useState } from 'react'

import { useForm } from 'react-hook-form'

import { HeadingComponent } from '../../../components/shared/general/HeadingComponent'
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
      <HeadingComponent title="New Unit" />
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
