import { MemoryRouter } from 'react-router-dom'

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import { StateSettings } from './StateSettings'

describe('StatesDetailView Page', () => {
  it('should render StatesDetailView view', async () => {
    render(
      <MemoryRouter>
        <StateSettings />
      </MemoryRouter>,
    )

    const statesDetailView = await screen.findByTestId('state-settings')
    expect(statesDetailView).toBeInTheDocument()
  })
})
