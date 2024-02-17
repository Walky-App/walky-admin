import { FaSearch } from 'react-icons/fa'

function InputGroup7({
  label,
  name,
  value,
  onChange,
  type = 'text',
  decoration,
  className = '',
  inputClassName = '',
  decorationClassName = '',
  disabled,
}: {
  label: any
  name: any
  value: any
  onChange: any
  type?: any
  decoration?: any
  className?: any
  inputClassName?: any
  decorationClassName?: any
  disabled?: any
}) {
  return (
    <div
      className={`flex flex-row-reverse items-stretch w-full rounded-xl overflow-hidden bg-white shadow-[0_4px_10px_rgba(0,0,0,0.03)] ${className}`}>
      <input
        id={name}
        name={name}
        value={value}
        type={type}
        placeholder={label}
        aria-label={label}
        onChange={onChange}
        className={`peer block w-full p-3 text-gray-600 focus:outline-none focus:border-transparent border-transparent focus:ring-0 appearance-none ${disabled ? 'bg-gray-200' : ''
          } ${inputClassName}`}
        disabled={disabled}
      />
      <div
        className={`flex items-center pl-3 py-3 text-gray-600 ${disabled ? 'bg-gray-200' : ''} ${decorationClassName}`}>
        {decoration}
      </div>
    </div>
  )
}

export default function GlobalSearchFilter({
  globalFilter,
  setGlobalFilter,
  className = '',
}: {
  globalFilter: any
  setGlobalFilter: any
  className?: any
}) {
  return (
    <InputGroup7
      name="search"
      value={globalFilter || ''}
      onChange={(e: any) => setGlobalFilter(e.target.value)}
      label="Search"
      decoration={<FaSearch size="1rem" className="text-gray-400" />}
      className={className}
    />
  )
}