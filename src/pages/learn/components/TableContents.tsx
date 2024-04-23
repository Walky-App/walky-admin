import { useEffect, useState } from 'react'

import { useAdmin } from '../../../contexts/AdminContext'
import { type NavigationButtonInterface } from '../../../interfaces/global'
import { type Section } from '../../../interfaces/unit'
import { cn } from '../../../utils/cn'

interface TableContentsProps {
  headerTitle: string
}

export const TableContents = ({ headerTitle }: TableContentsProps) => {
  const [active, setActive] = useState<number | null>(0)
  const [dataContents, setDataContents] = useState<NavigationButtonInterface[]>([])
  const { unit } = useAdmin()

  const handlerMenuNav = (item: NavigationButtonInterface, index: number) => {
    scrollToElement(item.to)
    setActive(index)
  }

  const scrollToElement = (id: string) => {
    const headerHeight = (document.getElementById('header-shell')?.offsetHeight as number) + 325 || 0
    const targetElement = document.getElementById(id)
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - headerHeight,
        behavior: 'smooth',
      })
    }
  }

  useEffect(() => {
    if (unit) {
      const data: NavigationButtonInterface[] = unit.sections.map((item: Section) => {
        return {
          to: `${item.title.replace(' ', '-')}`,
          text: item.title,
        }
      })
      setDataContents(data)
    }
  }, [unit])

  return (
    <div className="max-h-[500px] overflow-auto">
      <div className="py-2 pl-5 text-lg font-medium">{headerTitle}</div>
      <nav>
        <ul className="last:mb-2">
          {dataContents.map((item, index) => (
            <li key={`content-item-${index}`}>
              <button
                className={cn(`cursor-pointer py-2 pl-5 text-start text-lg hover:border-l-2 hover:border-gray-600`, {
                  'border-l-2 border-green-500 text-green-500 hover:border-green-500': index === active,
                })}
                onClick={() => handlerMenuNav(item, index)}
                type="button">
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
