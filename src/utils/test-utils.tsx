import React, { type ReactElement } from 'react'

import { MemoryRouter } from 'react-router-dom'

import '@testing-library/jest-dom'
import { render, type RenderOptions } from '@testing-library/react'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const originalConsoleError = console.error
  const jsDomCssError = 'Error: Could not parse CSS stylesheet'
  console.error = (...params) => {
    if (!params.find(p => p.toString().includes(jsDomCssError))) {
      originalConsoleError(...params)
    }
  }
  return <MemoryRouter>{children}</MemoryRouter>
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
