// src/tests/Review.test.tsx
import { render, screen } from '@testing-library/react'
import Review from '../pages/Review'
import { MemoryRouter } from 'react-router-dom'

jest.mock('../components/ReviewTable', () => () => (
    <div data-testid="mock-review-table">Mock Review Table</div>
))

describe('Walky Admin - Review Page', () => {
  it('renders the Review page container with proper padding', () => {
    const { container } = render(
      <MemoryRouter>
        <Review />
      </MemoryRouter>
    )

    const div = container.querySelector('div')
    expect(div).toHaveStyle('padding: 2rem')
  })

  it('includes the ReviewTable component', () => {
    render(
      <MemoryRouter>
        <Review />
      </MemoryRouter>
    )

    const testElement = screen.getByTestId('mock-review-table') // 👈 this will throw error if something's off
    expect(testElement).toBeInTheDocument()    
  })
})
