<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-8">
    <div class="container mx-auto px-4">
      <header class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Data Fetching & APIs</h1>
        <p class="text-gray-600">Master API integration patterns for modern web applications</p>
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
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            ]"
          >
            {{ category }}
          </button>
        </div>

        <!-- API Scenarios Grid -->
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
                  <h4 class="font-medium text-gray-800">Implementation</h4>
                  <button
                    @click="toggleCode(scenario.id)"
                    class="text-green-600 hover:text-green-700 text-sm"
                  >
                    {{ expandedCode.includes(scenario.id) ? 'Hide' : 'Show' }} Code
                  </button>
                </div>
                
                <div v-show="expandedCode.includes(scenario.id)" class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre v-html="scenario.code"></pre>
                </div>
              </div>

              <!-- API Demo -->
              <div class="mb-4 p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700">Try API Call:</span>
                  <button
                    @click="runApiCall(scenario.id)"
                    :disabled="loadingStates[scenario.id]"
                    class="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {{ loadingStates[scenario.id] ? 'Loading...' : 'Execute' }}
                  </button>
                </div>
                <div v-if="apiResults[scenario.id]" class="font-mono text-xs">
                  <div :class="apiResults[scenario.id].success ? 'text-green-600' : 'text-red-600'">
                    {{ apiResults[scenario.id].output }}
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
                    <span class="text-green-500 mr-2 mt-1">•</span>
                    {{ concept }}
                  </li>
                </ul>
              </div>

              <!-- Tags -->
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in scenario.tags"
                  :key="tag"
                  class="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Best Practices Section -->
        <div class="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">API Integration Best Practices for GolfNow</h2>
          <div class="grid md:grid-cols-3 gap-6">
            <div>
              <h3 class="font-semibold text-green-700 mb-2">Performance</h3>
              <ul class="space-y-1 text-gray-600 text-sm">
                <li class="flex items-start">
                  <span class="text-green-500 mr-2">✓</span>
                  Implement request caching for static data
                </li>
                <li class="flex items-start">
                  <span class="text-green-500 mr-2">✓</span>
                  Use debouncing for search inputs
                </li>
                <li class="flex items-start">
                  <span class="text-green-500 mr-2">✓</span>
                  Paginate large datasets
                </li>
                <li class="flex items-start">
                  <span class="text-green-500 mr-2">✓</span>
                  Optimize bundle size with code splitting
                </li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-green-700 mb-2">Error Handling</h3>
              <ul class="space-y-1 text-gray-600 text-sm">
                <li class="flex items-start">
                  <span class="text-green-500 mr-2">✓</span>
                  Graceful degradation for failures
                </li>
                <li class="flex items-start">
                  <span class="text-green-500 mr-2">✓</span>
                  Retry mechanisms with exponential backoff
                </li>
                <li class="flex items-start">
                  <span class="text-green-500 mr-2">✓</span>
                  Meaningful error messages to users
                </li>
                <li class="flex items-start">
                  <span class="text-green-500 mr-2">✓</span>
                  Network timeout handling
                </li>
              </ul>
            </div>
            <div>
              <h3 class="font-semibold text-green-700 mb-2">User Experience</h3>
              <ul class="space-y-1 text-gray-600 text-sm">
                <li class="flex items-start">
                  <span class="text-green-500 mr-2">✓</span>
                  Loading states and progress indicators
                </li>
                <li class="flex items-start">
                  <span class="text-green-500 mr-2">✓</span>
                  Optimistic updates for instant feedback
                </li>
                <li class="flex items-start">
                  <span class="text-green-500 mr-2">✓</span>
                  Background data refresh
                </li>
                <li class="flex items-start">
                  <span class="text-green-500 mr-2">✓</span>
                  Offline support where possible
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Live API Playground -->
        <div class="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">API Playground</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-medium text-gray-800 mb-2">Custom Request:</h3>
              <div class="space-y-3">
                <select v-model="playgroundMethod" class="w-full p-2 border rounded">
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
                <input
                  v-model="playgroundUrl"
                  placeholder="https://jsonplaceholder.typicode.com/posts/1"
                  class="w-full p-2 border rounded"
                />
                <textarea
                  v-if="playgroundMethod !== 'GET'"
                  v-model="playgroundBody"
                  placeholder="Request body (JSON)"
                  class="w-full p-2 border rounded h-20 resize-none"
                ></textarea>
                <button
                  @click="runPlaygroundRequest"
                  :disabled="playgroundLoading"
                  class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {{ playgroundLoading ? 'Loading...' : 'Send Request' }}
                </button>
              </div>
            </div>
            <div>
              <h3 class="font-medium text-gray-800 mb-2">Response:</h3>
              <div class="bg-gray-900 text-green-400 p-4 rounded-lg h-64 overflow-y-auto font-mono text-sm">
                <pre>{{ playgroundResult || 'No response yet...' }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface ApiScenario {
  id: string
  title: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  description: string
  code: string
  concepts: string[]
  tags: string[]
  mockResponse: {
    success: boolean
    data: any
  }
}

const activeCategory = ref('All')
const expandedCode = ref<string[]>([])
const apiResults = ref<Record<string, { success: boolean; output: string }>>({})
const loadingStates = ref<Record<string, boolean>>({})

// Playground state
const playgroundMethod = ref('GET')
const playgroundUrl = ref('https://jsonplaceholder.typicode.com/posts/1')
const playgroundBody = ref('')
const playgroundResult = ref('')
const playgroundLoading = ref(false)

const categories = ['All', 'Basic Fetching', 'Error Handling', 'Caching', 'Real-time', 'Authentication']

const difficultyColors = {
  'Beginner': 'bg-green-100 text-green-800',
  'Intermediate': 'bg-yellow-100 text-yellow-800',
  'Advanced': 'bg-red-100 text-red-800'
}

const scenarios: ApiScenario[] = [
  {
    id: '1',
    title: 'Basic Fetch with Error Handling',
    category: 'Basic Fetching',
    difficulty: 'Beginner',
    description: 'Implement basic API calls with proper error handling for golf course listings.',
    code: `async function fetchGolfCourses() {
  try {
    const response = await fetch('/api/golf-courses')
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`)
    }
    
    const courses = await response.json()
    return courses
  } catch (error) {
    console.error('Failed to fetch golf courses:', error)
    throw error
  }
}`,
    concepts: [
      'Using fetch API with async/await',
      'Checking response.ok for HTTP errors',
      'Proper error throwing and handling',
      'JSON parsing with error protection'
    ],
    tags: ['Fetch API', 'Async/Await', 'Error Handling'],
    mockResponse: {
      success: true,
      data: [
        { id: 1, name: 'Pebble Beach', location: 'California', rating: 4.8 },
        { id: 2, name: 'Augusta National', location: 'Georgia', rating: 4.9 }
      ]
    }
  },
  {
    id: '2',
    title: 'Request Debouncing for Search',
    category: 'Basic Fetching',
    difficulty: 'Intermediate',
    description: 'Implement debounced search to prevent excessive API calls while typing.',
    code: `function useDebounceSearch(searchFn, delay = 300) {
  let timeoutId = null
  
  return function debounced(query) {
    clearTimeout(timeoutId)
    
    timeoutId = setTimeout(async () => {
      try {
        const results = await searchFn(query)
        // Update UI with results
        updateSearchResults(results)
      } catch (error) {
        showErrorMessage('Search failed. Please try again.')
      }
    }, delay)
  }
}

// Usage
const debouncedSearch = useDebounceSearch(
  query => fetch(\`/api/courses/search?q=\${query}\`).then(r => r.json())
)

// Call on input change
searchInput.addEventListener('input', e => {
  debouncedSearch(e.target.value)
})`,
    concepts: [
      'Debouncing to reduce API calls',
      'Higher-order functions for reusability',
      'Timeout management and cleanup',
      'User experience optimization'
    ],
    tags: ['Debouncing', 'Performance', 'Search', 'UX'],
    mockResponse: {
      success: true,
      data: [
        { id: 3, name: 'Torrey Pines', location: 'San Diego', rating: 4.7 }
      ]
    }
  },
  {
    id: '3',
    title: 'Request Caching Strategy',
    category: 'Caching',
    difficulty: 'Intermediate',
    description: 'Implement client-side caching to reduce redundant API calls and improve performance.',
    code: `class ApiCache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutes default TTL
    this.cache = new Map()
    this.ttl = ttl
  }
  
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }
  
  get(key) {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    const isExpired = Date.now() - cached.timestamp > this.ttl
    if (isExpired) {
      this.cache.delete(key)
      return null
    }
    
    return cached.data
  }
  
  clear() {
    this.cache.clear()
  }
}

const apiCache = new ApiCache()

async function fetchWithCache(url) {
  // Check cache first
  const cached = apiCache.get(url)
  if (cached) {
    console.log('Returning cached data')
    return cached
  }
  
  // Fetch from API
  const response = await fetch(url)
  const data = await response.json()
  
  // Cache the result
  apiCache.set(url, data)
  
  return data
}`,
    concepts: [
      'Time-based cache invalidation (TTL)',
      'Memory-efficient data storage',
      'Cache hit/miss optimization',
      'Reducing server load and latency'
    ],
    tags: ['Caching', 'Performance', 'Memory Management'],
    mockResponse: {
      success: true,
      data: { message: 'Data fetched and cached successfully' }
    }
  },
  {
    id: '4',
    title: 'Retry Logic with Exponential Backoff',
    category: 'Error Handling',
    difficulty: 'Advanced',
    description: 'Implement robust retry mechanisms for handling temporary network failures.',
    code: `async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  const { retryDelay = 1000, backoffMultiplier = 2 } = options
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url)
      
      if (response.ok) {
        return await response.json()
      }
      
      // Don't retry on client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(\`Client error: \${response.status}\`)
      }
      
      throw new Error(\`Server error: \${response.status}\`)
      
    } catch (error) {
      const isLastAttempt = attempt === maxRetries
      
      if (isLastAttempt) {
        throw new Error(\`Failed after \${maxRetries + 1} attempts: \${error.message}\`)
      }
      
      // Calculate delay with exponential backoff
      const delay = retryDelay * Math.pow(backoffMultiplier, attempt)
      
      console.warn(\`Attempt \${attempt + 1} failed, retrying in \${delay}ms...\`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

// Usage
try {
  const teeTimeData = await fetchWithRetry('/api/tee-times/availability')
  updateAvailabilityDisplay(teeTimeData)
} catch (error) {
  showErrorMessage('Unable to load tee times. Please try again later.')
}`,
    concepts: [
      'Exponential backoff for retry intervals',
      'Distinguishing client vs server errors',
      'Configurable retry parameters',
      'Graceful degradation on failure'
    ],
    tags: ['Retry Logic', 'Error Recovery', 'Resilience'],
    mockResponse: {
      success: true,
      data: { message: 'Successfully fetched after retry' }
    }
  },
  {
    id: '5',
    title: 'WebSocket Real-time Updates',
    category: 'Real-time',
    difficulty: 'Advanced',
    description: 'Implement real-time tee time availability updates using WebSockets.',
    code: `class TeeTimeSocket {
  constructor(url) {
    this.url = url
    this.ws = null
    this.listeners = new Map()
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 1000
  }
  
  connect() {
    try {
      this.ws = new WebSocket(this.url)
      
      this.ws.onopen = () => {
        console.log('Connected to tee time updates')
        this.reconnectAttempts = 0
        this.emit('connected')
      }
      
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        this.emit(data.type, data.payload)
      }
      
      this.ws.onclose = () => {
        console.log('Disconnected from tee time updates')
        this.emit('disconnected')
        this.attemptReconnect()
      }
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.emit('error', error)
      }
      
    } catch (error) {
      console.error('Failed to connect:', error)
      this.attemptReconnect()
    }
  }
  
  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts)
      
      setTimeout(() => {
        console.log(\`Reconnecting... (attempt \${this.reconnectAttempts + 1})\`)
        this.reconnectAttempts++
        this.connect()
      }, delay)
    }
  }
  
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
  }
  
  emit(event, data) {
    const callbacks = this.listeners.get(event) || []
    callbacks.forEach(callback => callback(data))
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close()
    }
  }
}

// Usage
const teeTimeSocket = new TeeTimeSocket('wss://api.golfnow.com/ws/tee-times')

teeTimeSocket.on('availability_update', (data) => {
  updateTeeTimeAvailability(data.courseId, data.availableSlots)
})

teeTimeSocket.on('booking_confirmed', (data) => {
  showBookingConfirmation(data.bookingId)
})

teeTimeSocket.connect()`,
    concepts: [
      'WebSocket connection management',
      'Event-driven architecture',
      'Automatic reconnection with backoff',
      'Real-time data synchronization'
    ],
    tags: ['WebSockets', 'Real-time', 'Event Handling'],
    mockResponse: {
      success: true,
      data: { message: 'WebSocket connected, real-time updates active' }
    }
  },
  {
    id: '6',
    title: 'JWT Authentication Flow',
    category: 'Authentication',
    difficulty: 'Advanced',
    description: 'Implement JWT-based authentication with automatic token refresh.',
    code: `class AuthManager {
  constructor() {
    this.accessToken = localStorage.getItem('accessToken')
    this.refreshToken = localStorage.getItem('refreshToken')
    this.tokenRefreshPromise = null
  }
  
  async login(email, password) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    if (!response.ok) {
      throw new Error('Login failed')
    }
    
    const tokens = await response.json()
    this.setTokens(tokens.accessToken, tokens.refreshToken)
    
    return tokens
  }
  
  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  }
  
  async refreshAccessToken() {
    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise
    }
    
    this.tokenRefreshPromise = this._performTokenRefresh()
    
    try {
      await this.tokenRefreshPromise
    } finally {
      this.tokenRefreshPromise = null
    }
  }
  
  async _performTokenRefresh() {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: this.refreshToken })
    })
    
    if (!response.ok) {
      this.logout()
      throw new Error('Token refresh failed')
    }
    
    const tokens = await response.json()
    this.setTokens(tokens.accessToken, tokens.refreshToken)
  }
  
  async makeAuthenticatedRequest(url, options = {}) {
    const requestWithAuth = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: \`Bearer \${this.accessToken}\`
      }
    }
    
    let response = await fetch(url, requestWithAuth)
    
    // If unauthorized, try to refresh token and retry
    if (response.status === 401 && this.refreshToken) {
      await this.refreshAccessToken()
      
      requestWithAuth.headers.Authorization = \`Bearer \${this.accessToken}\`
      response = await fetch(url, requestWithAuth)
    }
    
    return response
  }
  
  logout() {
    this.accessToken = null
    this.refreshToken = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
  
  isAuthenticated() {
    return !!this.accessToken
  }
}

const auth = new AuthManager()

// Usage
try {
  const response = await auth.makeAuthenticatedRequest('/api/user/bookings')
  const bookings = await response.json()
  displayUserBookings(bookings)
} catch (error) {
  console.error('Failed to fetch bookings:', error)
}`,
    concepts: [
      'JWT token lifecycle management',
      'Automatic token refresh',
      'Request interceptors for auth headers',
      'Secure token storage considerations'
    ],
    tags: ['JWT', 'Authentication', 'Token Management'],
    mockResponse: {
      success: true,
      data: { message: 'Authenticated request successful' }
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

const runApiCall = async (scenarioId: string) => {
  const scenario = scenarios.find(s => s.id === scenarioId)
  if (!scenario) return

  loadingStates.value[scenarioId] = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  apiResults.value[scenarioId] = {
    success: scenario.mockResponse.success,
    output: JSON.stringify(scenario.mockResponse.data, null, 2)
  }
  
  loadingStates.value[scenarioId] = false
}

const runPlaygroundRequest = async () => {
  playgroundLoading.value = true
  playgroundResult.value = ''
  
  try {
    const options: RequestInit = {
      method: playgroundMethod.value,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    
    if (playgroundMethod.value !== 'GET' && playgroundBody.value) {
      options.body = playgroundBody.value
    }
    
    const response = await fetch(playgroundUrl.value, options)
    const data = await response.json()
    
    playgroundResult.value = JSON.stringify({
      status: response.status,
      statusText: response.statusText,
      data
    }, null, 2)
    
  } catch (error) {
    playgroundResult.value = JSON.stringify({
      error: error.message
    }, null, 2)
  } finally {
    playgroundLoading.value = false
  }
}
</script>