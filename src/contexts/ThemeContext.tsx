import { type ReactNode, createContext, useContext, useEffect, useState } from 'react'

import { PrimeReactContext } from 'primereact/api'

interface ThemeContextType {
  theme: string
  dark: boolean
  handleChangeTheme(newTheme: string): void
}

interface Props {
  initialTheme: string
  children: ReactNode
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ initialTheme, children }: Props) => {
  const { changeTheme } = useContext(PrimeReactContext)
  const [theme, setTheme] = useState<string>(initialTheme)
  const [themeChanged, setThemeChanged] = useState<boolean>(false)
  const [dark, setDark] = useState(false)

  let ranonce = false
  useEffect(() => {
    if (!ranonce) {
      const localTheme = localStorage.getItem('theme')
      if (localTheme) {
        handleChangeTheme(localTheme)
        setTheme(localTheme)
      } else {
        handleChangeTheme(initialTheme)
        setTheme(initialTheme)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ranonce = true
    }
  }, [])

  const handleChangeTheme = (newTheme: string) => {
    if (!changeTheme) {
      throw new Error('ChangeTheme context not initialized yet.')
    }

    changeTheme(theme, newTheme, 'theme-link', () => {
      setTheme(newTheme)
      localStorage.setItem('theme', newTheme)
      setThemeChanged(true)

      const isDarkTheme = newTheme.includes('dark')
      setDark(isDarkTheme)
      document.body.classList.toggle('dark', isDarkTheme)
    })
  }

  const value = {
    theme,
    dark,
    handleChangeTheme,
  }

  return <ThemeContext.Provider value={value}>{themeChanged ? children : null}</ThemeContext.Provider>
}
