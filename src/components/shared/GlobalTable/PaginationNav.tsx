/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react'

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const Button2 = ({ content, onClick, active, disabled }: any) => {
  return (
    <button
      type="button"
      className={`flex h-9 w-9 cursor-pointer flex-col items-center justify-center rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.03)] transition-colors
      ${active ? 'bg-green-500 text-green-500' : 'text-green-500'}
      ${!disabled ? 'bg-white hover:bg-green-500 hover:text-white' : 'cursor-not-allowed bg-white text-green-300'}
      `}
      onClick={onClick}
      disabled={disabled}>
      {content}
    </button>
  )
}

export const PaginationNav = ({
  gotoPage,
  canPreviousPage,
  canNextPage,
  pageCount,
  pageIndex,
}: {
  gotoPage: any
  canPreviousPage: any
  canNextPage: any
  pageCount: any
  pageIndex: any
}) => {
  const renderPageLinks = useCallback(() => {
    if (pageCount === 0) return null
    const visiblePageButtonCount = 3
    let numberOfButtons = pageCount < visiblePageButtonCount ? pageCount : visiblePageButtonCount
    const pageIndices = [pageIndex]
    numberOfButtons--
    ;[...Array(numberOfButtons)].forEach((_item, itemIndex) => {
      const pageNumberBefore = pageIndices[0] - 1
      const pageNumberAfter = pageIndices[pageIndices.length - 1] + 1
      if (pageNumberBefore >= 0 && (itemIndex < numberOfButtons / 2 || pageNumberAfter > pageCount - 1)) {
        pageIndices.unshift(pageNumberBefore)
      } else {
        pageIndices.push(pageNumberAfter)
      }
    })
    return pageIndices.map(pageIndexToMap => (
      <li key={pageIndexToMap}>
        <Button2
          content={pageIndexToMap + 1}
          onClick={() => gotoPage(pageIndexToMap)}
          active={pageIndex === pageIndexToMap}
        />
      </li>
    ))
  }, [pageCount, pageIndex, gotoPage])
  return (
    <ul className="flex gap-2">
      <li>
        <Button2
          content={
            <div className="ml-1 flex">
              <FaChevronLeft size="0.6rem" />
              <FaChevronLeft size="0.6rem" className="-translate-x-1/2" />
            </div>
          }
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        />
      </li>
      {renderPageLinks()}
      <li>
        <Button2
          content={
            <div className="ml-1 flex">
              <FaChevronRight size="0.6rem" />
              <FaChevronRight size="0.6rem" className="-translate-x-1/2" />
            </div>
          }
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        />
      </li>
    </ul>
  )
}
