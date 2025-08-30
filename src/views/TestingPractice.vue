<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
    <div class="container mx-auto px-4">
      <header class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Testing with Vitest</h1>
        <p class="text-gray-600">Master unit testing and component testing for Vue applications</p>
      </header>

      <div class="max-w-6xl mx-auto">
        <!-- Category Tabs -->
        <div class="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            v-for="category in categories"
            :key="category"
            @click="activeCategory = category"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              activeCategory === category
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            ]"
          >
            {{ category }}
          </button>
        </div>

        <!-- Testing Scenarios Grid -->
        <div class="grid lg:grid-cols-2 gap-6">
          <div
            v-for="scenario in filteredScenarios"
            :key="scenario.id"
            class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-semibold text-gray-800">{{ scenario.title }}</h3>
                <span :class="difficultyColors[scenario.difficulty]" class="px-2 py-1 text-xs rounded-full">
                  {{ scenario.difficulty }}
                </span>
              </div>
              
              <p class="text-gray-600 mb-4">{{ scenario.description }}</p>
              
              <!-- Code Example -->
              <div class="mb-4">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-medium text-gray-800">{{ scenario.codeTitle }}</h4>
                  <button
                    @click="toggleCode(scenario.id)"
                    class="text-purple-600 hover:text-purple-700 text-sm"
                  >
                    {{ expandedCode.includes(scenario.id) ? 'Hide' : 'Show' }} Code
                  </button>
                </div>
                
                <div v-show="expandedCode.includes(scenario.id)" class="space-y-4">
                  <!-- Component/Function Code -->
                  <div>
                    <h5 class="text-sm font-medium text-gray-700 mb-1">{{ scenario.sourceLabel }}</h5>
                    <div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre v-html="scenario.sourceCode"></pre>
                    </div>
                  </div>
                  
                  <!-- Test Code -->
                  <div>
                    <h5 class="text-sm font-medium text-gray-700 mb-1">Test Code</h5>
                    <div class="bg-gray-900 text-blue-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre v-html="scenario.testCode"></pre>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Key Concepts -->
              <div class="mb-4">
                <h4 class="font-medium text-gray-800 mb-2">Key Concepts:</h4>
                <ul class="space-y-1">
                  <li 
                    v-for="concept in scenario.concepts"
                    :key="concept"
                    class="text-sm text-gray-600 flex items-start"
                  >
                    <span class="text-purple-500 mr-2 mt-1">•</span>
                    {{ concept }}
                  </li>
                </ul>
              </div>

              <!-- Test Runner Simulation -->
              <div class="mb-4 p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700">Test Results:</span>
                  <button
                    @click="runTest(scenario.id)"
                    class="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors"
                  >
                    Run Test
                  </button>
                </div>
                <div v-if="testResults[scenario.id]" class="font-mono text-xs">
                  <div :class="testResults[scenario.id].success ? 'text-green-600' : 'text-red-600'">
                    {{ testResults[scenario.id].output }}
                  </div>
                </div>
              </div>

              <!-- Tags -->
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in scenario.tags"
                  :key="tag"
                  class="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Testing Best Practices -->
        <div class="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Testing Best Practices for GolfNow</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold text-purple-700 mb-2">Unit Testing</h3>
              <ul class="space-y-1 text-gray-600 text-sm">
                <li class="flex items-start">
                  <span class="text-purple-500 mr-2">✓</span>
                  Test business logic functions in isolation
                </li>
                <li class="flex items-start">
                  <span class="text-purple-500 mr-2">✓</span>
                  Mock external dependencies and API calls
                </li>
                <li class="flex items-start">
                  <span class="text-purple-500 mr-2">✓</span>
                  Focus on edge cases and error handling
                </li>
                <li class="flex items-start">
                  <span class="text-purple-500 mr-2">✓</span>
                  Keep tests simple and focused
                </li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-purple-700 mb-2">Component Testing</h3>
              <ul class="space-y-1 text-gray-600 text-sm">
                <li class="flex items-start">
                  <span class="text-purple-500 mr-2">✓</span>
                  Test user interactions and events
                </li>
                <li class="flex items-start">
                  <span class="text-purple-500 mr-2">✓</span>
                  Verify prop handling and emitted events
                </li>
                <li class="flex items-start">
                  <span class="text-purple-500 mr-2">✓</span>
                  Test conditional rendering scenarios
                </li>
                <li class="flex items-start">
                  <span class="text-purple-500 mr-2">✓</span>
                  Simulate real user behavior patterns
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface TestScenario {
  id: string
  title: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  description: string
  codeTitle: string
  sourceLabel: string
  sourceCode: string
  testCode: string
  concepts: string[]
  tags: string[]
  expectedResult: {
    success: boolean
    output: string
  }
}

const activeCategory = ref('All')
const expandedCode = ref<string[]>([])
const testResults = ref<Record<string, { success: boolean; output: string }>>({})

const categories = ['All', 'Unit Testing', 'Component Testing', 'Mocking', 'TDD', 'Integration']

const difficultyColors = {
  'Beginner': 'bg-green-100 text-green-800',
  'Intermediate': 'bg-yellow-100 text-yellow-800',
  'Advanced': 'bg-red-100 text-red-800'
}

const scenarios: TestScenario[] = [
  {
    id: '1',
    title: 'Testing Pure Functions',
    category: 'Unit Testing',
    difficulty: 'Beginner',
    description: 'Test utility functions that calculate tee time pricing based on time and course.',
    codeTitle: 'Price Calculator Function',
    sourceLabel: 'utils/priceCalculator.js',
    sourceCode: `export function calculateTeeTimePrice(basePrice, timeSlot, isPremium) {
  if (basePrice <= 0) throw new Error('Invalid base price')
  
  let multiplier = 1
  if (timeSlot >= 6 && timeSlot <= 8) multiplier = 1.5  // Peak morning
  if (timeSlot >= 16 && timeSlot <= 18) multiplier = 1.3 // Peak evening
  if (isPremium) multiplier *= 1.2
  
  return Math.round(basePrice * multiplier * 100) / 100
}`,
    testCode: `import { describe, it, expect } from 'vitest'
import { calculateTeeTimePrice } from '../utils/priceCalculator'

describe('calculateTeeTimePrice', () => {
  it('calculates base price correctly', () => {
    expect(calculateTeeTimePrice(50, 10, false)).toBe(50)
  })
  
  it('applies peak morning multiplier', () => {
    expect(calculateTeeTimePrice(50, 7, false)).toBe(75)
  })
  
  it('applies premium course multiplier', () => {
    expect(calculateTeeTimePrice(50, 10, true)).toBe(60)
  })
  
  it('throws error for invalid base price', () => {
    expect(() => calculateTeeTimePrice(-10, 10, false))
      .toThrow('Invalid base price')
  })
})`,
    concepts: [
      'Testing pure functions with predictable inputs/outputs',
      'Testing edge cases and error conditions',
      'Using describe blocks to group related tests',
      'Descriptive test names that explain the behavior'
    ],
    tags: ['Pure Functions', 'Edge Cases', 'Error Handling'],
    expectedResult: {
      success: true,
      output: '✓ calculateTeeTimePrice (4) 234ms\n  ✓ calculates base price correctly\n  ✓ applies peak morning multiplier\n  ✓ applies premium course multiplier\n  ✓ throws error for invalid base price'
    }
  },
  {
    id: '2',
    title: 'Testing Vue Components',
    category: 'Component Testing',
    difficulty: 'Intermediate',
    description: 'Test a TeeTimeCard component that displays booking information and handles user interactions.',
    codeTitle: 'TeeTime Card Component',
    sourceLabel: 'components/TeeTimeCard.vue',
    sourceCode: `// TeeTimeCard.vue Component
export default {
  name: 'TeeTimeCard',
  props: ['course', 'time', 'price', 'isAvailable'],
  emits: ['book'],
  methods: {
    handleBook() {
      if (this.isAvailable) {
        this.$emit('book', { course: this.course, time: this.time })
      }
    },
    formatTime(time) {
      return new Date(time).toLocaleTimeString()
    }
  }
}`,
    testCode: `import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TeeTimeCard from '../components/TeeTimeCard.vue'

describe('TeeTimeCard', () => {
  const mockProps = {
    course: { name: 'Pebble Beach' },
    time: new Date('2024-08-30T08:00:00'),
    price: 150,
    isAvailable: true
  }

  it('renders course information correctly', () => {
    const wrapper = mount(TeeTimeCard, { props: mockProps })
    
    expect(wrapper.text()).toContain('Pebble Beach')
    expect(wrapper.text()).toContain('$150')
  })

  it('emits book event when available slot is clicked', async () => {
    const wrapper = mount(TeeTimeCard, { props: mockProps })
    
    await wrapper.find('[data-testid="book-button"]').trigger('click')
    
    expect(wrapper.emitted('book')).toBeTruthy()
    expect(wrapper.emitted('book')[0]).toEqual([{
      course: mockProps.course,
      time: mockProps.time
    }])
  })

  it('disables button when not available', () => {
    const wrapper = mount(TeeTimeCard, { 
      props: { ...mockProps, isAvailable: false }
    })
    
    const button = wrapper.find('[data-testid="book-button"]')
    expect(button.attributes('disabled')).toBeDefined()
    expect(button.text()).toBe('Unavailable')
  })
})`,
    concepts: [
      'Mounting Vue components with Vue Test Utils',
      'Testing component props and rendering',
      'Testing user interactions with trigger()',
      'Verifying emitted events and payloads',
      'Using data-testid for reliable element selection'
    ],
    tags: ['Vue Components', 'Props', 'Events', 'User Interaction'],
    expectedResult: {
      success: true,
      output: '✓ TeeTimeCard (3) 145ms\n  ✓ renders course information correctly\n  ✓ emits book event when available slot is clicked\n  ✓ disables button when not available'
    }
  },
  {
    id: '3',
    title: 'Mocking API Calls',
    category: 'Mocking',
    difficulty: 'Intermediate',
    description: 'Test a composable that fetches tee time availability from an API.',
    codeTitle: 'Tee Time Availability Composable',
    sourceLabel: 'composables/useTeeTimeAvailability.js',
    sourceCode: `import { ref } from 'vue'
import api from '../services/api'

export function useTeeTimeAvailability() {
  const availability = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchAvailability = async (courseId, date) => {
    try {
      loading.value = true
      error.value = null
      const response = await api.get(\`/courses/\${courseId}/availability\`, {
        params: { date }
      })
      availability.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { availability, loading, error, fetchAvailability }
}`,
    testCode: `import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTeeTimeAvailability } from '../composables/useTeeTimeAvailability'

// Mock the API service
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn()
  }
}))

describe('useTeeTimeAvailability', () => {
  let api
  
  beforeEach(() => {
    api = await import('../services/api')
    vi.clearAllMocks()
  })

  it('fetches availability successfully', async () => {
    const mockData = [
      { time: '08:00', available: true },
      { time: '09:00', available: false }
    ]
    
    api.default.get.mockResolvedValue({ data: mockData })
    
    const { availability, loading, fetchAvailability } = useTeeTimeAvailability()
    
    await fetchAvailability('course-123', '2024-08-30')
    
    expect(api.default.get).toHaveBeenCalledWith(
      '/courses/course-123/availability',
      { params: { date: '2024-08-30' } }
    )
    expect(availability.value).toEqual(mockData)
    expect(loading.value).toBe(false)
  })

  it('handles API errors gracefully', async () => {
    api.default.get.mockRejectedValue(new Error('Network error'))
    
    const { error, loading, fetchAvailability } = useTeeTimeAvailability()
    
    await fetchAvailability('course-123', '2024-08-30')
    
    expect(error.value).toBe('Network error')
    expect(loading.value).toBe(false)
  })
})`,
    concepts: [
      'Mocking modules and dependencies with vi.mock()',
      'Testing async operations and promises',
      'Verifying function calls with specific parameters',
      'Testing error handling scenarios',
      'Managing test lifecycle with beforeEach'
    ],
    tags: ['Mocking', 'API Calls', 'Async', 'Error Handling'],
    expectedResult: {
      success: true,
      output: '✓ useTeeTimeAvailability (2) 89ms\n  ✓ fetches availability successfully\n  ✓ handles API errors gracefully'
    }
  },
  {
    id: '4',
    title: 'Testing with User Events',
    category: 'Component Testing',
    difficulty: 'Advanced',
    description: 'Test complex user interactions like form submission with validation.',
    codeTitle: 'Booking Form Component',
    sourceLabel: 'components/BookingForm.vue',
    sourceCode: `// BookingForm.vue Component
export default {
  name: 'BookingForm',
  data() {
    return {
      playerName: '',
      email: '',
      players: '1',
      errors: []
    }
  },
  computed: {
    isValid() {
      return this.playerName && this.email && this.players
    }
  },
  methods: {
    handleSubmit() {
      this.errors = []
      if (!this.playerName) this.errors.push('Name is required')
      if (!this.email) this.errors.push('Email is required')
      if (this.isValid && !this.errors.length) {
        this.$emit('book', {
          playerName: this.playerName,
          email: this.email,
          players: this.players
        })
      }
    }
  }
}`,
    testCode: `import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BookingForm from '../components/BookingForm.vue'

describe('BookingForm', () => {
  it('validates form before submission', async () => {
    const wrapper = mount(BookingForm)
    
    // Try to submit empty form
    await wrapper.find('form').trigger('submit')
    
    expect(wrapper.find('.errors').exists()).toBe(true)
    expect(wrapper.text()).toContain('Name is required')
  })

  it('submits valid form data', async () => {
    const wrapper = mount(BookingForm)
    
    // Fill out form
    await wrapper.find('[data-testid="player-name"]')
      .setValue('John Doe')
    await wrapper.find('[data-testid="email"]')
      .setValue('john@example.com')
    await wrapper.find('[data-testid="player-count"]')
      .setValue('2')
    
    // Submit form
    await wrapper.find('form').trigger('submit')
    
    expect(wrapper.emitted('book')).toBeTruthy()
    expect(wrapper.emitted('book')[0]).toEqual([{
      playerName: 'John Doe',
      email: 'john@example.com',
      players: '2'
    }])
  })

  it('updates player count selection', async () => {
    const wrapper = mount(BookingForm)
    
    const select = wrapper.find('[data-testid="player-count"]')
    await select.setValue('4')
    
    expect(wrapper.vm.players).toBe('4')
  })
})`,
    concepts: [
      'Testing form interactions with setValue()',
      'Testing form validation and error states',
      'Testing complex user workflows',
      'Verifying component state changes',
      'Testing conditional rendering based on validation'
    ],
    tags: ['Forms', 'Validation', 'User Events', 'Component State'],
    expectedResult: {
      success: true,
      output: '✓ BookingForm (3) 167ms\n  ✓ validates form before submission\n  ✓ submits valid form data\n  ✓ updates player count selection'
    }
  },
  {
    id: '5',
    title: 'Test-Driven Development',
    category: 'TDD',
    difficulty: 'Advanced',
    description: 'Write tests first, then implement a date utility function following TDD principles.',
    codeTitle: 'TDD: Available Time Slots Function',
    sourceLabel: 'utils/timeSlots.js (to be implemented)',
    sourceCode: `// Implementation comes after writing tests!

export function getAvailableTimeSlots(startTime, endTime, duration, bookedSlots = []) {
  const slots = []
  const start = new Date(\`2000-01-01T\${startTime}:00\`)
  const end = new Date(\`2000-01-01T\${endTime}:00\`)
  
  let current = new Date(start)
  
  while (current < end) {
    const timeString = current.toTimeString().slice(0, 5)
    
    if (!bookedSlots.includes(timeString)) {
      slots.push(timeString)
    }
    
    current.setMinutes(current.getMinutes() + duration)
  }
  
  return slots
}`,
    testCode: `import { describe, it, expect } from 'vitest'
import { getAvailableTimeSlots } from '../utils/timeSlots'

describe('getAvailableTimeSlots (TDD)', () => {
  it('should generate hourly slots between start and end time', () => {
    const result = getAvailableTimeSlots('08:00', '12:00', 60)
    
    expect(result).toEqual(['08:00', '09:00', '10:00', '11:00'])
  })

  it('should generate 30-minute slots', () => {
    const result = getAvailableTimeSlots('14:00', '16:00', 30)
    
    expect(result).toEqual(['14:00', '14:30', '15:00', '15:30'])
  })

  it('should exclude booked time slots', () => {
    const bookedSlots = ['09:00', '10:30']
    const result = getAvailableTimeSlots('08:00', '12:00', 60, bookedSlots)
    
    expect(result).toEqual(['08:00', '10:00', '11:00'])
    expect(result).not.toContain('09:00')
  })

  it('should return empty array when all slots are booked', () => {
    const bookedSlots = ['08:00', '09:00', '10:00', '11:00']
    const result = getAvailableTimeSlots('08:00', '12:00', 60, bookedSlots)
    
    expect(result).toEqual([])
  })

  it('should handle edge case of same start and end time', () => {
    const result = getAvailableTimeSlots('10:00', '10:00', 60)
    
    expect(result).toEqual([])
  })
})`,
    concepts: [
      'Writing tests before implementation (Red-Green-Refactor)',
      'Testing all edge cases and business rules',
      'Incremental development with immediate feedback',
      'Building confidence through comprehensive test coverage',
      'Refactoring with safety net of passing tests'
    ],
    tags: ['TDD', 'Red-Green-Refactor', 'Edge Cases', 'Business Logic'],
    expectedResult: {
      success: true,
      output: '✓ getAvailableTimeSlots (TDD) (5) 123ms\n  ✓ should generate hourly slots between start and end time\n  ✓ should generate 30-minute slots\n  ✓ should exclude booked time slots\n  ✓ should return empty array when all slots are booked\n  ✓ should handle edge case of same start and end time'
    }
  }
]

const filteredScenarios = computed(() => {
  if (activeCategory.value === 'All') {
    return scenarios
  }
  return scenarios.filter(scenario => scenario.category === activeCategory.value)
})

const toggleCode = (scenarioId: string) => {
  const index = expandedCode.value.indexOf(scenarioId)
  if (index > -1) {
    expandedCode.value.splice(index, 1)
  } else {
    expandedCode.value.push(scenarioId)
  }
}

const runTest = (scenarioId: string) => {
  const scenario = scenarios.find(s => s.id === scenarioId)
  if (scenario) {
    // Simulate test execution
    testResults.value[scenarioId] = scenario.expectedResult
  }
}
</script>