<template>
  <div class="challenge-card p-6">
    <h3 class="text-lg font-semibold mb-4">Mock Tee Time Booking</h3>
    <p class="text-gray-600 mb-6">Practice with a realistic golf booking interface</p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Search Panel -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input 
            v-model="searchDate" 
            type="date" 
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-golf-500 focus:ring-golf-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Players</label>
          <select 
            v-model="searchPlayers" 
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-golf-500 focus:ring-golf-500"
          >
            <option value="1">1 Player</option>
            <option value="2">2 Players</option>
            <option value="3">3 Players</option>
            <option value="4">4 Players</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
          <div class="flex items-center space-x-2">
            <input 
              v-model="maxPrice" 
              type="range" 
              min="20" 
              max="200" 
              class="flex-1"
            />
            <span class="text-sm font-medium text-gray-900 w-12">${{ maxPrice }}</span>
          </div>
        </div>
        
        <button 
          @click="searchTeeTimes"
          class="w-full bg-golf-600 text-white py-2 px-4 rounded-md hover:bg-golf-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-golf-500"
        >
          Search Tee Times
        </button>
      </div>
      
      <!-- Results Panel -->
      <div class="space-y-4">
        <h4 class="font-medium text-gray-900">Available Tee Times</h4>
        
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-golf-600 mx-auto"></div>
          <p class="mt-2 text-gray-500">Searching...</p>
        </div>
        
        <div v-else-if="filteredTeeTimes.length" class="space-y-3 max-h-64 overflow-y-auto">
          <div 
            v-for="teeTime in filteredTeeTimes" 
            :key="teeTime.id"
            class="p-3 border border-gray-200 rounded-lg hover:border-golf-300 transition-colors"
          >
            <div class="flex justify-between items-start">
              <div>
                <h5 class="font-medium text-gray-900">{{ teeTime.courseName }}</h5>
                <p class="text-sm text-gray-600">{{ teeTime.time }} • {{ teeTime.holes }} holes</p>
                <p class="text-lg font-semibold text-golf-600">${{ teeTime.price }}</p>
              </div>
              <button 
                @click="bookTeeTime(teeTime)"
                :disabled="!teeTime.available"
                class="px-3 py-1 text-xs font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed"
                :class="teeTime.available 
                  ? 'bg-golf-600 text-white hover:bg-golf-700' 
                  : 'bg-gray-200 text-gray-500'"
              >
                {{ teeTime.available ? 'Book' : 'Full' }}
              </button>
            </div>
          </div>
        </div>
        
        <div v-else-if="!loading" class="text-center py-8 text-gray-500">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="mt-2">No tee times match your criteria</p>
        </div>
      </div>
    </div>
    
    <!-- Booking Confirmation -->
    <div v-if="bookedTeeTime" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <div class="ml-2">
          <h4 class="text-sm font-medium text-green-800">Booking Confirmed!</h4>
          <p class="text-sm text-green-700">
            {{ bookedTeeTime.courseName }} on {{ bookedTeeTime.date }} at {{ bookedTeeTime.time }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TeeTime } from '../types'

const searchDate = ref('')
const searchPlayers = ref('2')
const maxPrice = ref(100)
const loading = ref(false)
const bookedTeeTime = ref<TeeTime | null>(null)

// Mock data
const allTeeTimes = ref<TeeTime[]>([
  {
    id: '1',
    courseName: 'Pine Valley Golf Club',
    time: '8:00 AM',
    date: '2025-01-15',
    price: 85,
    holes: 18,
    players: 4,
    available: true
  },
  {
    id: '2',
    courseName: 'Ocean View Resort',
    time: '10:30 AM',
    date: '2025-01-15',
    price: 65,
    holes: 18,
    players: 4,
    available: true
  },
  {
    id: '3',
    courseName: 'Mountain Ridge Course',
    time: '2:00 PM',
    date: '2025-01-15',
    price: 45,
    holes: 9,
    players: 4,
    available: false
  },
  {
    id: '4',
    courseName: 'Sunset Hills Golf',
    time: '3:30 PM',
    date: '2025-01-15',
    price: 120,
    holes: 18,
    players: 4,
    available: true
  },
  {
    id: '5',
    courseName: 'Green Meadows',
    time: '9:15 AM',
    date: '2025-01-15',
    price: 55,
    holes: 18,
    players: 4,
    available: true
  }
])

const filteredTeeTimes = computed(() => {
  return allTeeTimes.value.filter(teeTime => {
    const priceMatch = teeTime.price <= maxPrice.value
    const dateMatch = !searchDate.value || teeTime.date === searchDate.value
    return priceMatch && dateMatch
  })
})

const searchTeeTimes = async () => {
  loading.value = true
  bookedTeeTime.value = null
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  loading.value = false
}

const bookTeeTime = async (teeTime: TeeTime) => {
  if (!teeTime.available) return
  
  // Simulate booking process
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mark as booked
  teeTime.available = false
  bookedTeeTime.value = { ...teeTime }
  loading.value = false
}

// Set default search date to today
const today = new Date()
searchDate.value = today.toISOString().split('T')[0]
</script>