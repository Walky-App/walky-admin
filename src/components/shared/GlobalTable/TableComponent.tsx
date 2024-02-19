import { useLocation, useNavigate } from 'react-router-dom'
import { useAdmin } from '../../../contexts/AdminContext'
import { FaSortUp, FaSortDown } from 'react-icons/fa'

interface ITableProps {
  getTableProps: any
  headerGroups: any
  getTableBodyProps: any
  rows: any
  prepareRow: any
  showAvatar?: boolean
  allowClick?: boolean
}

export default function TableComponent({
  getTableProps,
  headerGroups,
  getTableBodyProps,
  rows,
  prepareRow,
  showAvatar,
  allowClick,
}: ITableProps) {
  const { setModule } = useAdmin()
  const navigate = useNavigate()
  const location = useLocation()

  const handlerClick = (row: any) => {
    if (location.pathname === '/admin/learn/modules') {
      row.original.category = row.original.category._id
      setModule(row.original)
    }
    navigate(`${location.pathname}${location.pathname.endsWith('/') ? '' : '/'}${row.original._id}`)
  }

  return (
    <div className="w-full min-w-[30rem] rounded-xl bg-white p-4 shadow-[0_4px_10px_rgba(0,0,0,0.03)]">
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup: any, index: number) => (
            <tr key={index} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                <th
                  key={column.id}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="cursor-pointe px-3 text-start text-xs font-light uppercase"
                  style={{ width: column.width }}>
                  <div className="flex items-center gap-2">
                    <div className="text-gray-600">{column.render('Header')}</div>
                    <div className="flex flex-col">
                      <FaSortUp
                        className={`translate-y-1/2 text-sm ${
                          column.isSorted && !column.isSortedDesc ? 'text-green-500' : 'text-gray-300'
                        }`}
                      />
                      <FaSortDown
                        className={`-translate-y-1/2 text-sm ${column.isSortedDesc ? 'text-green-500' : 'text-gray-300'}`}
                      />
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row: any, index: number) => {
            prepareRow(row)

            if (allowClick) {
              return (
                <tr className="cursor-pointer hover:bg-gray-100" onClick={() => handlerClick(row)}>
                  {row.cells.map((cell: any) => {
                    return (
                      <td
                        key={cell.column.id}
                        {...cell.getCellProps()}
                        className="p-3 text-sm font-normal text-gray-700 first:rounded-l-lg last:rounded-r-lg">
                        {cell.render('Cell')}
                      </td>
                    )
                  })}
                </tr>
              )
            } else {
              return (
                <tr>
                  {row.cells.map((cell: any) => {
                    return (
                      <td
                        key={cell.column.id}
                        className="p-3 text-sm font-normal text-gray-700 first:rounded-l-lg last:rounded-r-lg">
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
