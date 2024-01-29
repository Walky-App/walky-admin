import { Link } from 'react-router-dom'
import { ShieldCheckIcon } from '@heroicons/react/20/solid'
import { Module } from '../../../interfaces/Module'
import { BriefcaseIcon, ClockIcon, NewspaperIcon } from '@heroicons/react/24/outline'
import CircularProgressBar from './CircularProgressBar'

interface ModuleCardsProps {
  module: Module[]
  filter?: string
  isLoading: boolean
}

const secondsToHours = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  return `${hours}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

export default function ModuleCards({ module, filter = '', isLoading = true }: ModuleCardsProps) {
  const dataTemp = {
    total: 3,
    complete: 2,
  }

  const modulesFilter = () => {
    const modulesTemp = [...module]
    return modulesTemp.filter(module => module.title.toLowerCase().includes(filter.toLocaleLowerCase()))
  }
  return (
    <>
      {!isLoading ? (
        <>
          {module.length !== 0 ? (
            <>
              {modulesFilter().map(module => (
                <div key={module._id} className="mb-4 flex h-30 rounded-2xl border border-zinc-100 bg-white sm:h-32">
                  <div className="m-3">
                    {module.image ? (
                      <img
                        alt={`Hemp Temp ${module.title} module`}
                        src={module.image}
                        className="h-full w-36 rounded-xl"
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
                          {secondsToHours(module.total_time)} Time
                        </div>
                      </div>
                      <div className="h-1 w-1 rounded-full bg-stone-500"></div>
                      <div className="flex items-center justify-start gap-1">
                        <NewspaperIcon className="h-5" />
                        <div className="flex items-center h-5 text-xs font-medium text-black">
                          {module.units?.length} Units
                        </div>
                      </div>
                      <div className="h-1 w-1 rounded-full bg-stone-500"></div>
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
                    <CircularProgressBar progressData={dataTemp} />
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center h-96">
                <div className="text-2xl font-semibold text-black">No modules found</div>
                <div className="text-sm font-normal text-stone-500">
                  We are working on the modules for you, coming soon
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-2xl font-semibold text-black">Loading ...</div>
        </div>
      )}
    </>
  )
}
