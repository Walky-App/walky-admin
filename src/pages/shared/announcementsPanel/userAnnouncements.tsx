import React, { useEffect, useState } from 'react'

import { type IAnnouncement } from '../../../interfaces/announcement'
import { requestService } from '../../../services/requestServiceNew'
import { AnnouncementsPanel } from './announcementsPanel'

const UserAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await requestService({ path: 'announcements', method: 'GET' })
        if (response.ok) {
          const data = await response.json()
          setAnnouncements(data)
        } else {
          console.error('Failed to fetch announcements')
        }
      } catch (error) {
        console.error('Error fetching announcements', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnnouncements()
  }, [])

  return isLoading ? <div>Loading...</div> : <AnnouncementsPanel announcements={announcements} />
}

export default UserAnnouncements
