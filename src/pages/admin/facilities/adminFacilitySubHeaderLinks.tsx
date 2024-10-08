import {
  UserCircleIcon,
  PhotoIcon,
  BriefcaseIcon,
  PaperClipIcon,
  IdentificationIcon,
  DocumentPlusIcon,
  HomeIcon,
} from '@heroicons/react/20/solid'

import { type SubHeaderLink } from '../../../components/shared/SubHeader'

export const adminFacilitiesLinks: SubHeaderLink[] = [
  { id: 0, name: 'Details', href: '', icon: <HomeIcon /> },
  { id: 1, name: 'Contacts', href: '/contacts', icon: <UserCircleIcon /> },
  { id: 2, name: 'Images', href: '/images', icon: <PhotoIcon /> },
  { id: 3, name: 'Jobs', href: '/jobs', icon: <BriefcaseIcon /> },
  { id: 4, name: 'Notes', href: '/internal_notes', icon: <PaperClipIcon /> },
  { id: 5, name: 'Licenses', href: '/licenses', icon: <IdentificationIcon /> },
  { id: 6, name: 'Activity', href: '/activity', icon: <IdentificationIcon /> },
  { id: 7, name: 'Docs', href: '/documents', icon: <DocumentPlusIcon />, disabled: true },
  { id: 8, name: 'DNR', href: '/dnr', icon: <DocumentPlusIcon /> },
]
