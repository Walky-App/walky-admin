import { useState } from 'react'
import { SelectedOption } from '../../../../components/shared/general/SelectedOption'
import { states } from '../../../../utils/VariablesUtils'
import { Chip } from '@nextui-org/chip'
import { TagsInterface } from '../../../../interfaces/global'

interface Props {
  tags: TagsInterface[]
  setTags: (value: TagsInterface[]) => void
  optional: boolean
}

export const TagsArray = ({ tags, setTags, optional = false }: Props) => {
  const [state, setState] = useState<string>('')
  const [value, setValue] = useState<number>(0)

  const handleClose = (chipsToRemove: TagsInterface) => {
    setTags(tags.filter(chips => chips !== chipsToRemove))
  }

  const handleAdd = () => {
    const valueAdd: TagsInterface = { state, value }
    if (state !== 'all' && state !== '' && value > 0) {
      if (!tags.find(chips => chips.state === state)) {
        const tagsAdd = [...tags]
        tagsAdd.push(valueAdd)
        setTags(tagsAdd)
      } else {
        const tagsRemplace = tags.map(chips => {
          if (chips.state === state) {
            return valueAdd
          }
          return chips
        })
        setTags(tagsRemplace)
      }
    }
  }

  return (
    <>
      <label className="block text-sm font-medium leading-6 text-gray-900">
        Values for states {optional ? '(optional)' : null}
      </label>
      <div className="flex flex-col gap-3 mt-3 rounded-md sm:flex-row sm:max-w-md w-full">
        <SelectedOption classStyle="min-w-40" selectedOptions={states} setSelectedOptions={setState} />
        <input
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
          id="value"
          min={0}
          name="value"
          onChange={e => setValue(parseFloat(e.target.value))}
          placeholder=" $0.01/hour"
          step={0.01}
          type="number"
          value={value}
        />
        <button
          className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          onClick={handleAdd}
          type="button"
        >
          Add
        </button>
      </div>
      <div className="flex gap-2 mt-3">
        {tags.map((chips, index) => (
          <Chip
            classNames={{
              base: 'rounded-xl border-0 ring-2 ring-inset ring-green-600',
              content: 'text-black',
              closeButton:
                'z-0 appearance-none outline-none select-none transition-opacity opacity-70 hover:opacity-100 cursor-pointer active:opacity-disabled tap-highlight-transparent text-large',
            }}
            key={`tag-${index}`}
            onClose={() => handleClose(chips)}
            variant="bordered"
          >
            {chips.state}: ${chips.value}/hr
          </Chip>
        ))}
      </div>
    </>
  )
}
