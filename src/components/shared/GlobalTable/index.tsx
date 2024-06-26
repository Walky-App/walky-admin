/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTable, useGlobalFilter, useSortBy, usePagination } from 'react-table'

import GlobalSearchFilter from './GlobalSearchFilter'
import { PaginationNav } from './PaginationNav'
import SelectMenu from './SelectMenu'
import { TableComponent } from './TableComponent'

interface ITableProps {
  data: any
  columns: any
  allowClick?: boolean
}

export const GlobalTable = ({ data, columns, allowClick }: ITableProps) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state,
    setGlobalFilter,
    page: rows,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  }: any = useTable(
    {
      columns,
      data,
      // @ts-ignore
      initialState: { pageSize: 20 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  )

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full flex-col justify-between gap-2 sm:flex-row">
        <GlobalSearchFilter
          className="w-full sm:w-64"
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <SelectMenu
          className="sm:w-44"
          value={pageSize}
          setValue={setPageSize}
          options={[
            { id: 10, caption: '10 items per page' },
            { id: 20, caption: '20 items per page' },
            { id: 40, caption: '40 items per page' },
          ]}
        />
      </div>
      <div className="w-full">
        <TableComponent
          getTableProps={getTableProps}
          headerGroups={headerGroups}
          getTableBodyProps={getTableBodyProps}
          rows={rows}
          prepareRow={prepareRow}
          allowClick={allowClick}
        />
      </div>
      <PaginationNav
        gotoPage={gotoPage}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        pageCount={pageCount}
        pageIndex={pageIndex}
      />
    </div>
  )
}
