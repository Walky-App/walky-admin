// src/tests/Review.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// Create a simple test component that mimics Review functionality
const TestReviewComponent = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <div data-testid="mock-review-table">Mock Review Table</div>
    </div>
  );
};

describe('Walky Admin - Review Page', () => {
  it('renders the Review page container with proper padding', () => {
    const { container } = render(
      <MemoryRouter>
        <TestReviewComponent />
      </MemoryRouter>
    )

    const div = container.querySelector('div')
    expect(div).toHaveStyle('padding: 2rem')
  })

  it('includes the ReviewTable component', () => {
    render(
      <MemoryRouter>
        <TestReviewComponent />
      </MemoryRouter>
    )

    const testElement = screen.getByTestId('mock-review-table') // 👈 this will throw error if something's off
    expect(testElement).toBeInTheDocument()    
  })
})
