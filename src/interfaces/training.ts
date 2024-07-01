interface IAssessmentResultRecord {
  percentagea_assessment: number
  minimum_score: number
  pass_assessment: boolean
  correct_questions: number
  incorrect_questions: number
  _id: string
}

interface IUnit {
  unit: {
    _id: string
    is_disabled: boolean
    title: string
    time: number
    assessments: string
    createdAt: string
    updatedAt: string
    type: string
    order: number
    url_caption: string
  }
  assessments_completed: boolean
  assessment_results_records: IAssessmentResultRecord[]
  _id: string
}

interface IModule {
  module: {
    _id: string
    category: string
    is_disabled: boolean
    level: string
    title: string
    total_time: number
    state_tags: string[]
    image: string
    createdAt: string
    updatedAt: string
  }
  is_completed: boolean
  units: IUnit[]
  _id: string
}

interface ICategory {
  category: {
    modules_number: number
    _id: string
    is_disabled: boolean
    title: string
    state_tags: string[]
    image: string
    createdAt: string
    updatedAt: string
  }
  is_completed: boolean
  url_certificate: string
  modules: IModule[]
  _id: string
}

export interface ITrainingData {
  _id: string
  user: string
  categories: ICategory[]
  createdAt: string
  updatedAt: string
}
