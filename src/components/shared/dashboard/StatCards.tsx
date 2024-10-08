import { useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'

export interface IStatCard {
  name: string
  href: string
  icon: React.ElementType
  amount?: string
}

interface StatCardsProps {
  cards: IStatCard[]
}

export const StatCards: React.FC<StatCardsProps> = ({ cards }) => {
  return (
    <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map(card => (
        <Card key={card.name} name={card.name} amount={card.amount} href={card.href} icon={card.icon} />
      ))}
    </div>
  )
}

type CardProps = IStatCard

const Card = ({ name, amount, href, icon: Icon }: CardProps) => {
  const navigate = useNavigate()

  return (
    <div className="overflow-hidden rounded-lg shadow">
      <div className="">
        <div className="flex items-center">
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="mb-3 truncate text-sm font-medium text-gray-500">{name}</dt>
              <dd className="flex">
                <div className="mr-3 flex-shrink-0">
                  <Icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="text-lg font-medium">{amount}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="px-5 py-3">
        <Button label="View All" link size="small" onClick={() => navigate(href)} className="p-0" />
      </div>
    </div>
  )
}
