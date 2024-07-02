import { HomeIcon, ClockIcon } from '@heroicons/react/20/solid'

import { type SubHeaderLink } from '../../../components/shared/SubHeader'

export const adminUserLinks: SubHeaderLink[] = [
  { id: 0, name: 'Details', href: '', icon: <HomeIcon /> },
  { id: 1, name: 'Timesheets', href: '/timesheets', icon: <ClockIcon /> },
  // { id: 2, name: 'Images', href: '/images', icon: <PhotoIcon /> },
  // { id: 3, name: 'Jobs', href: '/jobs', icon: <BriefcaseIcon /> },
  // { id: 4, name: 'Notes', href: '/internal_notes', icon: <PaperClipIcon /> },
  // { id: 5, name: 'Licenses', href: '/licenses', icon: <IdentificationIcon /> },
  // { id: 5, name: 'Activity', href: '/activity', icon: <IdentificationIcon /> },
  // { id: 6, name: 'Docs', href: '/documents', icon: <DocumentPlusIcon />, disabled: true },
]
