import {
  type DisableButtonInterface,
  type NavigationButtonInterface,
  type SelectedOptionInterface,
} from '../../../interfaces/global'
import { DisableButton } from './DisableButton'
import { NavigationButton } from './NavigationButton'
import { Search } from './Search'
import { SelectedOptionWithFilter } from './SelectedOptionWithFilter'

interface Props {
  title: string
  search?: boolean
  selectedOptions?: SelectedOptionInterface[]
  actionButton?: NavigationButtonInterface
  disableButton?: DisableButtonInterface
}

export const HeadingComponent = ({ title, selectedOptions, search = false, actionButton, disableButton }: Props) => {
  return (
    <div className="mb-4 border-b border-gray-200 pb-5 sm:mb-10 sm:flex sm:items-center sm:justify-between">
      <h3 className="text-base font-semibold leading-6">{title}</h3>
      <div className="mt-3 sm:ml-4 sm:mt-0">
        <label className="sr-only" htmlFor="search-header">
          Search
        </label>
        <div className="flex rounded-md">
          {selectedOptions ? (
            actionButton ? (
              <>
                <div className="mx-3">
                  <Search searchQuery="search" />
                </div>
                <div className="mx-3 w-32">
                  <SelectedOptionWithFilter selectedOptions={selectedOptions} />
                </div>
                <div className="mx-3">
                  <NavigationButton text={actionButton.text} to={actionButton.to} />
                </div>
              </>
            ) : (
              <>
                <Search roundedOrientation="rounded-l-md" searchQuery="search" />
                <SelectedOptionWithFilter roundedOrientation="rounded-r-md" selectedOptions={selectedOptions} />
              </>
            )
          ) : (
            search && <Search searchQuery="search" />
          )}
          {actionButton && !search && !selectedOptions ? (
            <NavigationButton
              disbalePlusIcon={actionButton.disbalePlusIcon}
              text={actionButton.text}
              to={actionButton.to}
            />
          ) : null}
          {disableButton && !search && !selectedOptions ? (
            <DisableButton path={disableButton.path} redirect={disableButton.redirect} status={disableButton.status} />
          ) : null}
        </div>
      </div>
    </div>
  )
}
