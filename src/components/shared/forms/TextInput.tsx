export default function TextInput({ label, name, placeholder, required, initialValue }:any) {
  return (
    <div className="relative pb-3">
      <input
        name={name}
        type="text"
        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-zinc-900 bg-white rounded-lg border-1 border-zinc-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
        placeholder={placeholder}
        // initialValue={initialValue}
      />
      <label
        // required={required}
        htmlFor={name}
        className="pointer-events-none absolute text-sm text-zinc-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-zinc-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:bg-gradient-to-b peer-focus:from-zinc-50 peer-focus:to-white start-1">
        {label}
      </label>
    </div>
  )
}
