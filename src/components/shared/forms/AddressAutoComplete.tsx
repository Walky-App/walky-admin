import { useState } from 'react'

import { AutoComplete } from 'primereact/autocomplete'
import { useDebouncedCallback } from 'use-debounce'

import { type IAddress } from '../../../interfaces/Facility'
import { RequestService } from '../../../services/RequestService'

export interface IAddressAutoComplete {
  zip: string | undefined
  state: string | undefined
  city: string | undefined
  location_pin: number[] | undefined
  address: string | undefined
  country: string | undefined
}

export interface AddressAutoCompleteProps {
  setMoreAddressDetails: (details: IAddressAutoComplete) => void
  currentAddress: string
  onChange?: (value: string) => void
  value?: string
  controlled?: boolean
  className?: string
}

export const AddressAutoComplete = ({
  setMoreAddressDetails,
  currentAddress,
  onChange,
  value,
  controlled,
  className,
}: AddressAutoCompleteProps) => {
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

      const country = response.address_components.find((item: { types: string[] }) =>
        item.types.includes('country'),
      ).long_name

      const location_pin = [response.geometry.location.lat, response.geometry.location.lng]

      return setMoreAddressDetails({ zip, state, city, location_pin, address, country })
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

  if (controlled && onChange) {
    return (
      <AutoComplete
        name="address"
        placeholder={currentAddress}
        value={value}
        suggestions={filteredAddresses}
        completeMethod={searchAddress}
        onChange={e => {
          setSelectedAddresses(e.value)
          onChange(e.value)
        }}
        onSelect={e => handleGetAddressDetails(e.value, predictions)}
        forceSelection
        inputStyle={{ width: '100%' }}
        className={className}
      />
    )
  }

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
