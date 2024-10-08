/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaSortUp, FaSortDown } from 'react-icons/fa'
import { useLocation, useNavigate } from 'react-router-dom'

import { useAdmin } from '../../../contexts/AdminContext'

interface ITableProps {
  getTableProps: any
  headerGroups: any
  getTableBodyProps: any
  rows: any
  prepareRow: any
  allowClick?: boolean
}

export const TableComponent = ({
  getTableProps,
  headerGroups,
  getTableBodyProps,
  rows,
  prepareRow,
  allowClick,
}: ITableProps) => {
  const { setModule } = useAdmin()
  const navigate = useNavigate()
  const location = useLocation()

  const handlerClick = (row: any) => {
    if (location.pathname === '/admin/learn/modules') {
      setModule(row.original)
    }
    navigate(`${location.pathname}${location.pathname.endsWith('/') ? '' : '/'}${row.original._id}`)
  }

  return (
    <div>
      <table {...getTableProps()} className="w-full">
        <thead>
          {headerGroups.map((headerGroup: any) => (
            <tr key={headerGroup.headers} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                <th
                  key={column.Header}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="cursor-pointe text-start uppercase"
                  style={{ width: column.width }}>
                  <div className="flex items-center gap-1">
                    <div>{column.render('Header')}</div>
                    <div className="flex flex-col">
                      <FaSortUp
                        className={`translate-y-1/2 ${
                          (column.isSorted as boolean) && !(column.isSortedDesc as boolean)
                            ? 'text-green-500'
                            : 'text-gray-300'
                        }`}
                      />
                      <FaSortDown
                        className={`-translate-y-1/2 ${(column.isSortedDesc as boolean) ? 'text-green-500' : 'text-gray-300'}`}
                      />
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row: any) => {
            prepareRow(row)
            if (allowClick) {
              return (
                <tr key={row.id} className="cursor-pointer hover:bg-gray-100" onClick={() => handlerClick(row)}>
                  {row.cells.map((cell: any) => {
                    return (
                      <td key={cell.column.id} {...cell.getCellProps()} className="border-b-2 py-3">
                        {cell.render('Cell')}
                      </td>
                    )
                  })}
                </tr>
              )
            } else {
              return (
                <tr key={row._id}>
                  {row.cells.map((cell: any) => {
                    return (
                      <td key={cell.column.id} className="p-3">
                        {cell.render('Cell')}
                      </td>
                    )
                  })}
                </tr>
              )
            }
          })}
        </tbody>
      </table>
    </div>
  )
}
