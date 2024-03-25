import { useState, useMemo } from 'react'

import ForgotPasswordForm from './ForgotPasswordForm'
import { LoginForm } from './LoginForm'
import SignupForm from './SignupForm'

export const Auth = () => {
  const [userForm, setUserForm] = useState('Login')
  const [heroImage, setHeroImage] = useState<string>('')

  useMemo(() => {
    const getImages = async () => {
      try {
        const allImages = [
          'https://hemptemps-prod.s3.amazonaws.com/web-images/1.png',
          'https://hemptemps-prod.s3.amazonaws.com/web-images/10.jpg',
          'https://hemptemps-prod.s3.amazonaws.com/web-images/12.jpg',
          'https://hemptemps-prod.s3.amazonaws.com/web-images/13.jpg',
          'https://hemptemps-prod.s3.amazonaws.com/web-images/2.png',
          'https://hemptemps-prod.s3.amazonaws.com/web-images/3.png',
          'https://hemptemps-prod.s3.amazonaws.com/web-images/5.jpg',
          'https://hemptemps-prod.s3.amazonaws.com/web-images/6.jpg',
          'https://hemptemps-prod.s3.amazonaws.com/web-images/7.jpg',
          'https://hemptemps-prod.s3.amazonaws.com/web-images/8.png',
          'https://hemptemps-prod.s3.amazonaws.com/web-images/14.png',
          'https://hemptemps-prod.s3.amazonaws.com/web-images/15.png',
          'https://hemptemps-prod.s3.amazonaws.com/web-images/20.png',
        ]
        const randomIndex = Math.floor(Math.random() * allImages.length)

        setHeroImage(allImages[randomIndex])
      } catch (error) {
        console.error('Error fetching images:', error)
      }
    }
    getImages()
  }, [])

  const chooseLogoImage = () => {
    const currentURL = window.location.href
    if (currentURL.toLowerCase().includes('hydropallet')) {
      return (
        <img src="/assets/logos/hydropallet-black-logo.png" alt="Hydropallet Logo" className="sm:w-full xl:px-12" />
      )
    } else {
      return (
        <img src="/assets/logos/logo-horizontal-cropped.png" alt="Hemp Temps logo" className="sm:w-full xl:px-12" />
      )
    }
  }

  return (
    <section className="flex h-full min-h-screen items-center justify-center sm:mb-8 md:mb-0 lg:items-center">
      <div className="flex flex-col gap-10 md:basis-1/2">
        <div className="w-full px-4 sm:px-0">
          <div className="flex justify-center">{chooseLogoImage()}</div>

          {userForm === 'Login' ? <LoginForm /> : null}
          {userForm === 'Sign up' ? <SignupForm /> : null}
          {userForm === 'Forgot Password' ? <ForgotPasswordForm /> : null}

          <div className="mr-center flex flex-col items-center justify-center gap-2">
            {userForm === 'Login' ? (
              <button
                type="button"
                className="font-medium underline hover:text-green-700"
                onClick={() => setUserForm('Forgot Password')}>
                Forgot your password?
              </button>
            ) : null}

            <p className="text-sm text-zinc-500">
              {userForm !== 'Login' ? (
                <div>
                  Already have an account? &nbsp;
                  <button type="button" className="underline hover:text-green-700" onClick={() => setUserForm('Login')}>
                    Login
                  </button>
                </div>
              ) : null}
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <small className="text-xs text-gray-400  ">v.1.0.0{process.env.NODE_ENV === 'development' ? 'd' : 'p'}</small>
        </div>
      </div>
      <div className="relative hidden w-full sm:h-96 lg:block lg:h-screen lg:basis-1/2">
        <img src={heroImage} alt="" className="absolute inset-0 hidden h-full object-cover sm:block" />
      </div>
    </section>
  )
}
