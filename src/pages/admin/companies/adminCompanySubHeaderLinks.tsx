import { HomeIcon, CurrencyDollarIcon } from '@heroicons/react/20/solid'

import { type SubHeaderLink } from '../../../components/shared/SubHeader'

export const adminCompanyLinks: SubHeaderLink[] = [
  { id: 0, name: 'Details', href: '', icon: <HomeIcon /> },
  { id: 1, name: 'Payment Info', href: '/payment', icon: <CurrencyDollarIcon /> },
]
