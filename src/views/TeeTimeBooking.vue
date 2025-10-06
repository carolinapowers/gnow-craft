<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4 py-3">
        <router-link to="/" class="text-emerald-600 hover:text-emerald-700 flex items-center gap-2">
          <span>←</span> Back to Home
        </router-link>
      </div>
    </nav>

    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Tee Time Booking Simulator</h1>
        <button
          @click="showCode = !showCode"
          class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          {{ showCode ? 'Hide Code' : 'Show Code' }}
        </button>
      </div>

      <!-- Code View -->
      <div v-if="showCode" class="mb-8 bg-gray-900 text-gray-100 rounded-lg overflow-hidden">
        <div class="bg-gray-800 px-6 py-3 border-b border-gray-700">
          <div class="flex space-x-4">
            <button
              v-for="tab in codeTabs"
              :key="tab"
              @click="activeCodeTab = tab"
              :class="[
                'px-4 py-2 rounded-t-lg transition-colors',
                activeCodeTab === tab
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-400 hover:text-white'
              ]"
            >
              {{ tab }}
            </button>
          </div>
        </div>
        <div class="p-6 overflow-x-auto max-h-96 overflow-y-auto">
          <pre v-if="activeCodeTab === 'Filters'"><code>{{ filtersCode }}</code></pre>
          <pre v-else-if="activeCodeTab === 'Computed Logic'"><code>{{ computedCode }}</code></pre>
          <pre v-else-if="activeCodeTab === 'Pagination'"><code>{{ paginationCode }}</code></pre>
          <pre v-else-if="activeCodeTab === 'Full Component'"><code>{{ fullComponentCode }}</code></pre>
        </div>
      </div>

      <div class="grid lg:grid-cols-4 gap-6">
        <!-- Filters Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 class="font-semibold text-lg mb-4">Filters</h2>
            
            <!-- Date Selection -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                v-model="filters.date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <!-- Time Range -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="filters.timeRanges"
                    value="morning"
                    class="mr-2 text-emerald-600 focus:ring-emerald-500"
                  />
                  Morning (6am - 12pm)
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="filters.timeRanges"
                    value="afternoon"
                    class="mr-2 text-emerald-600 focus:ring-emerald-500"
                  />
                  Afternoon (12pm - 6pm)
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="filters.timeRanges"
                    value="evening"
                    class="mr-2 text-emerald-600 focus:ring-emerald-500"
                  />
                  Evening (6pm - 8pm)
                </label>
              </div>
            </div>

            <!-- Price Range -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Price Range: ${{ filters.priceRange[0] }} - ${{ filters.priceRange[1] }}
              </label>
              <div class="space-y-2">
                <input
                  type="range"
                  v-model.number="filters.priceRange[0]"
                  :min="0"
                  :max="filters.priceRange[1]"
                  class="w-full"
                />
                <input
                  type="range"
                  v-model.number="filters.priceRange[1]"
                  :min="filters.priceRange[0]"
                  :max="500"
                  class="w-full"
                />
              </div>
            </div>

            <!-- Players -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Players</label>
              <select
                v-model.number="filters.players"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option :value="1">1 Player</option>
                <option :value="2">2 Players</option>
                <option :value="3">3 Players</option>
                <option :value="4">4 Players</option>
              </select>
            </div>

            <!-- Hot Deals Toggle -->
            <div class="mb-6">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="filters.hotDeals"
                  class="mr-2 text-emerald-600 focus:ring-emerald-500"
                />
                <span class="text-sm font-medium">Hot Deals Only</span>
              </label>
            </div>

            <button
              @click="resetFilters"
              class="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <!-- Tee Times Grid -->
        <div class="lg:col-span-3">
          <div class="bg-white rounded-lg shadow p-6 mb-4">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold">
                {{ filteredTeeTimes.length }} Available Tee Times
              </h2>
              <select
                v-model="sortBy"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="time">Sort by Time</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          <div v-if="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
            <p class="mt-4 text-gray-600">Loading tee times...</p>
          </div>

          <div v-else-if="filteredTeeTimes.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
            <p class="text-gray-500">No tee times found matching your criteria.</p>
            <button
              @click="resetFilters"
              class="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>

          <div v-else class="space-y-4">
            <TeeTimeCard
              v-for="teeTime in paginatedTeeTimes"
              :key="teeTime.id"
              :tee-time="teeTime"
              @book="handleBooking"
            />
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="mt-8 flex justify-center">
            <nav class="flex space-x-2">
              <button
                @click="currentPage = Math.max(1, currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-2 bg-white border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  'px-3 py-2 border rounded-lg',
                  currentPage === page
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
              <button
                @click="currentPage = Math.min(totalPages, currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-2 bg-white border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Modal -->
    <BookingModal
      v-if="selectedTeeTime"
      :tee-time="selectedTeeTime"
      @close="selectedTeeTime = null"
      @confirm="confirmBooking"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import TeeTimeCard from '../components/TeeTimeCard.vue'
import BookingModal from '../components/BookingModal.vue'
import { generateMockTeeTimes, type TeeTime } from '../utils/mockData'

// Code visibility state
const showCode = ref(false)
const activeCodeTab = ref('Filters')
const codeTabs = ['Filters', 'Computed Logic', 'Pagination', 'Full Component']

const loading = ref(false)
const teeTimes = ref<TeeTime[]>([])
const selectedTeeTime = ref<TeeTime | null>(null)
const currentPage = ref(1)
const itemsPerPage = 10
const sortBy = ref('time')

const filters = ref({
  date: new Date().toISOString().split('T')[0],
  timeRanges: ['morning', 'afternoon'],
  priceRange: [0, 500],
  players: 2,
  hotDeals: false
})

const filteredTeeTimes = computed(() => {
  let result = [...teeTimes.value]

  // Apply filters
  if (filters.value.hotDeals) {
    result = result.filter(t => t.isHotDeal)
  }

  result = result.filter(t => {
    const price = t.price
    return price >= filters.value.priceRange[0] && price <= filters.value.priceRange[1]
  })

  result = result.filter(t => {
    const hour = parseInt(t.time.split(':')[0])
    const timeRange = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'
    return filters.value.timeRanges.includes(timeRange)
  })

  // Sort
  switch (sortBy.value) {
    case 'price-low':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      result.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    default:
      result.sort((a, b) => a.time.localeCompare(b.time))
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredTeeTimes.value.length / itemsPerPage))

const paginatedTeeTimes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTeeTimes.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const resetFilters = () => {
  filters.value = {
    date: new Date().toISOString().split('T')[0],
    timeRanges: ['morning', 'afternoon'],
    priceRange: [0, 500],
    players: 2,
    hotDeals: false
  }
  currentPage.value = 1
}

const handleBooking = (teeTime: TeeTime) => {
  selectedTeeTime.value = teeTime
}

const confirmBooking = (bookingData: any) => {
  console.log('Booking confirmed:', bookingData)
  selectedTeeTime.value = null
  // Show success message
}

const loadTeeTimes = async () => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  teeTimes.value = generateMockTeeTimes()
  loading.value = false
}

onMounted(() => {
  loadTeeTimes()
})

// Code snippets for display
const filtersCode = `// Reactive filters object
const filters = ref({
  date: new Date().toISOString().split('T')[0],
  timeRanges: ['morning', 'afternoon'],
  priceRange: [0, 500],
  players: 2,
  hotDeals: false
})

// Reset filters function
const resetFilters = () => {
  filters.value = {
    date: new Date().toISOString().split('T')[0],
    timeRanges: ['morning', 'afternoon'],
    priceRange: [0, 500],
    players: 2,
    hotDeals: false
  }
  currentPage.value = 1
}

// Template usage:
// <input type="date" v-model="filters.date" />
// <input type="checkbox" v-model="filters.timeRanges" value="morning" />
// <input type="range" v-model.number="filters.priceRange[0]" />`

const computedCode = `// Computed property for filtering and sorting
const filteredTeeTimes = computed(() => {
  let result = [...teeTimes.value]

  // Filter by hot deals
  if (filters.value.hotDeals) {
    result = result.filter(t => t.isHotDeal)
  }

  // Filter by price range
  result = result.filter(t => {
    const price = t.price
    return price >= filters.value.priceRange[0] &&
           price <= filters.value.priceRange[1]
  })

  // Filter by time range
  result = result.filter(t => {
    const hour = parseInt(t.time.split(':')[0])
    const timeRange = hour < 12 ? 'morning'
                    : hour < 18 ? 'afternoon'
                    : 'evening'
    return filters.value.timeRanges.includes(timeRange)
  })

  // Sort results
  switch (sortBy.value) {
    case 'price-low':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      result.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    default:
      result.sort((a, b) => a.time.localeCompare(b.time))
  }

  return result
})`

const paginationCode = `// Pagination state
const currentPage = ref(1)
const itemsPerPage = 10

// Calculate total pages
const totalPages = computed(() =>
  Math.ceil(filteredTeeTimes.value.length / itemsPerPage)
)

// Get items for current page
const paginatedTeeTimes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTeeTimes.value.slice(start, end)
})

// Calculate visible page numbers
const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Template usage:
// <TeeTimeCard v-for="teeTime in paginatedTeeTimes" :key="teeTime.id" />
// <button @click="currentPage = Math.max(1, currentPage - 1)">Previous</button>
// <button v-for="page in visiblePages" @click="currentPage = page">{{ page }}</button>`

const fullComponentCode = `<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import TeeTimeCard from '../components/TeeTimeCard.vue'
import BookingModal from '../components/BookingModal.vue'
import { generateMockTeeTimes, type TeeTime } from '../utils/mockData'

const loading = ref(false)
const teeTimes = ref<TeeTime[]>([])
const selectedTeeTime = ref<TeeTime | null>(null)
const currentPage = ref(1)
const itemsPerPage = 10
const sortBy = ref('time')

const filters = ref({
  date: new Date().toISOString().split('T')[0],
  timeRanges: ['morning', 'afternoon'],
  priceRange: [0, 500],
  players: 2,
  hotDeals: false
})

const filteredTeeTimes = computed(() => {
  let result = [...teeTimes.value]

  if (filters.value.hotDeals) {
    result = result.filter(t => t.isHotDeal)
  }

  result = result.filter(t => {
    const price = t.price
    return price >= filters.value.priceRange[0] &&
           price <= filters.value.priceRange[1]
  })

  result = result.filter(t => {
    const hour = parseInt(t.time.split(':')[0])
    const timeRange = hour < 12 ? 'morning'
                    : hour < 18 ? 'afternoon' : 'evening'
    return filters.value.timeRanges.includes(timeRange)
  })

  switch (sortBy.value) {
    case 'price-low':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      result.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    default:
      result.sort((a, b) => a.time.localeCompare(b.time))
  }

  return result
})

const paginatedTeeTimes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTeeTimes.value.slice(start, end)
})

const handleBooking = (teeTime: TeeTime) => {
  selectedTeeTime.value = teeTime
}

const confirmBooking = (bookingData: any) => {
  console.log('Booking confirmed:', bookingData)
  selectedTeeTime.value = null
}

const loadTeeTimes = async () => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  teeTimes.value = generateMockTeeTimes()
  loading.value = false
}

onMounted(() => {
  loadTeeTimes()
})
<\/script>`
</script>