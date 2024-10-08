import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

import { IProduct } from '../../../interfaces/Product'
import { RequestService } from '../../../services/RequestService'
import { EditForm } from './components/EditForm'

const product = {
  breadcrumbs: [{ id: 1, name: 'Products', href: '/admin/products' }],
}


export default function ProductDetail() {
  const [incomingProduct, setIncomingProduct] = useState<IProduct | undefined>()

  const params = useParams()
  const location = useLocation()

  console.log(location.pathname)

  useEffect(() => {
    const fetchProduct = async () => {
      const productReceived = await RequestService('products/' + params.id)
      if (productReceived) {
        setIncomingProduct(productReceived)
      }
    }

    fetchProduct()
  }, [])

  console.log(incomingProduct)

  return (
    <div className="bg-white">
      <div className="pb-16 pt-6 sm:pb-24">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ol role="list" className="flex items-center space-x-4">
            {product.breadcrumbs.map(breadcrumb => (
              <li key={breadcrumb.id}>
                <div className="flex items-center">
                  <a href={breadcrumb.href} className="mr-4 text-sm font-medium text-gray-900">
                    {breadcrumb.name}
                  </a>
                  <svg viewBox="0 0 6 20" aria-hidden="true" className="h-5 w-auto text-gray-300">
                    <path d="M4.878 4.34H3.551L.27 16.532h1.327l3.281-12.19z" fill="currentColor" />
                  </svg>
                </div>
              </li>
            ))}
            <li className="text-sm">
              <a href={'#'} aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">
                {incomingProduct?.name}
              </a>
            </li>
          </ol>
        </nav>
        <div className="mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-5 lg:col-start-8">
              <div className="flex justify-between">
                <h1 className="text-xl font-medium text-gray-900">{incomingProduct?.name}</h1>
                <p className="text-xl font-medium text-gray-900">{incomingProduct?.each_price}</p>
              </div>
            </div>

            {/* Image gallery */}
            <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
              <h2 className="sr-only">Images</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-3 lg:gap-8">
                <img
                  src={incomingProduct?.image_medium}
                  alt={incomingProduct?.name}
                  className='rounded-lg lg:col-span-2 lg:row-span-2'
                />
              </div>
            </div>

            <div className="mt-8 lg:col-span-5">
              {/* Product details */}
              <div className="mt-10">
                <h2 className="text-sm font-medium text-gray-900">Description</h2>

                <div className="prose prose-sm mt-4 text-gray-500" />
                {incomingProduct?.description}
              </div>
            </div>
          </div>
          <EditForm product={incomingProduct} />
        </div>
      </div>
    </div>
  )
}
