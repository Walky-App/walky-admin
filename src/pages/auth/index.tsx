import { useState, useMemo } from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import ForgotPasswordForm from './ForgotPasswordForm'

export default function Auth() {
  const [userForm, setUserForm] = useState('Login')
  const [heroImage, setHeroImage] = useState<string>('')

  useMemo(() => {
    const getImages = async () => {
      try {
        const allImages = [
          "https://hemptemps-prod.s3.amazonaws.com/web-images/1.png",
          "https://hemptemps-prod.s3.amazonaws.com/web-images/10.jpg",
          "https://hemptemps-prod.s3.amazonaws.com/web-images/11.jpg",
          "https://hemptemps-prod.s3.amazonaws.com/web-images/12.jpg",
          "https://hemptemps-prod.s3.amazonaws.com/web-images/13.jpg",
          "https://hemptemps-prod.s3.amazonaws.com/web-images/2.png",
          "https://hemptemps-prod.s3.amazonaws.com/web-images/3.png",
          "https://hemptemps-prod.s3.amazonaws.com/web-images/4.jpg",
          "https://hemptemps-prod.s3.amazonaws.com/web-images/5.jpg",
          "https://hemptemps-prod.s3.amazonaws.com/web-images/6.jpg",
          "https://hemptemps-prod.s3.amazonaws.com/web-images/7.jpg",
          "https://hemptemps-prod.s3.amazonaws.com/web-images/8.jpg",
          "https://hemptemps-prod.s3.amazonaws.com/web-images/9.jpg"
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
        <div className="w-full">
          <div className="flex justify-center">
            <img src="/assets/logos/logo-horizontal-cropped.png" alt="hemp temps logo" height={300} />
          </div>
         
          {userForm === 'Login' && <LoginForm />}
          {userForm === 'Sign up' && <SignupForm />}
          {userForm === 'Forgot Password' && <ForgotPasswordForm />}

          <div className="flex mr-6 flex-col items-center justify-center gap-2">
            {userForm === 'Login' && (
              <a
                className="font-medium underline hover:text-green-700"
                href="#"
                onClick={() => setUserForm('Forgot Password')}>
                Forgot your password?
              </a>
            )}

            <p className="text-sm text-zinc-500">
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
          <small className="text-xs mr-6 text-gray-400  ">v.1.0.0{process.env.NODE_ENV === 'development' ? 'd' : 'p'}</small>
        </div>
      </div>
      <div className="relative hidden w-full sm:h-96 lg:block lg:h-screen lg:basis-1/2">
        <img src={heroImage} alt="" className="absolute inset-0 hidden h-full object-cover sm:block" />
      </div>
    </section>
  )
}
