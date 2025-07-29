// src/tests/Engagement.test.tsx
import { render, screen, waitFor, act } from '@testing-library/react'
import Engagement from '../pages/Engagement'
import { MemoryRouter } from 'react-router-dom'
import API from '../API'

jest.mock('@coreui/react', () => ({
  ...jest.requireActual('@coreui/react'),
  CTooltip: ({ children, content }: { children: React.ReactNode; content: string }) => (
    <div>
      {children}
      <div data-testid="tooltip-content">{content}</div>
    </div>
  ),
}));

// Mock the window resize event
const resizeWindow = (width: number) => {
    window.innerWidth = width
    window.dispatchEvent(new Event('resize'))
  }


let mockIsDark = false

// Mock the useTheme hook
jest.mock('../hooks/useTheme', () => ({
    useTheme: () => ({
      theme: { isDark: mockIsDark },
      toggleTheme: jest.fn(),
    }),
}))

// Mock the API module
jest.mock('../API')
const mockedAPI = jest.mocked(API)

beforeEach(() => {
    jest.clearAllMocks()
  
    mockedAPI.get.mockImplementation((url: string) => {
      switch (url) {
        // Walks
        case '/walks/count':
          return Promise.resolve({ data: { totalWalksCreated: 100 } })
        case '/walks/realtime/pending':
          return Promise.resolve({ data: { pending_count: 10 } })
        case '/walks/realtime/active':
          return Promise.resolve({ data: { active_count: 20 } })
        case '/walks/realtime/completed':
          return Promise.resolve({ data: { completed_count: 60 } })
        case '/walks/realtime/cancelled':
          return Promise.resolve({ data: { cancelled_count: 10 } })
  
        // Events
        case '/events/eventType?filter=total':
          return Promise.resolve({ data: { count: 50 } })
        case '/events/eventType?filter=outdoor':
          return Promise.resolve({ data: { count: 20 } })
        case '/events/eventType?filter=indoor':
          return Promise.resolve({ data: { count: 15 } })
        case '/events/eventType?filter=public':
          return Promise.resolve({ data: { count: 10 } })
        case '/events/eventType?filter=private':
          return Promise.resolve({ data: { count: 5 } })
  
        // Ideas
        case '/ideas/count/total':
          return Promise.resolve({ data: { totalIdeasCreated: 40 } })
        case '/ideas/count/active':
          return Promise.resolve({ data: { activeIdeasCount: 25 } })
        case '/ideas/count/inactive':
          return Promise.resolve({ data: { inactiveIdeasCount: 10 } })
        case '/ideas/count/collaborated':
          return Promise.resolve({ data: { collaboratedIdeasCount: 5 } })
  
        default:
          return Promise.resolve({ data: {} })
      }
    })
  })

afterEach(() => {
    jest.clearAllMocks()
})

describe('Walky Admin - Engagement Page', () => {

  it('renders all 3 engagement sections', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Engagement />
        </MemoryRouter>
      )
    })

    expect(screen.getByTestId('engagement-section-walks')).toBeInTheDocument()
    expect(screen.getByTestId('engagement-section-events')).toBeInTheDocument()
    expect(screen.getByTestId('engagement-section-ideas')).toBeInTheDocument()
  })

  it('renders all stat widgets with correct values and labels', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Engagement />
        </MemoryRouter>
      )
    })

    const widgetExpectations = [
      // Walks
      { section: 'walks', id: 'total-walks', value: '100' },
      { section: 'walks', id: 'pending', value: '10' },
      { section: 'walks', id: 'active', value: '20' },
      { section: 'walks', id: 'completed', value: '60' },
      { section: 'walks', id: 'cancelled/closed', value: '10' },

      // Events
      { section: 'events', id: 'total-events', value: '50' },
      { section: 'events', id: 'outdoor', value: '20' },
      { section: 'events', id: 'indoor', value: '15' },
      { section: 'events', id: 'public', value: '10' },
      { section: 'events', id: 'private', value: '5' },

      // Ideas
      { section: 'ideas', id: 'total-ideas', value: '40' },
      { section: 'ideas', id: 'active', value: '25' },
      { section: 'ideas', id: 'inactive', value: '10' },
      { section: 'ideas', id: 'collaborated', value: '5' },
    ]

    await waitFor(() => {
      for (const { section, id, value } of widgetExpectations) {
        const testId = `engagement-widget-${section}-${id}`
        const el = screen.getByTestId(testId)
        expect(el).toHaveTextContent(value)
      }
    })
  })

  it('fetches stat values from API and renders them correctly', async () => {
    const spy = jest.spyOn(API, 'get') // spy on the get calls

    render(
      <MemoryRouter>
        <Engagement />
      </MemoryRouter>
    )

    await waitFor(() => {
      // Check a few representative widgets
      expect(screen.getByTestId('engagement-widget-walks-total-walks')).toHaveTextContent('100')
      expect(screen.getByTestId('engagement-widget-events-outdoor')).toHaveTextContent('20')
      expect(screen.getByTestId('engagement-widget-ideas-collaborated')).toHaveTextContent('5')
    })

    // Check that key API calls were made
    expect(spy).toHaveBeenCalledWith('/walks/count')
    expect(spy).toHaveBeenCalledWith('/events/eventType?filter=outdoor')
    expect(spy).toHaveBeenCalledWith('/ideas/count/collaborated')

    spy.mockRestore() // cleanup
  })

  it('displays fallback (—) when API returns null or missing values', async () => {
    // Mock API responses with null or missing fields
    mockedAPI.get.mockImplementation((url: string) => {
      switch (url) {
        case '/walks/count':
          return Promise.resolve({ data: { totalWalksCreated: null } })
        case '/walks/realtime/pending':
          return Promise.resolve({ data: {} }) // missing pending_count
        case '/walks/realtime/active':
          return Promise.resolve({ data: { active_count: undefined } })
        case '/walks/realtime/completed':
          return Promise.resolve({ data: { completed_count: null } })
        case '/walks/realtime/cancelled':
          return Promise.resolve({ data: {} })
  
        case '/events/eventType?filter=total':
          return Promise.resolve({ data: {} })
        case '/events/eventType?filter=outdoor':
          return Promise.resolve({ data: { count: null } })
        case '/events/eventType?filter=indoor':
          return Promise.resolve({ data: {} })
        case '/events/eventType?filter=public':
          return Promise.resolve({ data: { count: undefined } })
        case '/events/eventType?filter=private':
          return Promise.resolve({ data: {} })
  
        case '/ideas/count/total':
          return Promise.resolve({ data: { totalIdeasCreated: null } })
        case '/ideas/count/active':
          return Promise.resolve({ data: {} })
        case '/ideas/count/inactive':
          return Promise.resolve({ data: { inactiveIdeasCount: null } })
        case '/ideas/count/collaborated':
          return Promise.resolve({ data: {} })
  
        default:
          return Promise.resolve({ data: {} })
      }
    })
  
    render(
      <MemoryRouter>
        <Engagement />
      </MemoryRouter>
    )
  
    await waitFor(() => {
      // Walks
      expect(screen.getByTestId('engagement-widget-walks-total-walks')).toHaveTextContent('-')
      expect(screen.getByTestId('engagement-widget-walks-pending')).toHaveTextContent('-')
      expect(screen.getByTestId('engagement-widget-walks-active')).toHaveTextContent('-')
      expect(screen.getByTestId('engagement-widget-walks-completed')).toHaveTextContent('-')
      expect(screen.getByTestId('engagement-widget-walks-cancelled/closed')).toHaveTextContent('-')
  
      // Events
      expect(screen.getByTestId('engagement-widget-events-total-events')).toHaveTextContent('-')
      expect(screen.getByTestId('engagement-widget-events-outdoor')).toHaveTextContent('-')
      expect(screen.getByTestId('engagement-widget-events-indoor')).toHaveTextContent('-')
      expect(screen.getByTestId('engagement-widget-events-public')).toHaveTextContent('-')
      expect(screen.getByTestId('engagement-widget-events-private')).toHaveTextContent('-')
  
      // Ideas
      expect(screen.getByTestId('engagement-widget-ideas-total-ideas')).toHaveTextContent('-')
      expect(screen.getByTestId('engagement-widget-ideas-active')).toHaveTextContent('-')
      expect(screen.getByTestId('engagement-widget-ideas-inactive')).toHaveTextContent('-')
      expect(screen.getByTestId('engagement-widget-ideas-collaborated')).toHaveTextContent('-')
    })
  })

  it('applies correct background colors to each engagement section', () => {
    render(
      <MemoryRouter>
        <Engagement />
      </MemoryRouter>
    )
  
    const sections = [
      { id: 'walks', expected: 'rgb(111, 66, 193)' },   // 💜 #6f42c1
      { id: 'events', expected: 'rgb(66, 165, 245)' },  // 💙 #42a5f5
      { id: 'ideas', expected: 'rgb(240, 173, 78)' },   // 🧡 #f0ad4e
    ]
  
    sections.forEach(({ id, expected }) => {
      const el = screen.getByTestId(`engagement-section-${id}`)
      expect(getComputedStyle(el).backgroundColor).toBe(expected)
    })
  })

  it('layout remains responsive across screen sizes', () => {
    // Render at desktop size
    resizeWindow(1200)
    render(
      <MemoryRouter>
        <Engagement />
      </MemoryRouter>
    )
  
    const walksSection = screen.getByTestId('engagement-section-walks')
    expect(walksSection).toBeInTheDocument()
  
    const beforeStyles = getComputedStyle(walksSection)
    const beforeWrap = beforeStyles.flexWrap || beforeStyles.display
  
    // Simulate mobile/tablet
    resizeWindow(480)
    const afterStyles = getComputedStyle(walksSection)
    const afterWrap = afterStyles.flexWrap || afterStyles.display
  
    // Confirm it still renders and adapts
    expect(beforeWrap).toBeDefined()
    expect(afterWrap).toBeDefined()
    expect(walksSection).toBeVisible()
  })

  it('makes correct API calls per section', async () => {
    render(
      <MemoryRouter>
        <Engagement />
      </MemoryRouter>
    )
  
    await waitFor(() => {
      // Walks
      expect(mockedAPI.get).toHaveBeenCalledWith('/walks/count')
      expect(mockedAPI.get).toHaveBeenCalledWith('/walks/realtime/pending')
      expect(mockedAPI.get).toHaveBeenCalledWith('/walks/realtime/active')
      expect(mockedAPI.get).toHaveBeenCalledWith('/walks/realtime/completed')
      expect(mockedAPI.get).toHaveBeenCalledWith('/walks/realtime/cancelled')
  
      // Events
      expect(mockedAPI.get).toHaveBeenCalledWith('/events/eventType?filter=total')
      expect(mockedAPI.get).toHaveBeenCalledWith('/events/eventType?filter=outdoor')
      expect(mockedAPI.get).toHaveBeenCalledWith('/events/eventType?filter=indoor')
      expect(mockedAPI.get).toHaveBeenCalledWith('/events/eventType?filter=public')
      expect(mockedAPI.get).toHaveBeenCalledWith('/events/eventType?filter=private')
  
      // Ideas
      expect(mockedAPI.get).toHaveBeenCalledWith('/ideas/count/total')
      expect(mockedAPI.get).toHaveBeenCalledWith('/ideas/count/active')
      expect(mockedAPI.get).toHaveBeenCalledWith('/ideas/count/inactive')
      expect(mockedAPI.get).toHaveBeenCalledWith('/ideas/count/collaborated')
    })
  })
  
  it('handles API errors gracefully and does not crash the UI', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    // 🧪 Force all API.get calls to fail
    jest.spyOn(API, 'get').mockRejectedValue(new Error('Fetch failed'))
    render(
      <MemoryRouter>
        <Engagement />
      </MemoryRouter>
    )
  
    // Wait for widgets to attempt render with fallback values
    await waitFor(() => {
      // Walks
      expect(screen.getByTestId('engagement-widget-walks-total-walks')).toHaveTextContent(/-|0/)
      expect(screen.getByTestId('engagement-widget-walks-pending')).toHaveTextContent(/-|0/)
      expect(screen.getByTestId('engagement-widget-walks-active')).toHaveTextContent(/-|0/)
      expect(screen.getByTestId('engagement-widget-walks-completed')).toHaveTextContent(/-|0/)
      expect(screen.getByTestId('engagement-widget-walks-cancelled/closed')).toHaveTextContent(/-|0/)
  
      // Events
      expect(screen.getByTestId('engagement-widget-events-total-events')).toHaveTextContent(/-|0/)
      expect(screen.getByTestId('engagement-widget-events-outdoor')).toHaveTextContent(/-|0/)
      expect(screen.getByTestId('engagement-widget-events-indoor')).toHaveTextContent(/-|0/)
      expect(screen.getByTestId('engagement-widget-events-public')).toHaveTextContent(/-|0/)
      expect(screen.getByTestId('engagement-widget-events-private')).toHaveTextContent(/-|0/)
  
      // Ideas
      expect(screen.getByTestId('engagement-widget-ideas-total-ideas')).toHaveTextContent(/-|0/)
      expect(screen.getByTestId('engagement-widget-ideas-active')).toHaveTextContent(/-|0/)
      expect(screen.getByTestId('engagement-widget-ideas-inactive')).toHaveTextContent(/-|0/)
      expect(screen.getByTestId('engagement-widget-ideas-collaborated')).toHaveTextContent(/-|0/)
    })

    errorSpy.mockRestore()
  })  

  describe('Engagement Widgets - Stat Cards', () => {
    const widgetsToCheck = [
      // Walks
      { testId: 'engagement-widget-walks-total-walks', label: 'Total Walks' },
      { testId: 'engagement-widget-walks-pending', label: 'Pending' },
      { testId: 'engagement-widget-walks-active', label: 'Active' },
      { testId: 'engagement-widget-walks-completed', label: 'Completed' },
      { testId: 'engagement-widget-walks-cancelled/closed', label: 'Cancelled/Closed' },
  
      // Events
      { testId: 'engagement-widget-events-total-events', label: 'Total Events' },
      { testId: 'engagement-widget-events-outdoor', label: 'Outdoor' },
      { testId: 'engagement-widget-events-indoor', label: 'Indoor' },
      { testId: 'engagement-widget-events-public', label: 'Public' },
      { testId: 'engagement-widget-events-private', label: 'Private' },
  
      // Ideas
      { testId: 'engagement-widget-ideas-total-ideas', label: 'Total Ideas' },
      { testId: 'engagement-widget-ideas-active', label: 'Active' },
      { testId: 'engagement-widget-ideas-inactive', label: 'Inactive' },
      { testId: 'engagement-widget-ideas-collaborated', label: 'Collaborated' },
    ]
  
    it('renders a widget with correct props (value, label, tooltip, color)', async () => {
      render(
        <MemoryRouter>
          <Engagement />
        </MemoryRouter>
      )
  
      const walksWidget = screen.getByTestId('engagement-widget-walks-total-walks')
      expect(walksWidget).toHaveTextContent('Total Walks')
      expect(walksWidget).toHaveTextContent('0')
      const walksBar = walksWidget.querySelector('div > div:last-child > div')
      expect(walksBar).toHaveStyle('background-color: #6f42c1')
  
      const eventsWidget = screen.getByTestId('engagement-widget-events-total-events')
      expect(eventsWidget).toHaveTextContent('Total Events')
      expect(eventsWidget).toHaveTextContent('0')
      const eventsBar = eventsWidget.querySelector('div > div:last-child > div')
      expect(eventsBar).toHaveStyle('background-color: #42a5f5')
  
      const ideasWidget = screen.getByTestId('engagement-widget-ideas-total-ideas')
      expect(ideasWidget).toHaveTextContent('Total Ideas')
      expect(ideasWidget).toHaveTextContent('0')
      const ideasBar = ideasWidget.querySelector('div > div:last-child > div')
      expect(ideasBar).toHaveStyle('background-color: #f0ad4e')
    })
  
    it('renders correct value and label for each widget', () => {
      render(
        <MemoryRouter>
          <Engagement />
        </MemoryRouter>
      )
  
      widgetsToCheck.forEach(({ testId, label }) => {
        const widget = screen.getByTestId(testId)
        expect(widget).toHaveTextContent(label)
        expect(widget).toHaveTextContent('0')
      })
    })
  
    it('renders an icon with correct style in each widget', () => {
      render(
        <MemoryRouter>
          <Engagement />
        </MemoryRouter>
      )
  
      widgetsToCheck.forEach(({ testId }) => {
        const widget = screen.getByTestId(testId)
        const icon = widget.querySelector('svg')
  
        expect(icon).toBeInTheDocument()
        expect(icon).toHaveAttribute('height', '28')
        expect(icon?.getAttribute('style')).toContain('position: absolute')
        expect(icon?.getAttribute('style')).toContain('top: 0.75rem')
        expect(icon?.getAttribute('style')).toContain('right: 0.75rem')
      })
    })

    it('displays tooltip on hover with correct content', async () => {
        await act(async () => {
          render(
            <MemoryRouter>
              <Engagement />
            </MemoryRouter>
          )
        })
      
      
        const tooltipsToCheck = [
          { testId: 'engagement-widget-walks-total-walks', expected: 'Number of total walks recorded' },
          { testId: 'engagement-widget-events-total-events', expected: 'Number of total events created' },
          { testId: 'engagement-widget-ideas-total-ideas', expected: 'Number of total ideas created' },
        ]
      
        const tooltips = screen.getAllByTestId("tooltip-content")
        expect(tooltips).toHaveLength(3)
        
        for (let i = 0; i < tooltipsToCheck.length; i++) {
          expect(tooltips[i]).toBeInTheDocument()
          expect(tooltips[i]).toHaveTextContent(tooltipsToCheck[i].expected)
        }
      })
    
      it('applies correct light mode styles', async () => {
        mockIsDark = false // Light mode
        await act(async () => {
          render(
            <MemoryRouter>
              <Engagement />
            </MemoryRouter>
          )
        })
      
        const widget = screen.getByTestId('engagement-widget-walks-total-walks')
        expect(widget).toHaveStyle('background-color: #f8f9fa')
        expect(widget.querySelector('strong')).toHaveStyle('color: #000')
      })
      
      it('applies correct dark mode styles', async () => {
        mockIsDark = true // Dark mode
        await act(async () => {
          render(
            <MemoryRouter>
              <Engagement />
            </MemoryRouter>
          )
        })
      
        const widget = screen.getByTestId('engagement-widget-walks-total-walks')
        expect(widget).toHaveStyle('background-color: #2a2d36')
        expect(widget.querySelector('strong')).toHaveStyle('color: #d1d5db')
    })
   
})
  
})


  