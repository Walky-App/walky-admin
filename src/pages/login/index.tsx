import { useState } from 'react'

import LoginForm from '../../components/forms/LoginForm'

export default function Home() {
  const [userForm, setUserForm] = useState('login')

  const handleUserForm = () => {
    if (userForm === 'login') {
      return <LoginForm />
    } else if (userForm === 'signup') {
      // return <SignupForm />
    } else if (userForm === 'forgotPassword') {
      // return <ForgotPasswordForm />
    } else if (userForm === 'resetPassword') {
      // return <ResetPasswordForm />
    } else {
      return <LoginForm />
    }
  }

  return (
    <section className="relative flex flex-wrap sm:mb-8 md:mb-0 h-screen lg:items-center">
      <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24">
        <div className="flex justify-center">
          <img src="/assets/logos/logo-horizontal-cropped.png" alt="hemp temps logo" height={300} />
        </div>
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">Login</h1>
        </div>

        {handleUserForm()}

        <hr className="my-10 w-1/2 mx-auto border-t border-green-600" />
        <div className="flex justify-center">
          <a className="underline font-medium hover:text-green-700" href="/forgot-password">
            Forgot your password?
          </a>
        </div>
        <div className="flex justify-center">
          <p className="text-sm text-zinc-500">
            No account? &nbsp;
            <a className="underline hover:text-green-700" href="/signup">
              Sign up
            </a>
          </p>
        </div>
        <small className="absolute bottom-2 text-xs text-gray-400 left-1/4 transform -translate-x-1/2">
          v.1.0.0{process.env.NODE_ENV === 'development' ? 'd' : 'p'}
        </small>
      </div>

      <div className="relative h-64 w-full sm:h-96 lg:h-full lg:w-1/2">
        <img
          alt="Hemp Temp employees trimming"
          src="/assets/photos/trim-close-up.jpg"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </section>
  )
}
