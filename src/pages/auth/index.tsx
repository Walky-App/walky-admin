import { useState } from 'react'

import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import ForgotPasswordForm from './ForgotPasswordForm'
// import ResetPasswordForm from './ResetPasswordForm'

export default function Auth() {
  const [userForm, setUserForm] = useState('Login')

  return (
    <section className="min-h-screen flex items-center justify-center relative flex flex-wrap sm:mb-8 md:mb-0 h-screen lg:items-center">
      <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24">
        <div className="flex justify-center">
          <img src="/assets/logos/logo-horizontal-cropped.png" alt="hemp temps logo" height={300} />
        </div>

        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">{userForm}</h1>
        </div>

        {userForm === 'Login' && <LoginForm />}
        {userForm === 'Sign Up' && <SignupForm />}
        {userForm === 'Forgot Password' && <ForgotPasswordForm setUserForm={setUserForm} />}
        {/* {userForm === 'resetPassword' && <ResetPasswordForm />} */}

        <hr className="my-10 w-1/2 mx-auto border-t border-green-600" />
        {userForm !== 'Forgot Password' && (
          <div className="flex justify-center">
            <a
              className="underline font-medium hover:text-green-700"
              href="#"
              onClick={() => setUserForm('Forgot Password')}>
              Forgot your password?
            </a>
          </div>
        )}
        <div className="flex justify-center">
          <p className="text-sm text-zinc-500">
            {userForm === 'Login' && (
              <section>
                No account? &nbsp;
                <a className="underline hover:text-green-700" href="#" onClick={() => setUserForm('Sign Up')}>
                  Sign up
                </a>
              </section>
            )}

            {userForm === 'Sign Up' && (
              <div>
                Already have an account? &nbsp;
                <a className="underline hover:text-green-700" href="#" onClick={() => setUserForm('Login')}>
                  Login
                </a>
              </div>
            )}

            {userForm === 'Forgot Password' && (
              <div>
                Remembered your password? &nbsp;
                <a className="underline hover:text-green-700" href="#" onClick={() => setUserForm('Login')}>
                  Login
                </a>
              </div>
            )}
          </p>
        </div>
        <small className=" absolute bottom-2 text-xs text-gray-400 left-1/2 transform -translate-x-1/2 lg:bottom-2 lg:left-1/4 lg:transform lg:-translate-x-1/2">
          v.1.0.0{process.env.NODE_ENV === 'development' ? 'd' : 'p'}
        </small>
      </div>

      <div className=" hidden lg:flex relative h-64 w-full sm:h-96 lg:h-full lg:w-1/2">
        <img
          alt="Hemp Temp employees trimming"
          src="/assets/photos/trim-close-up.jpg"
          className="absolute inset-0 h-full w-full object-cover hidden sm:block"
        />
      </div>
    </section>
  )
}
