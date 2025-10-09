<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">TDD Demo: Tee Time Filter</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Filter Panel -->
        <div class="lg:col-span-1">
          <TeeTimeFilter
            :tee-times="allTeeTimes"
            @filter-change="handleFilterChange"
          />
        </div>

        <!-- Results Panel -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">
              Available Tee Times ({{ filteredTeeTimes.length }} results)
            </h2>

            <div v-if="filteredTeeTimes.length === 0" class="text-gray-500 text-center py-8">
              No tee times match your filters. Try adjusting your criteria.
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="teeTime in filteredTeeTimes"
                :key="teeTime.id"
                class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-semibold text-gray-900">{{ teeTime.course }}</h3>
                    <p class="text-sm text-gray-600 mt-1">
                      {{ formatDate(teeTime.date) }} at {{ teeTime.time }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-2xl font-bold text-green-600">${{ teeTime.price }}</p>
                    <span
                      :class="[
                        'inline-block px-2 py-1 text-xs font-medium rounded-full mt-2',
                        teeTime.available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      ]"
                    >
                      {{ teeTime.available ? 'Available' : 'Booked' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TDD Info Panel -->
      <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 class="text-lg font-semibold text-blue-900 mb-2">🧪 TDD Implementation</h2>
        <p class="text-sm text-blue-800 mb-4">
          This component was built using Test-Driven Development. The tests were written first,
          defining the expected behavior, and then the implementation was created to satisfy those tests.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h3 class="font-semibold text-blue-900">✅ Test Coverage</h3>
            <ul class="mt-1 text-blue-700 space-y-1">
              <li>• Component initialization</li>
              <li>• Filter functionality</li>
              <li>• Debouncing</li>
              <li>• Accessibility</li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-blue-900">🎯 Features Tested</h3>
            <ul class="mt-1 text-blue-700 space-y-1">
              <li>• Course filtering</li>
              <li>• Date selection</li>
              <li>• Price range slider</li>
              <li>• Clear all filters</li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-blue-900">📊 Metrics</h3>
            <ul class="mt-1 text-blue-700 space-y-1">
              <li>• 30+ test cases</li>
              <li>• 100% coverage target</li>
              <li>• 300ms debounce</li>
              <li>• ARIA compliant</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TeeTimeFilter, { type TeeTime, type FilterState } from '../components/TeeTimeFilter.vue'

// Sample data - in a real app, this would come from an API
const allTeeTimes = ref<TeeTime[]>([
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
  },
  {
    id: 5,
    course: 'Desert Palms Resort',
    date: '2024-03-17',
    time: '9:00 AM',
    price: 200,
    available: true
  },
  {
    id: 6,
    course: 'Ocean Course',
    date: '2024-03-17',
    time: '11:00 AM',
    price: 275,
    available: true
  },
  {
    id: 7,
    course: 'Mountain View Golf',
    date: '2024-03-18',
    time: '8:30 AM',
    price: 110,
    available: true
  },
  {
    id: 8,
    course: 'Pine Valley Golf Club',
    date: '2024-03-18',
    time: '3:00 PM',
    price: 160,
    available: true
  },
  {
    id: 9,
    course: 'Desert Palms Resort',
    date: '2024-03-19',
    time: '10:00 AM',
    price: 225,
    available: false
  },
  {
    id: 10,
    course: 'Ocean Course',
    date: '2024-03-19',
    time: '1:00 PM',
    price: 300,
    available: true
  }
])

const currentFilters = ref<FilterState>({
  course: '',
  date: '',
  priceRange: {
    min: 0,
    max: 999
  }
})

// Computed property for filtered tee times
const filteredTeeTimes = computed(() => {
  return allTeeTimes.value.filter(teeTime => {
    // Filter by course
    if (currentFilters.value.course && teeTime.course !== currentFilters.value.course) {
      return false
    }

    // Filter by date
    if (currentFilters.value.date && teeTime.date !== currentFilters.value.date) {
      return false
    }

    // Filter by price range
    if (teeTime.price) {
      if (teeTime.price < currentFilters.value.priceRange.min ||
          teeTime.price > currentFilters.value.priceRange.max) {
        return false
      }
    }

    return true
  })
})

// Handle filter changes
const handleFilterChange = (filters: FilterState) => {
  currentFilters.value = filters
  console.log('Filters applied:', filters)
}

// Utility function to format date
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A'
  
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
