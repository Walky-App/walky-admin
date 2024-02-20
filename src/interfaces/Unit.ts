import { Documents } from "./Global"

export interface Section {
    _id: string
    title: string
    body: string
  }
  
  export interface Assessment {
    _id: string
    time: number
    min_score: number
    question?: [
      {
        _id: string
        header: string
        options: string[]
        answers: string[]
      },
    ]
  }
  
  export interface Unit extends Documents {
    sections: Section[]
    title: string
    is_disabled: boolean
    time: number
    assessments: Assessment[]
  }