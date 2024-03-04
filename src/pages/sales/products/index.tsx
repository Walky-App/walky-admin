import React from 'react'
import { useNavigate } from 'react-router-dom'

import { RequestService } from '../../../services/RequestService'
import { HeaderComponent } from '../../../components/shared/general/HeaderComponent'
import GlobalTable from '../../../components/shared/GlobalTable'
import { Product } from '../../../interfaces/Product'

export default function Products() {
  const [productsData, setProductsData] = React.useState<any>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const navigate = useNavigate()

  React.useMemo(() => {
    const getProducts = async () => {
      try {
        const allProducts = await RequestService('products')
        setProductsData(allProducts)
      } catch (error) {
        console.error('Error fetching facility data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getProducts()
  }, [])

  const memoProductsData = React.useMemo(() => productsData, [productsData])

  function Avatar({ src, alt = 'avatar' }: { src: any; alt?: any }) {
    return <img src={src} alt={alt} className="h-32 w-32  object-cover" />
  }

  const memoProductsColumns = React.useMemo(
    () => [
      {
        Header: 'Image',

        width: '200px',
        Cell: ({ row, value }: any) => {
          return (
            <div className="flex items-center gap-2">
              <Avatar src={row.original.ImageThumb} alt={`${value}'s Avatar`} />
              <div>{value}</div>
            </div>
          )
        },
      },
      { Header: 'Name', accessor: 'Name', width: '400px' },
      { Header: 'Sku', accessor: 'sku' },
      { Header: 'Stock', accessor: 'StockTotal', width: '30px' },
      {
        Header: 'Status',
        accessor: (d: any) => (d.isActive ? 'Active' : 'Disabled'),
        sortType: (a: any, b: any) => {
          if (a.original.isActive === b.original.isActive) return 0
          return a.original.isActive ? -1 : 1
        },
      },
      { Header: 'Price', accessor: 'EachPrice' },
      { Header: 'MSRP', accessor: 'EachMsrp', width: '30px' },
      { Header: 'On Sale', width: '120px', accessor: (item: Product) => (item.IsSale ? 'Yes' : 'No') },
    ],
    [],
  )

  return (
    <div className="">
      <HeaderComponent title={`${productsData.length} Products `} />
      <button
        type="button"
        disabled
        onClick={() => {
          // navigate('/admin/facilities/new')
        }}
        className="mb-4 rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
        New Product
      </button>

      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-green-600"></div>
        </div>
      ) : (
        <GlobalTable data={memoProductsData} columns={memoProductsColumns} allowClick />
      )}
    </div>
  )
}
