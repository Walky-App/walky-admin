import { useState } from 'react'
import type { ChangeEvent } from 'react'

import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { InputTextarea } from 'primereact/inputtextarea'
import { Rating } from 'primereact/rating'
import type { RatingChangeEvent } from 'primereact/rating'

import { useAuth } from '../../../contexts/AuthContext'
import { requestService } from '../../../services/requestServiceNew'
import { useUtils } from '../../../store/useUtils'

const employee_role = process.env.REACT_APP_EMPLOYEE_ROLE as string

interface Feedback {
  comment: string
  rating?: number
  job_id?: string | undefined
  user_id?: string
  performance?: number
  colaboration?: number
  communication?: number
  punctuality?: number
  knowledge_skills?: number
}

interface FeedbackProps {
  isOpen: boolean
  objectId: string
  hidden: (value: boolean) => void
  job_id?: string
}

export const Feedback = ({ isOpen = false, hidden, objectId, job_id }: FeedbackProps) => {
  const { user } = useAuth()
  const { showToast } = useUtils()

  const submitFeedback = async (feedback: Feedback) => {
    const objectFeedback = job_id ? { ...feedback, job_id } : feedback
    const response = await requestService({ path: 'feedback', method: 'POST', body: JSON.stringify(objectFeedback) })

    if (!response.ok) {
      showToast({ severity: 'error', summary: 'Error', detail: 'Error submitting feedback' })
      hidden(false)
      return
    }
    showToast({ severity: 'success', summary: 'Success', detail: 'Feedback submitted' })
    hidden(false)
  }

  return (
    <Dialog header="Feedback" visible={isOpen} style={{ width: '50vw' }} modal={true} onHide={() => hidden(false)}>
      {user?.role !== employee_role ? (
        <FeedbackEmployee submitFeedback={submitFeedback} userId={objectId} />
      ) : (
        <FeedbackFacility submitFeedback={submitFeedback} jobId={objectId} />
      )}
    </Dialog>
  )
}

interface FeedbackFacilityProps {
  submitFeedback: (feedback: Feedback) => void
  jobId: string | undefined
}

const FeedbackFacility = ({ submitFeedback, jobId }: FeedbackFacilityProps) => {
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState<string>('')

  const handlerSetFeedback = () => {
    const feedback: Feedback = {
      rating,
      comment,
      job_id: jobId,
    }
    submitFeedback(feedback)
  }

  return (
    <div className="mt-3 flex flex-1 flex-col gap-3">
      <div className="flex flex-col gap-2">
        <span className="text-lg">Please rate your experencie working at this facility</span>
        <Rating
          value={rating}
          cancel={false}
          onChange={(e: RatingChangeEvent) => setRating(e.value as number)}
          stars={5}
        />
      </div>
      <InputTextarea
        rows={5}
        cols={30}
        placeholder="Your feedback"
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
      />
      <div className="mt-3 flex justify-end">
        <Button type="button" onClick={handlerSetFeedback} disabled={rating === 0 || comment === ''}>
          submit
        </Button>
      </div>
    </div>
  )
}

interface FeedbackEmployeeProps {
  submitFeedback: (feedback: Feedback) => void
  userId: string | undefined
}

const FeedbackEmployee = ({ submitFeedback, userId }: FeedbackEmployeeProps) => {
  const [comment, setComment] = useState<string>('')
  const [performance, setPerformance] = useState<number>(0)
  const [colaboration, setColaboration] = useState<number>(0)
  const [communication, setCommunication] = useState<number>(0)
  const [punctuality, setPunctuality] = useState<number>(0)
  const [knowledge_skills, setKnowledgeSkills] = useState<number>(0)

  const handlerSetFeedback = () => {
    const feedback: Feedback = {
      comment,
      user_id: userId,
      colaboration,
      knowledge_skills,
      performance,
      punctuality,
      communication,
    }

    submitFeedback(feedback)
  }

  return (
    <div className="mt-3 flex flex-1 flex-col gap-3 ">
      <div className="flex flex-col justify-center">
        <div className="flex flex-col items-center justify-start gap-2 md:flex-row">
          <span className="text-lg">Performance</span>
          <Rating
            value={performance}
            cancel={false}
            onChange={(e: RatingChangeEvent) => setPerformance(e.value as number)}
            stars={5}
          />
        </div>
        <div className="flex flex-col items-center justify-start gap-2 md:flex-row">
          <span className="text-lg">Punctuality</span>
          <Rating
            value={punctuality}
            cancel={false}
            onChange={(e: RatingChangeEvent) => setPunctuality(e.value as number)}
            stars={5}
          />
        </div>
        <div className="flex flex-col items-center justify-start gap-2 md:flex-row">
          <span className="text-lg">Colaboration</span>
          <Rating
            value={colaboration}
            cancel={false}
            onChange={(e: RatingChangeEvent) => setColaboration(e.value as number)}
            stars={5}
          />
        </div>
        <div className="flex flex-col items-center justify-start gap-2 md:flex-row">
          <span className="text-lg">Communication</span>
          <Rating
            value={communication}
            cancel={false}
            onChange={(e: RatingChangeEvent) => setCommunication(e.value as number)}
            stars={5}
          />
        </div>
        <div className="flex flex-col items-center justify-start gap-2 md:flex-row">
          <span className="text-lg">Knowledge & Skills</span>
          <Rating
            value={knowledge_skills}
            cancel={false}
            onChange={(e: RatingChangeEvent) => setKnowledgeSkills(e.value as number)}
            stars={5}
          />
        </div>
      </div>
      <InputTextarea
        rows={5}
        cols={30}
        placeholder="Your feedback"
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
      />
      <div className="mt-3 flex justify-end">
        <Button
          type="button"
          onClick={handlerSetFeedback}
          disabled={
            comment === '' ||
            performance === 0 ||
            punctuality === 0 ||
            colaboration === 0 ||
            communication === 0 ||
            knowledge_skills === 0
          }>
          submit
        </Button>
      </div>
    </div>
  )
}
