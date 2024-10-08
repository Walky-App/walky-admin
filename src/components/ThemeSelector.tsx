import { ToggleButton } from 'primereact/togglebutton'

import { useTheme } from '../hooks/useTheme'

export const ThemeSelector = () => {
  const { dark, handleChangeTheme } = useTheme()

  const handleToggle = () => {
    const newTheme = dark ? 'walky-light' : 'walky-dark'
    handleChangeTheme(newTheme)
  }

  return (
    <div className="flex gap-4">
      <ToggleButton
        checked={dark}
        onChange={handleToggle}
        onLabel="Beta"
        offLabel="Beta"
        onIcon="pi pi-moon"
        offIcon="pi pi-sun"
        className="md:w-14rem w-full"
      />
    </div>
  )
}
