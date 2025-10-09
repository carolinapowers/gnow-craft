/**
 * TeeTimeFilter Component Tests - Testing Library Version
 * 
 * This version uses Testing Library's user-centric approach
 * focusing on accessibility and how users interact with the component
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, waitFor, within } from '@/test/helpers/testing-library'
import TeeTimeFilter from '../TeeTimeFilter.vue'

// Mock tee time data
const mockTeeTimes = [
  {
    id: 1,
    course: 'Pine Valley Golf Club',
    date: '2024-03-15',
    time: '8:00 AM',
    price: 150,
    available: true
  },
  {
    id: 2,
    course: 'Ocean Course',
    date: '2024-03-15',
    time: '10:00 AM',
    price: 250,
    available: true
  },
  {
    id: 3,
    course: 'Mountain View Golf',
    date: '2024-03-16',
    time: '7:00 AM',
    price: 100,
    available: true
  }
]

describe('TeeTimeFilter Component - Testing Library Approach', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  
  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllTimers()
  })

  describe('Accessibility', () => {
    it('should be fully accessible with proper ARIA attributes', () => {
      render(TeeTimeFilter, {
        props: { teeTimes: mockTeeTimes }
      })

      // Check form accessibility
      const courseSelect = screen.getByLabelText(/golf course/i)
      expect(courseSelect).toBeInTheDocument()
      expect(courseSelect).toHaveAccessibleName('Filter by golf course')

      const dateInput = screen.getByLabelText(/date/i)
      expect(dateInput).toBeInTheDocument()
      expect(dateInput).toHaveAccessibleName('Filter by date')

      // Check that price sliders have proper labels
      const minPriceSlider = screen.getByLabelText(/minimum price/i)
      expect(minPriceSlider).toBeInTheDocument()
      expect(minPriceSlider).toHaveAttribute('aria-describedby')

      const maxPriceSlider = screen.getByLabelText(/maximum price/i)
      expect(maxPriceSlider).toBeInTheDocument()
      expect(maxPriceSlider).toHaveAttribute('aria-describedby')

      // Check clear button
      const clearButton = screen.getByRole('button', { name: /clear all/i })
      expect(clearButton).toBeInTheDocument()
    })

    it('should announce filter changes to screen readers', async () => {
      const { user } = render(TeeTimeFilter, {
        props: { teeTimes: mockTeeTimes }
      })

      // Select a course
      const courseSelect = screen.getByLabelText(/golf course/i)
      await user.selectOptions(courseSelect, 'Pine Valley Golf Club')

      // Check for live region announcement
      await waitFor(() => {
        const liveRegion = screen.getByRole('status')
        expect(liveRegion).toHaveTextContent(/pine valley golf club/i)
      })
    })
  })

  describe('User Interactions', () => {
    it('should filter by course when user selects from dropdown', async () => {
      const handleFilterChange = vi.fn()
      const { user } = render(TeeTimeFilter, {
        props: { 
          teeTimes: mockTeeTimes,
          onFilterChange: handleFilterChange
        }
      })

      // Find and interact with the course dropdown
      const courseSelect = screen.getByLabelText(/golf course/i)
      await user.selectOptions(courseSelect, 'Pine Valley Golf Club')

      // Verify the filter was applied
      await waitFor(() => {
        expect(handleFilterChange).toHaveBeenCalledWith(
          expect.objectContaining({
            course: 'Pine Valley Golf Club'
          })
        )
      })
    })

    it('should filter by date when user selects a date', async () => {
      const handleFilterChange = vi.fn()
      const { user } = render(TeeTimeFilter, {
        props: { 
          teeTimes: mockTeeTimes,
          onFilterChange: handleFilterChange
        }
      })

      // Find and interact with the date input
      const dateInput = screen.getByLabelText(/date/i)
      await user.type(dateInput, '2024-03-15')

      // Verify the filter was applied
      await waitFor(() => {
        expect(handleFilterChange).toHaveBeenCalledWith(
          expect.objectContaining({
            date: '2024-03-15'
          })
        )
      })
    })

    it('should debounce price range changes', async () => {
      const handleFilterChange = vi.fn()
      const { user } = render(TeeTimeFilter, {
        props: { 
          teeTimes: mockTeeTimes,
          onFilterChange: handleFilterChange
        }
      })

      // Find the minimum price slider
      const minPriceSlider = screen.getByLabelText(/minimum price/i)
      
      // Change the value
      await user.clear(minPriceSlider)
      await user.type(minPriceSlider, '120')

      // Should not emit immediately
      expect(handleFilterChange).not.toHaveBeenCalled()

      // Fast-forward time
      vi.advanceTimersByTime(300)

      // Now it should have been called
      await waitFor(() => {
        expect(handleFilterChange).toHaveBeenCalledWith(
          expect.objectContaining({
            priceRange: expect.objectContaining({
              min: 120
            })
          })
        )
      })
    })

    it('should clear all filters when user clicks Clear All button', async () => {
      const handleFilterChange = vi.fn()
      const { user } = render(TeeTimeFilter, {
        props: { 
          teeTimes: mockTeeTimes,
          onFilterChange: handleFilterChange
        }
      })

      // First, apply some filters
      const courseSelect = screen.getByLabelText(/golf course/i)
      await user.selectOptions(courseSelect, 'Pine Valley Golf Club')

      const dateInput = screen.getByLabelText(/date/i)
      await user.type(dateInput, '2024-03-15')

      // Clear the mock to track only the clear action
      handleFilterChange.mockClear()

      // Click the clear button
      const clearButton = screen.getByRole('button', { name: /clear all/i })
      await user.click(clearButton)

      // Verify all filters were cleared
      await waitFor(() => {
        expect(handleFilterChange).toHaveBeenCalledWith(
          expect.objectContaining({
            course: '',
            date: '',
            priceRange: expect.objectContaining({
              min: 100,
              max: 250
            })
          })
        )
      })

      // Verify the form inputs were reset
      expect(courseSelect).toHaveValue('')
      expect(dateInput).toHaveValue('')
    })

    it('should disable Clear All button when no filters are active', () => {
      render(TeeTimeFilter, {
        props: { teeTimes: mockTeeTimes }
      })

      const clearButton = screen.getByRole('button', { name: /clear all/i })
      expect(clearButton).toBeDisabled()
    })

    it('should enable Clear All button when filters are active', async () => {
      const { user } = render(TeeTimeFilter, {
        props: { teeTimes: mockTeeTimes }
      })

      const clearButton = screen.getByRole('button', { name: /clear all/i })
      
      // Initially disabled
      expect(clearButton).toBeDisabled()

      // Apply a filter
      const courseSelect = screen.getByLabelText(/golf course/i)
      await user.selectOptions(courseSelect, 'Pine Valley Golf Club')

      // Should now be enabled
      await waitFor(() => {
        expect(clearButton).toBeEnabled()
      })
    })
  })

  describe('Visual Feedback', () => {
    it('should display active filter count', async () => {
      const { user } = render(TeeTimeFilter, {
        props: { teeTimes: mockTeeTimes }
      })

      // Initially no filters
      expect(screen.getByText(/0 active filters/i)).toBeInTheDocument()

      // Add a filter
      const courseSelect = screen.getByLabelText(/golf course/i)
      await user.selectOptions(courseSelect, 'Pine Valley Golf Club')

      // Should show 1 active filter
      await waitFor(() => {
        expect(screen.getByText(/1 active filter/i)).toBeInTheDocument()
      })

      // Add another filter
      const dateInput = screen.getByLabelText(/date/i)
      await user.type(dateInput, '2024-03-15')

      // Should show 2 active filters
      await waitFor(() => {
        expect(screen.getByText(/2 active filters/i)).toBeInTheDocument()
      })
    })

    it('should display price range values', () => {
      render(TeeTimeFilter, {
        props: { teeTimes: mockTeeTimes }
      })

      // Check that price range is displayed
      expect(screen.getByText(/price range:/i)).toBeInTheDocument()
      expect(screen.getByText(/\$100/)).toBeInTheDocument()
      expect(screen.getByText(/\$250/)).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty tee times gracefully', () => {
      render(TeeTimeFilter, {
        props: { teeTimes: [] }
      })

      expect(screen.getByText(/no tee times available/i)).toBeInTheDocument()
    })

    it('should handle tee times with missing data', () => {
      const incompleteTeeTimes = [
        { id: 1, course: 'Test Course' }, // Missing price and date
        { id: 2, date: '2024-03-15', price: 100 } // Missing course
      ]

      render(TeeTimeFilter, {
        props: { teeTimes: incompleteTeeTimes as any }
      })

      // Should still render without crashing
      const courseSelect = screen.getByLabelText(/golf course/i)
      expect(courseSelect).toBeInTheDocument()
      
      // Should only show valid courses in dropdown
      const options = within(courseSelect).getAllByRole('option')
      // One for "All Courses" and one for "Test Course"
      expect(options).toHaveLength(2)
    })
  })

  describe('Keyboard Navigation', () => {
    it('should be fully navigable with keyboard', async () => {
      const { user } = render(TeeTimeFilter, {
        props: { teeTimes: mockTeeTimes }
      })

      // Tab through all interactive elements
      await user.tab()
      expect(screen.getByLabelText(/golf course/i)).toHaveFocus()

      await user.tab()
      expect(screen.getByLabelText(/date/i)).toHaveFocus()

      await user.tab()
      expect(screen.getByLabelText(/minimum price/i)).toHaveFocus()

      await user.tab()
      expect(screen.getByLabelText(/maximum price/i)).toHaveFocus()

      await user.tab()
      expect(screen.getByRole('button', { name: /clear all/i })).toHaveFocus()
    })

    it('should allow keyboard interaction with select dropdown', async () => {
      const { user } = render(TeeTimeFilter, {
        props: { teeTimes: mockTeeTimes }
      })

      const courseSelect = screen.getByLabelText(/golf course/i)
      
      // Focus the select
      courseSelect.focus()
      expect(courseSelect).toHaveFocus()

      // Use arrow keys to navigate options (simulation)
      await user.keyboard('{ArrowDown}')
      await user.keyboard('{Enter}')

      // Verify selection was made
      await waitFor(() => {
        expect(courseSelect).not.toHaveValue('')
      })
    })
  })
})
