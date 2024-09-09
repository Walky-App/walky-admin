import { useState, useMemo } from 'react'

import { useNavigate } from 'react-router-dom'

import { Button } from 'primereact/button'

import packageJson from '../../../package.json'
import { LogosPack } from '../../components/layout/LogosPack'
import { ForgotPassword } from './ForgotPasswordForm'
import { LoginForm } from './LoginForm'
import { Signup } from './SignupForm'

export const loginHeroImages = [
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

export const Auth = () => {
  const [userForm, setUserForm] = useState('Login')
  const [heroImage, setHeroImage] = useState<string>('')
  const navigate = useNavigate()

  useMemo(() => {
    const getImages = async () => {
      try {
        const randomIndex = Math.floor(Math.random() * loginHeroImages.length)

        setHeroImage(loginHeroImages[randomIndex])
      } catch (error) {
        console.error('Error fetching images:', error)
      }
    }
    getImages()
  }, [])

  return (
    <section
      className="flex h-full min-h-screen items-center justify-center sm:mb-8 md:mb-0 lg:items-center"
      data-testid="auth-section">
      <div className="gap-10 md:basis-1/2">
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
        <footer className="py-6" aria-labelledby="footer-heading">
          <div className="text-center text-xs text-gray-500 md:items-center md:justify-center">
            <p className="">Copyright © {new Date().getFullYear()} Hemp Temps</p>
            <p className="my-1">
              <a href="https://hemptemps.com/terms-and-conditions/" target="_blank" className="underline">
                Terms and Conditions
              </a>
            </p>
            <small className="text-[10px] font-extralight">v{packageJson.version}</small>
          </div>
        </footer>
      </div>
      <div className="relative hidden w-full sm:h-96 lg:block lg:h-screen lg:basis-1/2">
        <img
          data-testid="hero-image"
          src={heroImage}
          alt="Hemp Temps"
          className="absolute inset-0 hidden h-full object-cover sm:block"
        />
      </div>
    </section>
  )
}
