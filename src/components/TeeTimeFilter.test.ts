/**
 * GitHub Issue #1: Tee Time Filter Component
 * 
 * User Story: As a golfer, I want to filter available tee times 
 * so that I can find the perfect slot for my schedule and budget
 * 
 * This test follows Vue.js official testing recommendations:
 * - Tests component behavior (inputs/outputs) not implementation details
 * - Uses data-test attributes for reliable element selection
 * - Tests user interactions with proper async handling
 * - Follows AAA pattern (Arrange, Act, Assert)
 * 
 * Acceptance Criteria:
 * - Given a list of courses, when component loads, then show all available courses
 * - Given a date selection, when user picks a date, then filter tee times by that date
 * - Given a price range, when user adjusts slider, then show only tee times in that range
 * - Given multiple filters, when applied, then show tee times matching ALL criteria
 * - Given no results, when filters applied, then show "No tee times found" message
 * - Given active filters, when user clicks "Clear All", then reset all filters
 * 
 * Performance: Debounce price slider by 300ms
 * Accessibility: All inputs must have proper ARIA labels
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import TeeTimeFilter from './TeeTimeFilter.vue'

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
  },
  {
    id: 4,
    course: 'Pine Valley Golf Club',
    date: '2024-03-16',
    time: '2:00 PM',
    price: 175,
    available: false
  }
]

describe('TeeTimeFilter Component', () => {
  let wrapper: VueWrapper
  
  beforeEach(() => {
    vi.useFakeTimers()
  })
  
  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllTimers()
  })

  describe('Component Initialization', () => {
    it('should render the filter component with all sections', () => {
      wrapper = mount(TeeTimeFilter, {
        props: {
          teeTimes: mockTeeTimes
        }
      })

      expect(wrapper.find('[data-testid="filter-container"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="course-filter"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="date-filter"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="price-filter"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="btn-clear-filters"]').exists()).toBe(true)
    })

    it('should display all unique courses in the course dropdown', () => {
      wrapper = mount(TeeTimeFilter, {
        props: {
          teeTimes: mockTeeTimes
        }
      })

      const courseOptions = wrapper.findAll('[data-testid^="course-option-"]')
      expect(courseOptions).toHaveLength(3) // 3 unique courses
      expect(courseOptions[0].text()).toContain('Pine Valley Golf Club')
      expect(courseOptions[1].text()).toContain('Ocean Course')
      expect(courseOptions[2].text()).toContain('Mountain View Golf')
    })

    it('should initialize with no filters applied', () => {
      wrapper = mount(TeeTimeFilter, {
        props: {
          teeTimes: mockTeeTimes
        }
      })

      const courseSelect = wrapper.find('[data-testid="course-filter"]').element as HTMLSelectElement
      const dateInput = wrapper.find('[data-testid="date-filter"]').element as HTMLInputElement
      
      expect(courseSelect.value).toBe('')
      expect(dateInput.value).toBe('')
    })
  })

  describe('Course Filtering', () => {
    it('should filter tee times by selected course', async () => {
      wrapper = mount(TeeTimeFilter, {
        props: {
          teeTimes: mockTeeTimes
        }
      })

      const courseSelect = wrapper.find('[data-testid="course-filter"]')
      await courseSelect.setValue('Pine Valley Golf Club')

      expect(wrapper.emitted('filter-change')).toBeTruthy()
      const emittedFilters = wrapper.emitted('filter-change')?.[0][0] as any
      expect(emittedFilters.course).toBe('Pine Valley Golf Club')
    })

    it('should show all tee times when "All Courses" is selected', async () => {
      wrapper = mount(TeeTimeFilter, {
        props: {
          teeTimes: mockTeeTimes
        }
      })

      const courseSelect = wrapper.find('[data-testid="course-filter"]')
      await courseSelect.setValue('Pine Valley Golf Club')
      await courseSelect.setValue('')

      expect(wrapper.emitted('filter-change')).toHaveLength(2)
      const emittedFilters = wrapper.emitted('filter-change')?.[1][0] as any
      expect(emittedFilters.course).toBe('')
    })
  })

  describe('Date Filtering', () => {
    it('should filter tee times by selected date', async () => {
      wrapper = mount(TeeTimeFilter, {
        props: {
          teeTimes: mockTeeTimes
        }
      })

      const dateInput = wrapper.find('[data-testid="date-filter"]')
      await dateInput.setValue('2024-03-15')

      expect(wrapper.emitted('filter-change')).toBeTruthy()
      const emittedFilters = wrapper.emitted('filter-change')?.[0][0] as any
      expect(emittedFilters.date).toBe('2024-03-15')
    })

    it('should clear date filter when date is removed', async () => {
      wrapper = mount(TeeTimeFilter, {
        props: {
          teeTimes: mockTeeTimes
        }
      })

      const dateInput = wrapper.find('[data-testid="date-filter"]')
      await dateInput.setValue('2024-03-15')
      await dateInput.setValue('')

      const emittedFilters = wrapper.emitted('filter-change')?.[1][0] as any
      expect(emittedFilters.date).toBe('')
    })
  })

  describe('Price Range Filtering', () => {
    it('should display price range slider with min and max values', () => {
      wrapper = mount(TeeTimeFilter, {
        props: {
          teeTimes: mockTeeTimes
        }
      })

      const minPriceInput = wrapper.find('[data-testid="price-min"]')
      const maxPriceInput = wrapper.find('[data-testid="price-max"]')
      
      expect(minPriceInput.exists()).toBe(true)
      expect(maxPriceInput.exists()).toBe(true)
      
      // Check that min/max are set based on tee time prices
      expect(minPriceInput.attributes('min')).toBe('100')
      expect(maxPriceInput.attributes('max')).toBe('250')
    })

    it('should debounce price range changes by 300ms', async () => {
      wrapper = mount(TeeTimeFilter, {
        props: {
          teeTimes: mockTeeTimes
        }
      })

      const minPriceInput = wrapper.find('[data-testid="price-min"]')
      await minPriceInput.setValue('120')

      // Should not emit immediately
      expect(wrapper.emitted('filter-change')).toBeFalsy()

      // Fast-forward 299ms - still shouldn't emit
      vi.advanceTimersByTime(299)
      expect(wrapper.emitted('filter-change')).toBeFalsy()

      // Fast-forward 1ms more (total 300ms) - should emit now
      vi.advanceTimersByTime(1)
      expect(wrapper.emitted('filter-change')).toBeTruthy()
      
      const emittedFilters = wrapper.emitted('filter-change')?.[0][0] as any
      expect(emittedFilters.priceRange.min).toBe(120)
    })

    it('should filter by both min and max price', async () => {
      wrapper = mount(TeeTimeFilter, {
        props: {
          teeTimes: mockTeeTimes
        }
      })

      const minPriceInput = wrapper.find('[data-testid="price-min"]')
      const maxPriceInput = wrapper.find('[data-testid="price-max"]')
      
      await minPriceInput.setValue('120')
      await maxPriceInput.setValue('200')
      
      vi.advanceTimersByTime(300)

      const emittedFilters = wrapper.emitted('filter-change')?.[0][0] as any
      expect(emittedFilters.priceRange.min).toBe(120)
      expect(emittedFilters.priceRange.max).toBe(200)
    })
  })

  describe('Multiple Filters', () => {
    it('should apply multiple filters simultaneously', async () => {
      wrapper = mount(TeeTimeFilter, {
        props: {
          teeTimes: mockTeeTimes
        }
      })

      // Apply course filter
      const courseSelect = wrapper.find('[data-testid="course-filter"]')
      await courseSelect.setValue('Pine Valley Golf Club')

      // Apply date filter
      const dateInput = wrapper.find('[data-testid="date-filter"]')
      await dateInput.setValue('2024-03-15')

      // Apply price filter
      const maxPriceInput = wrapper.find('[data-testid="price-max"]')
      await maxPriceInput.setValue('160')
      
      vi.advanceTimersByTime(300)

      // Check last emitted event has all filters
      const emissions = wrapper.emitted('filter-change')
      const lastEmission = emissions?.[emissions.length - 1][0] as any
      
      expect(lastEmission.course).toBe('Pine Valley Golf Club')
      expect(lastEmission.date).toBe('2024-03-15')
      expect(lastEmission.priceRange.max).toBe(160)
    })
  })

  describe('Clear Filters', () => {
    it('should clear all filters when "Clear All" button is clicked', async () => {
      wrapper = mount(TeeTimeFilter, {
        props: {
          teeTimes: mockTeeTimes
        }
      })

      // Apply some filters first
      const courseSelect = wrapper.find('[data-testid="course-filter"]')
      await courseSelect.setValue('Pine Valley Golf Club')
      
      const dateInput = wrapper.find('[data-testid="date-filter"]')
      await dateInput.setValue('2024-03-15')

      // Click clear button
      const clearButton = wrapper.find('[data-testid="btn-clear-filters"]')
      await clearButton.trigger('click')

      expect(wrapper.emitted('filter-change')).toBeTruthy()
      const emittedFilters = wrapper.emitted('filter-change')?.[wrapper.emitted('filter-change')!.length - 1][0] as any
      
      expect(emittedFilters.course).toBe('')
      expect(emittedFilters.date).toBe('')
      expect(emittedFilters.priceRange.min).toBe(100)
      expect(emittedFilters.priceRange.max).toBe(250)
    })

    it('should disable clear button when no filters are active', async () => {
      wrapper = mount(TeeTimeFilter, {
        props: {
          teeTimes: mockTeeTimes
        }
      })

      const clearButton = wrapper.find('[data-testid="btn-clear-filters"]')
      expect(clearButton.attributes('disabled')).toBeDefined()
    })

    it('should enable clear button when filters are active', async () => {
      wrapper = mount(TeeTimeFilter, {
        props: {
          teeTimes: mockTeeTimes
        }
      })

      const courseSelect = wrapper.find('[data-testid="course-filter"]')
      await courseSelect.setValue('Pine Valley Golf Club')

      const clearButton = wrapper.find('[data-testid="btn-clear-filters"]')
      expect(clearButton.attributes('disabled')).toBeUndefined()
    })
  })

  describe('Filter Summary', () => {
    it('should display active filter count', async () => {
      wrapper = mount(TeeTimeFilter, {
        props: {
          teeTimes: mockTeeTimes
        }
      })

      expect(wrapper.find('[data-testid="filter-count"]').text()).toContain('0 active filters')

      // Add one filter
      const courseSelect = wrapper.find('[data-testid="course-filter"]')
      await courseSelect.setValue('Pine Valley Golf Club')
      
      expect(wrapper.find('[data-testid="filter-count"]').text()).toContain('1 active filter')

      // Add another filter
      const dateInput = wrapper.find('[data-testid="date-filter"]')
      await dateInput.setValue('2024-03-15')
      
      expect(wrapper.find('[data-testid="filter-count"]').text()).toContain('2 active filters')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels for all inputs', () => {
      wrapper = mount(TeeTimeFilter, {
        props: {
          teeTimes: mockTeeTimes
        }
      })

      expect(wrapper.find('[data-testid="course-filter"]').attributes('aria-label')).toBe('Filter by golf course')
      expect(wrapper.find('[data-testid="date-filter"]').attributes('aria-label')).toBe('Filter by date')
      expect(wrapper.find('[data-testid="price-min"]').attributes('aria-label')).toBe('Minimum price filter')
      expect(wrapper.find('[data-testid="price-max"]').attributes('aria-label')).toBe('Maximum price filter')
    })

    it('should have proper aria-describedby for complex inputs', () => {
      wrapper = mount(TeeTimeFilter, {
        props: {
          teeTimes: mockTeeTimes
        }
      })

      const priceMin = wrapper.find('[data-testid="price-min"]')
      expect(priceMin.attributes('aria-describedby')).toBe('price-range-help')
      
      const helpText = wrapper.find('#price-range-help')
      expect(helpText.exists()).toBe(true)
      expect(helpText.text()).toContain('Adjust the slider to filter by price range')
    })

    it('should announce filter changes to screen readers', async () => {
      wrapper = mount(TeeTimeFilter, {
        props: {
          teeTimes: mockTeeTimes
        }
      })

      const courseSelect = wrapper.find('[data-testid="course-filter"]')
      await courseSelect.setValue('Pine Valley Golf Club')

      const liveRegion = wrapper.find('[aria-live="polite"]')
      expect(liveRegion.exists()).toBe(true)
      expect(liveRegion.text()).toContain('Filter applied: Pine Valley Golf Club')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty tee times array', () => {
      wrapper = mount(TeeTimeFilter, {
        props: {
          teeTimes: []
        }
      })

      expect(wrapper.find('[data-testid="filter-container"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="no-data-message"]').text()).toContain('No tee times available')
    })

    it('should handle tee times with missing fields gracefully', () => {
      const incompleteTeeTimes = [
        { id: 1, course: 'Test Course' }, // Missing price and date
        { id: 2, date: '2024-03-15', price: 100 } // Missing course
      ]

      wrapper = mount(TeeTimeFilter, {
        props: {
          teeTimes: incompleteTeeTimes as any
        }
      })

      expect(wrapper.find('[data-testid="filter-container"]').exists()).toBe(true)
      // Should only show valid courses
      const courseOptions = wrapper.findAll('[data-testid^="course-option-"]')
      expect(courseOptions).toHaveLength(1)
    })

    it('should handle rapid filter changes without breaking', async () => {
      wrapper = mount(TeeTimeFilter, {
        props: {
          teeTimes: mockTeeTimes
        }
      })

      const courseSelect = wrapper.find('[data-testid="course-filter"]')
      
      // Rapid changes
      await courseSelect.setValue('Pine Valley Golf Club')
      await courseSelect.setValue('Ocean Course')
      await courseSelect.setValue('Mountain View Golf')
      await courseSelect.setValue('')
      
      // Should emit for each change
      expect(wrapper.emitted('filter-change')).toHaveLength(4)
    })
  })

  describe('Performance', () => {
    it('should only re-calculate unique courses when tee times prop changes', async () => {
      const calculateUniqueCourseSpy = vi.fn()
      
      wrapper = mount(TeeTimeFilter, {
        props: {
          teeTimes: mockTeeTimes
        }
      })

      // Simulate prop change
      await wrapper.setProps({
        teeTimes: [...mockTeeTimes, {
          id: 5,
          course: 'New Course',
          date: '2024-03-17',
          time: '9:00 AM',
          price: 200,
          available: true
        }]
      })

      // Should recalculate courses
      const courseOptions = wrapper.findAll('[data-testid^="course-option-"]')
      expect(courseOptions).toHaveLength(4) // Now 4 unique courses
    })
  })
})
