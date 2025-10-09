<template>
  <div data-testid="filter-container" class="p-4 bg-white rounded-lg shadow-md">
    <!-- No Data Message -->
    <div v-if="teeTimes.length === 0" data-testid="no-data-message" class="text-gray-500 text-center py-8">
      No tee times available
    </div>

    <!-- Filters -->
    <div v-else class="space-y-4">
      <!-- Filter Summary -->
      <div class="flex justify-between items-center mb-4">
        <span data-testid="filter-count" class="text-sm text-gray-600">
          {{ activeFilterCount }} active {{ activeFilterCount === 1 ? 'filter' : 'filters' }}
        </span>
        <button
          data-testid="btn-clear-filters"
          @click="clearAllFilters"
          :disabled="!hasActiveFilters"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Clear All
        </button>
      </div>

      <!-- Course Filter -->
      <div>
        <label for="course-select" class="block text-sm font-medium text-gray-700 mb-1">
          Golf Course
        </label>
        <select
          id="course-select"
          data-testid="course-filter"
          v-model="filters.course"
          @change="handleFilterChange"
          aria-label="Filter by golf course"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Courses</option>
          <option
            v-for="(course, index) in uniqueCourses"
            :key="course"
            :value="course"
            :data-testid="`course-option-${index}`"
          >
            {{ course }}
          </option>
        </select>
      </div>

      <!-- Date Filter -->
      <div>
        <label for="date-input" class="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          id="date-input"
          type="date"
          data-testid="date-filter"
          v-model="filters.date"
          @change="handleFilterChange"
          aria-label="Filter by date"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>

      <!-- Price Range Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Price Range: ${{ filters.priceRange.min }} - ${{ filters.priceRange.max }}
        </label>
        <div class="space-y-2">
          <div class="flex items-center space-x-4">
            <label for="price-min-input" class="text-sm text-gray-600 w-16">Min:</label>
            <input
              id="price-min-input"
              type="range"
              data-testid="price-min"
              v-model.number="filters.priceRange.min"
              @input="debouncedPriceChange"
              :min="minPrice"
              :max="maxPrice"
              aria-label="Minimum price filter"
              aria-describedby="price-range-help"
              class="flex-1"
            >
            <span class="text-sm text-gray-600 w-16">${{ filters.priceRange.min }}</span>
          </div>
          <div class="flex items-center space-x-4">
            <label for="price-max-input" class="text-sm text-gray-600 w-16">Max:</label>
            <input
              id="price-max-input"
              type="range"
              data-testid="price-max"
              v-model.number="filters.priceRange.max"
              @input="debouncedPriceChange"
              :min="minPrice"
              :max="maxPrice"
              aria-label="Maximum price filter"
              aria-describedby="price-range-help"
              class="flex-1"
            >
            <span class="text-sm text-gray-600 w-16">${{ filters.priceRange.max }}</span>
          </div>
        </div>
        <p id="price-range-help" class="text-xs text-gray-500 mt-1">
          Adjust the slider to filter by price range
        </p>
      </div>

      <!-- Accessibility Live Region -->
      <div aria-live="polite" aria-atomic="true" class="sr-only">
        {{ filterAnnouncement }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

export interface TeeTime {
  id: number
  course?: string
  date?: string
  time?: string
  price?: number
  available?: boolean
}

export interface FilterState {
  course: string
  date: string
  priceRange: {
    min: number
    max: number
  }
}

// Props
const props = defineProps<{
  teeTimes: TeeTime[]
}>()

// Emits
const emit = defineEmits<{
  'filter-change': [filters: FilterState]
}>()

// State
const filters = ref<FilterState>({
  course: '',
  date: '',
  priceRange: {
    min: 0,
    max: 999
  }
})

const filterAnnouncement = ref('')
let priceDebounceTimer: ReturnType<typeof setTimeout> | null = null

// Computed
const uniqueCourses = computed(() => {
  const courses = props.teeTimes
    .map(t => t.course)
    .filter(Boolean) // Remove undefined/null values
  return [...new Set(courses)].sort()
})

const minPrice = computed(() => {
  const prices = props.teeTimes.map(t => t.price).filter(p => p !== undefined) as number[]
  return prices.length > 0 ? Math.min(...prices) : 0
})

const maxPrice = computed(() => {
  const prices = props.teeTimes.map(t => t.price).filter(p => p !== undefined) as number[]
  return prices.length > 0 ? Math.max(...prices) : 999
})

const hasActiveFilters = computed(() => {
  return filters.value.course !== '' ||
         filters.value.date !== '' ||
         filters.value.priceRange.min !== minPrice.value ||
         filters.value.priceRange.max !== maxPrice.value
})

const activeFilterCount = computed(() => {
  let count = 0
  if (filters.value.course) count++
  if (filters.value.date) count++
  if (filters.value.priceRange.min !== minPrice.value || 
      filters.value.priceRange.max !== maxPrice.value) count++
  return count
})

// Methods
const handleFilterChange = () => {
  emit('filter-change', { ...filters.value })
  updateAnnouncement()
}

const debouncedPriceChange = () => {
  if (priceDebounceTimer) {
    clearTimeout(priceDebounceTimer)
  }
  
  priceDebounceTimer = setTimeout(() => {
    handleFilterChange()
  }, 300)
}

const clearAllFilters = () => {
  filters.value = {
    course: '',
    date: '',
    priceRange: {
      min: minPrice.value,
      max: maxPrice.value
    }
  }
  handleFilterChange()
  filterAnnouncement.value = 'All filters cleared'
}

const updateAnnouncement = () => {
  const announcements: string[] = []
  
  if (filters.value.course) {
    announcements.push(`Filter applied: ${filters.value.course}`)
  }
  if (filters.value.date) {
    announcements.push(`Date: ${filters.value.date}`)
  }
  if (filters.value.priceRange.min !== minPrice.value || 
      filters.value.priceRange.max !== maxPrice.value) {
    announcements.push(`Price range: $${filters.value.priceRange.min} to $${filters.value.priceRange.max}`)
  }
  
  filterAnnouncement.value = announcements.join(', ') || 'No filters applied'
}

// Lifecycle
onMounted(() => {
  // Initialize price range with actual min/max from data
  filters.value.priceRange.min = minPrice.value
  filters.value.priceRange.max = maxPrice.value
})

// Watch for tee times changes to update price range
watch(() => props.teeTimes, () => {
  // Reset price range if it's outside new bounds
  if (filters.value.priceRange.min < minPrice.value) {
    filters.value.priceRange.min = minPrice.value
  }
  if (filters.value.priceRange.max > maxPrice.value) {
    filters.value.priceRange.max = maxPrice.value
  }
})
</script>

<style scoped>
/* Screen reader only class for accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Custom range slider styles */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-track {
  background: #e5e7eb;
  height: 6px;
  border-radius: 3px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: #3b82f6;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  margin-top: -7px;
}

input[type="range"]::-moz-range-track {
  background: #e5e7eb;
  height: 6px;
  border-radius: 3px;
}

input[type="range"]::-moz-range-thumb {
  background: #3b82f6;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  border: none;
}

input[type="range"]:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}

input[type="range"]:focus::-moz-range-thumb {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}
</style>
