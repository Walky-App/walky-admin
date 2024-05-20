import React from 'react'

import { GlobalTable } from '../../../components/shared/GlobalTable'
import { RequestService } from '../../../services/RequestService'

interface ISubCategory {
  name: string
  sub_inner_categories: string[]
}

interface ICategory {
  cagetory: string
  sub_categories: ISubCategory[]
  image: string
}

interface IRow {
  row: { original: ICategory }
  value: string
}

const Avatar = ({ src, alt = 'avatar' }: { src: string; alt?: string }) => (
  <img alt={alt} className="h-32 w-32  object-cover" src={src} />
)

export const ProductCategories = () => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [categories, setCategories] = React.useState([])

  React.useMemo(() => {
    const getProducts = async () => {
      try {
        const allCategories = await RequestService('products/categories')
        setCategories(allCategories)
      } catch (error) {
        console.error('Error fetching facility data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getProducts()
  }, [])

  const memoProductsColumns = React.useMemo(
    () => [
      {
        Header: 'Image',

        width: '200px',
        Cell: ({ row, value }: IRow) => {
          return (
            <div className="flex items-center gap-2">
              <Avatar alt={`${value}'s Avatar`} src={row.original.image} />
              <div>{value}</div>
            </div>
          )
        },
      },
      { Header: 'Name', accessor: 'name', width: '400px' },
      { Header: 'Sku', accessor: 'sku' },
      { Header: 'Stock', accessor: 'stock', width: '30px' },

      { Header: 'Price', accessor: 'each_price' },
      { Header: 'MSRP', accessor: 'msrp', width: '30px' },
    ],
    [],
  )

  return isLoading ? (
    <div className="flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-green-600" />
    </div>
  ) : (
    <GlobalTable allowClick columns={memoProductsColumns} data={categories} />
  )
}
