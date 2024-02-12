import { useState } from 'react'

import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import ForgotPasswordForm from './ForgotPasswordForm'
// import ResetPasswordForm from './ResetPasswordForm'

export default function Auth() {
  const [userForm, setUserForm] = useState('login')

  return (
    <section className="min-h-screen items-center justify-center flex flex-wrap sm:mb-8 md:mb-0 h-full lg:items-center">
      <div className='flex flex-col basis-1/2'>


        {/* <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24"> */}
        <div className="w-full">
          <div className="flex justify-center">
            <img src="/assets/logos/logo-horizontal-cropped.png" alt="hemp temps logo" height={300} />
          </div>
          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-2xl font-bold sm:text-3xl">Login</h1>
          </div>

          {userForm === 'login' && <LoginForm />}
          {userForm === 'signup' && <SignupForm />}
          {userForm === 'forgotPassword' && <ForgotPasswordForm />}
          {/* {userForm === 'resetPassword' && <ResetPasswordForm />} */}

          
          <div className="flex justify-center">
            <a className="underline font-medium hover:text-green-700" href="#">
              Forgot your password?
            </a>
          </div>
          <div className="flex justify-center">
            <p className="text-sm text-zinc-500">
              {userForm === 'login' && (
                <section>
                  No account? &nbsp;
                  <a className="underline hover:text-green-700" href="#" onClick={() => setUserForm('signup')}>
                    Sign up
                  </a>
                </section>
              )}

              {userForm === 'signup' && (
                <div>
                  Already have an account? &nbsp;
                  <a className="underline hover:text-green-700" href="#" onClick={() => setUserForm('login')}>
                    Login
                  </a>
                </div>
              )}
            </p>
          </div>
        </div>
        <div className='flex justify-center'>
          <small className="text-xs text-gray-400  ">
            v.1.0.0{process.env.NODE_ENV === 'development' ? 'd' : 'p'}
          </small>
        </div>
      </div>
      <div className="relative hidden w-full lg:block sm:h-96 lg:h-screen lg:basis-1/2">
        <img
          alt="Hemp Temp employees trimming"
          src="/assets/photos/trim-close-up.jpg"
          className="absolute inset-0 object-cover h-full hidden sm:block"
        />
      </div>


    </section>

  )
}
