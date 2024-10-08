import { useNavigate } from 'react-router-dom'

import { Card } from 'primereact/card'

import { BriefcaseIcon, ClockIcon, NewspaperIcon } from '@heroicons/react/24/outline'

import { useAdmin } from '../../../contexts/AdminContext'
import { type Module } from '../../../interfaces/module'
import { useLearn } from '../../../store/useLearn'
import { secondsToTimeDescription } from '../../../utils/functionUtils'
import { CircularProgressBar } from './CircularProgressBar'

interface ModuleCardsProps {
  module: Module[]
  filter?: string
  isLoading: boolean
}

export const ModuleCards = ({ module, filter = '', isLoading = true }: ModuleCardsProps) => {
  const { setModule } = useAdmin()
  const { record } = useLearn()
  const navigate = useNavigate()

  const modulesFilter = () => {
    const modulesTemp = [...module]
    return modulesTemp.filter(module => module.title.toLowerCase().includes(filter.toLocaleLowerCase()))
  }

  const handlerSetModule = (module: Module) => {
    setModule(module)
    navigate(`/learn/module/${module._id}`)
  }

  const unitsCompleted = (_id: string, idCategory: string) => {
    try {
      const category = record.categories.find(data => data.category === idCategory)
      const module = category?.modules.find(data => data.module === _id)
      return module?.units.filter(unit => unit.assessments_completed === true).length ?? 0
    } catch (error) {
      return 0
    }
  }

  return (
    <div>
      {!isLoading ? (
        <div>
          {module.length !== 0 ? (
            <div>
              {modulesFilter().map(module => (
                <Card
                  className="cursor-pointer hover:shadow-lg"
                  key={module._id}
                  onClick={() => handlerSetModule(module)}
                  pt={{
                    body: { className: 'p-0 mb-16' },
                    content: { className: 'p-0 md:flex' },
                  }}>
                  <div className="md:m-3">
                    {module.image ? (
                      <img
                        alt={`Hemp Temp ${module.title} module`}
                        className="h-72 w-full object-cover sm:h-32 md:h-full md:w-36 md:rounded-xl"
                        src={module.image}
                      />
                    ) : (
                      <div className="h-full w-36 rounded-xl bg-neutral-200" />
                    )}
                  </div>
                  <div className="m-3 flex flex-1 flex-col justify-center gap-3">
                    <div className="text-xl font-semibold">{module.title}</div>
                    <div className="inline-flex h-5 w-full items-center justify-start gap-2">
                      <div className="flex items-center justify-start gap-1">
                        <ClockIcon className="h-5" />
                        <div className="flex h-5 items-center font-medium">
                          {secondsToTimeDescription(module.total_time)}
                        </div>
                      </div>
                      <div className="h-1 w-1 rounded-full bg-stone-500" />
                      <div className="flex items-center justify-start gap-1">
                        <NewspaperIcon className="h-5" />
                        <div className="flex h-5 items-center font-medium">{module.units?.length} Videos</div>
                      </div>
                      <div className="h-1 w-1 rounded-full bg-stone-500" />
                      <div className="flex items-center justify-start gap-1">
                        <BriefcaseIcon className="h-5" />
                        <div className="flex h-5 items-center font-medium">{module.level}</div>
                      </div>
                    </div>
                    <div className="line-clamp-2 h-12">{module.description}</div>
                  </div>
                  <div className="m-8 flex-col items-center md:m-3">
                    Videos Completed
                    <CircularProgressBar
                      progressData={{
                        total: module.units?.length || 0,
                        complete: unitsCompleted(module._id, module.category._id),
                      }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div>
              <div className="flex h-96 flex-col items-center justify-center">
                <div className="text-2xl font-semibold">No modules found</div>
                <div className="">We are working on the modules for you, coming soon</div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex h-96 flex-col items-center justify-center">
          <div className="text-2xl font-semibold">Loading ...</div>
        </div>
      )}
    </div>
  )
}
