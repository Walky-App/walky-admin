import { useState } from 'react'

import { AutoComplete } from 'primereact/autocomplete'
import { useDebouncedCallback } from 'use-debounce'

import { type IAddress } from '../../../interfaces/Facility'
import { RequestService } from '../../../services/RequestService'

export interface IAddressAutoComplete {
  zip: string | undefined
  state: string | undefined
  city: string | undefined
  location_pin: number[]
  address: string | undefined
}

export const AddressAutoComplete = ({
  setMoreAddressDetails,
  currentAddress,
}: {
  setMoreAddressDetails: (details: IAddressAutoComplete) => void
  currentAddress: string
}) => {
  const [predictions, setPredictions] = useState<IAddress[]>([])
  const [selectedAddresses, setSelectedAddresses] = useState(null)
  const [filteredAddresses, setFilteredAddresses] = useState<IAddress[]>([])

  const handleGetAddressDetails = async (address: string, predictions: IAddress[]) => {
    try {
      const addressId = predictions.find((item: IAddress) => item.description === address)?.place_id

      const response = await RequestService(`geo/addressdetails?id=${addressId}`)

      const zip = response.address_components.find((item: { types: string[] }) =>
        item.types.includes('postal_code'),
      ).long_name
      const state = response.address_components.find((item: { types: string[] }) =>
        item.types.includes('administrative_area_level_1'),
      ).short_name
      const city = response.address_components.find((item: { types: string[] }) =>
        item.types.includes('locality'),
      ).long_name
      const location_pin = [response.geometry.location.lat, response.geometry.location.lng]

      return setMoreAddressDetails({ zip, state, city, location_pin, address })
    } catch (error) {
      console.error('Error fetching address details:', error)
    }
  }

  const searchAddress = useDebouncedCallback(async (event: { query: string }) => {
    try {
      const response = await RequestService(`geo/autosuggest?input=${event.query}`)
      setPredictions(response)
      setFilteredAddresses(response.map((item: IAddress) => item.description))
    } catch (error) {
      console.error('Error fetching address predictions:', error)
    }
  }, 500)

  return (
    <AutoComplete
      name="address"
      placeholder={currentAddress}
      value={selectedAddresses}
      suggestions={filteredAddresses}
      completeMethod={searchAddress}
      onChange={e => setSelectedAddresses(e.value)}
      onSelect={e => handleGetAddressDetails(e.value, predictions)}
      forceSelection
    />
  )
}
