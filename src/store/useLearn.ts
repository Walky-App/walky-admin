import { create } from 'zustand'

import type { ProgressHTU } from '../interfaces/htu'
import { type IAssessmentResponse } from '../interfaces/unit'

interface State {
  record: ProgressHTU
  setRecord: (data: ProgressHTU) => void
  getUnitsIdCompleted: (_id: string) => string[]
  expireTime: boolean
  setExpireTime: (valid: boolean) => void
  currentUnit: IAssessmentResponse
  setCurrentAssessment: (idModule: string, idUnit: string) => void
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
  currentUnit: {
    percentagea_assessment: 0,
    minimum_score: 0,
    pass_assessment: false,
    correct_questions: 0,
    incorrect_questions: 0,
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
  setCurrentAssessment: (idModule, idUnit) => {
    const { record } = get()
    let unitFound: IAssessmentResponse = {
      percentagea_assessment: 0,
      minimum_score: 0,
      pass_assessment: false,
      correct_questions: 0,
      incorrect_questions: 0,
    }
    record.categories.some(category => {
      return category.modules.some(module => {
        if (module.module === idModule) {
          const unit = module.units.find(unit => unit.unit === idUnit)
          if (unit && unit.unit === idUnit) {
            unitFound = unit.assessment_results_records[unit.assessment_results_records.length - 1]
            return true
          }
        }
        return false
      })
    })
    set({ currentUnit: unitFound })
  },
}))
