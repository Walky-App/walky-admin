import { create } from 'zustand'

import type { ProgressHTU } from '../interfaces/htu'

interface State {
  record: ProgressHTU
  setRecord: (data: ProgressHTU) => void
  getUnitsIdCompleted: (_id: string) => string[]
  expireTime: boolean
  setExpireTime: (valid: boolean) => void
}

export const useLearn = create<State>((set, get) => ({
  record: {
    _id: '',
    user: '',
    categories: [
      {
        category: '',
        is_completed: false,
        url_certificate: '',
        modules: [
          {
            module: '',
            is_completed: false,
            units: [{ unit: '', assessments_completed: false, assessment_results_records: [] }],
          },
        ],
      },
    ],
  },
  expireTime: false,
  setExpireTime: valid => set({ expireTime: valid }),

  setRecord: data => set({ record: data }),
  getUnitsIdCompleted: _id => {
    try {
      const { record } = get()
      const category = record.categories.find(data => data.category === _id)
      if (category) {
        return category.modules.reduce((acc, module) => {
          return [...acc, ...module.units.filter(unit => unit.assessments_completed).map(unit => unit.unit)]
        }, [] as string[])
      }
      return []
    } catch (error) {
      return []
    }
  },
}))
