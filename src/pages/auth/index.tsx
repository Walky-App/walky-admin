import React, { useState, useEffect } from 'react'

import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import ForgotPasswordForm from './ForgotPasswordForm'
import { set } from 'react-hook-form'

const ImageRotator: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('')

  useEffect(() => {
    const imagesUrl = [
      '/assets/photos/trim-close-up.jpg',
      '/assets/photos/trim-team.jpg',
      '/assets/photos/trim2.jpg',
      'https://hemptemps.com/wp-content/uploads/2021/05/news-cannabis-growth-1583x791.jpg',
      'https://hemptemps.com/wp-content/uploads/2023/03/20211019_122700-scaled-2560x1280.jpg',
      'https://valleyadvocate.com/wp-content/uploads/2017/03/ThinkstockPhotos-515262904-e1490709336307-1024x683.jpg',
      'https://hemptemps.com/wp-content/uploads/2021/10/blog-head-10-20.png',
    ]
    const randomImagesUrl = imagesUrl[Math.floor(Math.random() * imagesUrl.length)]
    setImageUrl(randomImagesUrl)
  }, [])

  return (
    <div className="relative hidden w-full sm:h-96 lg:block lg:h-screen lg:basis-1/2">
      <img
        alt="Hemp Temp employees trimming"
        src={imageUrl}
        className="absolute inset-0 hidden h-full object-cover sm:block"
      />
    </div>
  )
}

export default function Auth() {
  const [userForm, setUserForm] = useState('Login')

  return (
    <section className="flex h-full min-h-screen items-center justify-center sm:mb-8 md:mb-0 lg:items-center">
      <div className="flex flex-col gap-10 md:basis-1/2">
        <div className="w-full">
          <div className="flex justify-center">
            <img src="/assets/logos/logo-horizontal-cropped.png" alt="hemp temps logo" height={300} />
          </div>
          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-2xl font-bold sm:text-3xl">Login</h1>
          </div>

          {userForm === 'Login' && <LoginForm />}
          {userForm === 'Sign up' && <SignupForm />}
          {userForm === 'Forgot Password' && <ForgotPasswordForm />}

          <div className="flex flex-col items-center justify-center gap-2">
            {userForm === 'Login' && (
              <a
                className="font-medium underline hover:text-green-700"
                href="#"
                onClick={() => setUserForm('Forgot Password')}>
                Forgot your password?
              </a>
            )}

            <p className="text-sm text-zinc-500">
              {/* {userForm === 'Login' && (
                <section>
                  No account? &nbsp;
                  <a className="underline hover:text-green-700" href="#" onClick={() => setUserForm('Sign up')}>
                    Sign up
                  </a>
                </section>
              )} */}

              {userForm !== 'Login' && (
                <div>
                  Already have an account? &nbsp;
                  <a className="underline hover:text-green-700" href="#" onClick={() => setUserForm('Login')}>
                    Login
                  </a>
                </div>
              )}
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <small className="text-xs text-gray-400  ">v.1.0.0{process.env.NODE_ENV === 'development' ? 'd' : 'p'}</small>
        </div>
      </div>
      <ImageRotator />
    </section>
  )
}
