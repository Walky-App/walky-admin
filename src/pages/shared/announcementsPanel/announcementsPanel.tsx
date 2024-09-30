/* eslint-disable react/no-danger */
import React from 'react'

import { Card } from 'primereact/card'
import { Carousel } from 'primereact/carousel'

import { type IAnnouncement } from '../../../interfaces/announcement'

interface AnnouncementsPanelProps {
  announcements: IAnnouncement[]
}

export const AnnouncementsPanel: React.FC<AnnouncementsPanelProps> = ({ announcements }) => {
  const announcementTemplate = (announcement: IAnnouncement) => {
    return (
      <Card
        className="mx-1 my-4"
        title={announcement.title}
        subTitle={`Posted on ${new Date(announcement.created_at).toLocaleDateString()}`}>
        <div dangerouslySetInnerHTML={{ __html: announcement.message }} />
      </Card>
    )
  }

  return (
    <div className="announcements-panel">
      <Carousel value={announcements} itemTemplate={announcementTemplate} numVisible={3} numScroll={1} />
    </div>
  )
}
