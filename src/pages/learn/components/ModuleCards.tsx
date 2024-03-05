import { Module } from '../../../interfaces/Module';
import { BriefcaseIcon, ClockIcon, NewspaperIcon } from '@heroicons/react/24/outline'
import { CircularProgressBar } from './CircularProgressBar'
import { secondsToTimeDescription } from '../../../utils/FunctionUtils'
import { useNavigate } from 'react-router-dom';

interface ModuleCardsProps {
  module: Module[]
  filter?: string
  isLoading: boolean
}

export const ModuleCards = ({ module, filter = '', isLoading = true }: ModuleCardsProps) => {
  const navigate = useNavigate()

  const modulesFilter = () => {
    const modulesTemp = [...module]
    return modulesTemp.filter(module => module.title.toLowerCase().includes(filter.toLocaleLowerCase()))
  }

  const handlerSetModule = (module: Module) => {
    navigate(`/learn/module/${module._id}`)
  }

  return (
    <div>
      {!isLoading ? (
        <div>
          {module.length !== 0 ? (
            <div>
              {modulesFilter().map(module => (
                <button className="mb-4 flex h-30 rounded-2xl border border-zinc-100 bg-white sm:h-32 cursor-pointer" key={module._id} onClick={() => handlerSetModule(module)} type='button'>
                  <div className="m-3">
                    {module.image ? (
                      <img
                        alt={`Hemp Temp ${module.title} module`}
                        className="h-full w-36 rounded-xl"
                        src={module.image}
                      />
                    ) : (
                      <div className="h-full w-36 rounded-xl bg-neutral-200" />
                    )}
                  </div>
                  <div className="m-3 flex flex-1 flex-col justify-center gap-3">
                    <div className="text-xl font-semibold text-black">{module.title}</div>
                    <div className="inline-flex h-5 w-full items-center justify-start gap-2">
                      <div className="flex items-center justify-start gap-1">
                        <ClockIcon className="h-5" />
                        <div className="flex items-center h-5 text-xs font-medium text-black">
                          {secondsToTimeDescription(module.total_time)}
                        </div>
                      </div>
                      <div className="h-1 w-1 rounded-full bg-stone-500" />
                      <div className="flex items-center justify-start gap-1">
                        <NewspaperIcon className="h-5" />
                        <div className="flex items-center h-5 text-xs font-medium text-black">
                          {module.units?.length} Units
                        </div>
                      </div>
                      <div className="h-1 w-1 rounded-full bg-stone-500" />
                      <div className="flex items-center justify-start gap-1">
                        <BriefcaseIcon className="h-5" />
                        <div className="flex items-center h-5 text-xs font-medium text-black">{module.level}</div>
                      </div>
                    </div>
                    <div className="h-12 text-xs font-normal text-stone-500">
                      Investigate the cultivation and processing of cannabis, starting from seeds to a diversity of end
                      products...
                    </div>
                  </div>
                  <div className="m-3 flex flex-col items-center">
                    <CircularProgressBar progressData={{
                      total: module.units?.length || 0,
                      complete: 0,
                    }} />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div>
              <div className="flex flex-col items-center justify-center h-96">
                <div className="text-2xl font-semibold text-black">No modules found</div>
                <div className="text-sm font-normal text-stone-500">
                  We are working on the modules for you, coming soon
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-2xl font-semibold text-black">Loading ...</div>
        </div>
      )}
    </div>
  )
}
