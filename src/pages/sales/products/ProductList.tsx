import React from 'react'

import { useNavigate } from 'react-router-dom'

import { GlobalTable } from '../../../components/shared/GlobalTable'
import { HTLoadingLogo } from '../../../components/shared/HTLoadingLogo'
import { HeadingComponent } from '../../../components/shared/general/HeadingComponent'
import { type IProduct } from '../../../interfaces/Product'
import { RequestService } from '../../../services/RequestService'
import { ImportUpdateModal } from './components/ImportUpdateModal'

interface IRow {
  row: { original: IProduct }
  value: string
}

const Avatar = ({ src, alt = 'avatar' }: { src: string; alt?: string }) => (
  <img alt={alt} className="h-32 w-32  object-cover" src={src} />
)

export const ProductList = () => {
  const [productsData, setProductsData] = React.useState<IProduct[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [visible, setVisible] = React.useState<boolean>(false)

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

  const memoProductsColumns = React.useMemo(
    () => [
      {
        Header: 'Image',

        width: '200px',
        Cell: ({ row, value }: IRow) => {
          return (
            <div className="flex items-center gap-2">
              <Avatar alt={`${value}'s Avatar`} src={row.original.image_thumb} />
              <div>{value}</div>
            </div>
          )
        },
      },
      { Header: 'Name', accessor: 'name', width: '400px' },
      { Header: 'Sku', accessor: 'sku' },
      { Header: 'Stock', accessor: 'stock', width: '30px' },
      {
        Header: 'Status',
        accessor: (d: IProduct) => (d.is_active ? 'Active' : 'Disabled'),
        sortType: (a: IProduct, b: IProduct) => {
          if (a.is_active === b.is_active) return 0
          return a.is_active ? -1 : 1
        },
      },
      { Header: 'Price', accessor: 'each_price' },
      { Header: 'MSRP', accessor: 'msrp', width: '30px' },
      { Header: 'On Sale', width: '120px', accessor: (item: IProduct) => (item.on_sale ? 'Yes' : 'No') },
    ],
    [],
  )

  return (
    <div className="">
      <ImportUpdateModal setVisible={setVisible} visible={visible} />
      <HeadingComponent title={`${productsData.length} Products `} />

      {isLoading ? (
        <HTLoadingLogo />
      ) : (
        <>
          <button
            className="mb-4 rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            disabled
            onClick={() => {
              // navigate('/admin/facilities/new')
            }}
            type="button">
            New Product
          </button>
          <button
            className="mb-4 ml-2 rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            onClick={() => {
              setVisible(true)
            }}
            type="button">
            Import / Update
          </button>
          <button
            className="mb-4 ml-2 rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            onClick={() => navigate('/admin/products/categories')}
            type="button">
            Categories
          </button>
          <GlobalTable allowClick columns={memoProductsColumns} data={memoProductsData} />
        </>
      )}
    </div>
  )
}
