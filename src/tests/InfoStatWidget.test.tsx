// src/tests/InfoStatWidget.test.tsx
import { render, screen } from '@testing-library/react'
import InfoStatWidget from '../components/InfoStatWidget'
import * as icon from '@coreui/icons'
import userEvent from '@testing-library/user-event'

// Mock useTheme as usual
jest.mock('../hooks/useTheme', () => ({
  useTheme: () => ({
    theme: {
      isDark: false,
      colors: {
        cardBg: '#fff',
        bodyBg: '#fff',
        bodyColor: '#000',
        borderColor: '#ccc',
        primary: '#007bff',
      },
    },
    toggleTheme: jest.fn(),
  }),
}))

// mock dark mode
jest.mock('../hooks/useTheme', () => ({
  useTheme: () => ({
    theme: {
      isDark: true,
      colors: {
        cardBg: '#1c1e21',
        bodyBg: '#121416',
        bodyColor: '#f8f9fa',
        borderColor: '#444',
        primary: '#6610f2',
      },
    },
    toggleTheme: jest.fn(),
  }),
}))


describe('Walky Admin - InfoStatWidget Component', () => {
  it('receives props correctly and renders icon, value, and label', () => {
    render(
      <InfoStatWidget
        icon={icon.cilPeople}
        value="123"
        label="Total Students"
        tooltip="Total number of students"
        testId="info-widget"
      />
    )

    const widget = screen.getByTestId('info-widget')
    expect(widget).toBeInTheDocument()
    expect(screen.getByText('123')).toBeInTheDocument()
    expect(screen.getByText('Total Students')).toBeInTheDocument()
    // Tooltip is not tested since it's hidden unless hovered
  })

  it('applies correct dark mode styles', () => {
    render(
      <InfoStatWidget
        icon={icon.cilPeople}
        value="123"
        label="Total Students"
        tooltip="Total number of students"
        testId="dark-widget"
      />
    )

    const widget = screen.getByTestId('dark-widget')
    expect(widget).toBeInTheDocument()

    // Right block (text background) should have dark theme primary color
    const rightBlock = widget.querySelector('div.d-flex.flex-column')
    expect(rightBlock).toHaveStyle('background-color: #6610f2')
    expect(rightBlock).toHaveStyle('color: #fff')

    // Left block (icon background) should be darker
    const leftBlock = widget.querySelector('div.d-flex.align-items-center')
    expect(leftBlock).toHaveStyle('background-color: #2a2d36')
  })

  it('displays tooltip with correct content on hover', async () => {
    render(
      <InfoStatWidget
        icon={icon.cilPeople}
        value="456"
        label="Average Age"
        tooltip="This is the average age of all users"
        testId="tooltip-widget"
      />
    )

    const widget = screen.getByTestId('tooltip-widget')

    // Simulate hover to trigger the tooltip
    await userEvent.hover(widget)

    // Tooltip text should appear in the DOM
    const tooltip = await screen.findByText("This is the average age of all users")
    expect(tooltip).toBeInTheDocument()
  })
})
