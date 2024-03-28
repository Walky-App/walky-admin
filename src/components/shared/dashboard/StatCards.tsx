import React from 'react'

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
    <>
      {cards.map(card => (
        <Card key={card.name} name={card.name} amount={card.amount} href={card.href} icon={card.icon} />
      ))}
    </>
  )
}

type CardProps = IStatCard

const Card: React.FC<CardProps> = ({ name, amount, href, icon: Icon }) => {
  const navigate = useNavigate()

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="truncate text-sm font-medium text-gray-500">{name}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{amount}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <Button label="View All" link size="small" onClick={() => navigate(href)} className="p-0" />
      </div>
    </div>
  )
}
