import type { IUser } from './User'
import type { Category } from './category'
import type { Documents } from './global'
import type { Module } from './module'
import type { Unit } from './unit'

export interface ProgressHTU extends Documents {
  user: IUser['_id']
  categories: [
    {
      category: Category['_id']
      is_completed: boolean
      url_certificate: string
      modules: [
        {
          module: Module['_id']
          is_completed: boolean
          units: [
            {
              unit: Unit['_id']
              assessments_completed: boolean
              assessment_results_records: IAssessmentResponse[]
            },
          ]
        },
      ]
    },
  ]
}

export interface IAssessmentResponse {
  percentagea_assessment: number
  minimum_score: number
  pass_assessment: boolean
  correct_questions: number
  incorrect_questions: number
}
