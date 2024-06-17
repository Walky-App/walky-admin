import { useState, useMemo } from 'react'

import { useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'

import { LogosPack } from '../../components/layout/LogosPack'
import { ForgotPassword } from './ForgotPasswordForm'
import { LoginForm } from './LoginForm'
import { Signup } from './SignupForm'

export const Auth = () => {
  const [userForm, setUserForm] = useState('Login')
  const [heroImage, setHeroImage] = useState<string>('')
  const navigate = useNavigate()

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

  return (
    <section className="flex h-full min-h-screen items-center justify-center sm:mb-8 md:mb-0 lg:items-center">
      <div className="flex flex-col gap-10 md:basis-1/2">
        <div className="w-full px-4 sm:px-0">
          <div className="flex justify-center">{LogosPack('login')}</div>

          {userForm === 'Login' ? <LoginForm setUserForm={setUserForm} /> : null}
          {userForm === 'Sign up' ? <Signup /> : null}
          {userForm === 'Forgot Password' ? <ForgotPassword /> : null}

          <div className="mr-center flex flex-col items-center justify-center gap-2">
            {userForm === 'Login' ? (
              <div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-2 text-sm text-gray-500">OR</span>
                  </div>
                </div>
                <Button text className="font-medium underline hover:text-green-700" onClick={() => navigate('/signup')}>
                  Sign up
                </Button>
              </div>
            ) : null}

            <div className=" text-zinc-500">
              {userForm !== 'Login' ? (
                <div className="mt-2 text-center">
                  <p>Already have an account?</p>
                  <Button text className="underline hover:text-green-700" onClick={() => setUserForm('Login')}>
                    Login Here
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <footer className="bg-white py-6" aria-labelledby="footer-heading">
          <div className=" pt-8 text-center md:items-center md:justify-center">
            <p className="mt-24 text-xs leading-5 text-gray-500 md:order-1 md:mt-0">
              Copyright © {new Date().getFullYear()} Hemp Temps
            </p>
            <p className="mt-24 text-xs leading-5 text-gray-500 md:order-1 md:mt-0">
              <a href="https://hemptemps.com/terms-and-conditions/" target="_blank" className="underline">
                Terms and Conditions
              </a>
            </p>
          </div>
        </footer>
      </div>
      <div className="relative hidden w-full sm:h-96 lg:block lg:h-screen lg:basis-1/2">
        <img src={heroImage} alt="" className="absolute inset-0 hidden h-full object-cover sm:block" />
      </div>
    </section>
  )
}
