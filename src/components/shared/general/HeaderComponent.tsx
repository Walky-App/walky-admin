import Search from './Search'
import { DisableButtonInterface, NavigationButtonInterface, SelectedOptionInterface } from '../../../interfaces/Global'
import NavigationButton from './NavigationButton'
import DisableButton from './DisableButton'
import SelectedOptionWithFilter from './SelectedOptionWithFilter'
import { states } from '../../../utils/VariablesUtils';

interface Props {
  title: string
  search?: boolean
  selectedOptions?: SelectedOptionInterface[]
  actionButton?: NavigationButtonInterface
  disableButton?: DisableButtonInterface
}

export default function HeaderComponent({ title, selectedOptions, search = false, actionButton, disableButton }: Props) {
  return (
    <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between mb-10">
      <h3 className="text-base font-semibold leading-6 text-gray-900">{title}</h3>
      <div className="mt-3 sm:ml-4 sm:mt-0">
        <label htmlFor="search-header" className="sr-only">
          Search
        </label>
        <div className="flex rounded-md ">
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
                  <NavigationButton to={actionButton.to} text={actionButton.text} />
                </div>
              </>
            ) : (
              <>
                <Search searchQuery="search" roundedOrientation="rounded-l-md" />
                <SelectedOptionWithFilter selectedOptions={selectedOptions} roundedOrientation="rounded-r-md" />
              </>
            )
          ) : (
            search && <Search searchQuery="search" />
          )
          }
          {(actionButton && !search && !selectedOptions) && <NavigationButton to={actionButton.to} text={actionButton.text} />}
          {(disableButton && !search && !selectedOptions) && <DisableButton path={disableButton.path} status={disableButton.status} redirect={disableButton.redirect} />}
        </div>
      </div>
    </div>
  )
}
