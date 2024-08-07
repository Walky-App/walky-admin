import { MemoryRouter } from 'react-router-dom'

import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import { Settings } from '.'

describe('StateSettings Page', () => {
  it('should render StateSettings view', async () => {
    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>,
    )
    const stateSettings = await screen.findByTestId('states-detail-view')
    expect(stateSettings).toBeInTheDocument()
  })
})
