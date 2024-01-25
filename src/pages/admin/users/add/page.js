'use client'
import { useState, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/context/AuthContext'
import { API_URL } from '@/variables'
import Link from 'next/link'



export default function AddEmployee() {
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const { setUser } = useContext(AuthContext)

  const router = useRouter()
  const handleAddEmployee = async e => {
    e.preventDefault()
    await setLoading(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: e.target.email.value,
        phone: e.target.phone.value,
        password: e.target.password.value,
        password_confirmed: e.target.password_confirmed.value,
        first_name: e.target.firstName.value,
        last_name: e.target.lastName.value,
        role: e.target.role.value,
      }),
    })
    const result = await res.json()
    if (result.status === 'success') {
      setError(null)
      setLoading(false)
      setUser(result.user)
      router.push('/admin/employees')
    }

    if (result.message) {
      setError(result.message)
      setLoading(false)
    }
  }

  const navigateToAdminEmployees = () => {
    router.push('/admin/employees');
}

  return (
    <section className="flex justify-center md:mt-20 md:pb-20 h-screen lg:items-center bg-zinc-50">
      <div className="w-full px-4 py-12 sm:px-6 sm:py-0 lg:w-1/2 lg:px-8 lg:py-16 border-zinc-950 bg-zinc-50">
        <div className="flex justify-center">
        </div>
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">Add Employee</h1>
        </div>

        <form onSubmit={handleAddEmployee} onSubmitCapture={navigateToAdminEmployees} className="mx-auto mb-0 mt-8 max-w-md space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="sr-only" htmlFor="firstName">
                First Name
              </label>
              <input
                required
                className="w-full rounded-lg border-zinc-200 p-4 text-sm  focus:border-green-500 focus:ring-green-500"
                placeholder="First Name"
                type="text"
                name="firstName"
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="lastName">
                Last Name
              </label>
              <input
                required
                className="w-full rounded-lg border-zinc-200 p-4 text-sm  focus:border-green-500 focus:ring-green-500"
                placeholder="Last Name"
                type="text"
                name="lastName"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>

            <div className="relative">
              <input
                required
                type="email"
                name="email"
                className="w-full rounded-lg border-zinc-200 p-4 pe-12 text-sm shadow-sm  focus:border-green-500 focus:ring-green-500"
                placeholder="Email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="sr-only">
              Phone
            </label>

            <div className="relative">
              <input
                required
                type="tel"
                name="phone"
                className="w-full rounded-lg border-zinc-200 p-4 pe-12 text-sm shadow-sm  focus:border-green-500 focus:ring-green-500"
                placeholder="Phone Number"
              />
            </div>
          </div>

          <div className="relative">
              <input
                required
                type="tel"
                name="role"
                className="w-full rounded-lg border-zinc-200 p-4 pe-12 text-sm shadow-sm  focus:border-green-500 focus:ring-green-500"
                placeholder="role"
              />
            </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>

            <div className="relative">
              <input
                required
                type="password"
                name="password"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm  focus:border-green-500 focus:ring-green-500"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password_confirmed" className="sr-only">
              password_confirmed
            </label>

            <div className="relative">
              <input
                required
                type="password"
                name="password_confirmed"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm  focus:border-green-500 focus:ring-green-500"
                placeholder="Verify Password"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <div className="inline-block relative w-64">
              
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-700"></div>
            </div>
          </div>
          {error && (
            <div className="flex items-center justify-center">
              <p className="text-sm text-green-500">{error}</p>
            </div>
          )}
          <div className="flex items-center justify-center">
            <button
              disabled={loading}
              type="submit"
              className={`inline-block rounded-lg bg-zinc-950 px-32 md:px-48 py-3 text-sm font-medium text-zinc-50 hover:bg-green-700 ${
                loading && 'hover:bg-zinc-950 cursor-wait'
              }`}>
              {loading ? 'Adding temp...' : 'Continue'}
            </button>
          </div>
          <div className="flex justify-center">
            
          </div>
        </form>
      </div>
    </section>
  )
}
