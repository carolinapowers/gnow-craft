import type { Challenge } from '../types';

export const challenges: Challenge[] = [
  {
    id: 'reactive-tee-times',
    title: 'Reactive Tee Time Filtering',
    description: 'Create a reactive filter for tee times based on price range and course preferences.',
    difficulty: 'Intermediate',
    category: 'Vue',
    starterCode: `<template>
  <div class="p-4">
    <h3>Filter Tee Times</h3>
    <!-- Add your filtering UI here -->
    <div class="tee-times">
      <!-- Display filtered results -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const teeTimes = ref([
  { id: '1', course: 'Pine Valley', time: '8:00 AM', price: 85, holes: 18 },
  { id: '2', course: 'Ocean View', time: '10:30 AM', price: 65, holes: 18 },
  { id: '3', course: 'Mountain Ridge', time: '2:00 PM', price: 45, holes: 9 },
])

// Implement reactive filtering logic
const maxPrice = ref(100)
const holesFilter = ref('all')

const filteredTeeTimes = computed(() => {
  // Your implementation here
  return teeTimes.value
})
</script>`,
    solution: `<template>
  <div class="p-4">
    <h3 class="text-xl font-bold mb-4">Filter Tee Times</h3>
    <div class="filters mb-4 space-y-4">
      <div>
        <label class="block text-sm font-medium">Max Price: $ {{ maxPrice }}</label>
        <input 
          v-model="maxPrice" 
          type="range" 
          min="0" 
          max="150" 
          class="w-full"
        />
      </div>
      <div>
        <label class="block text-sm font-medium">Holes</label>
        <select v-model="holesFilter" class="mt-1">
          <option value="all">All</option>
          <option value="9">9 Holes</option>
          <option value="18">18 Holes</option>
        </select>
      </div>
    </div>
    <div class="tee-times space-y-2">
      <div 
        v-for="teeTime in filteredTeeTimes" 
        :key="teeTime.id"
        class="p-3 border rounded-lg"
      >
        {{ teeTime.course }} - {{ teeTime.time }} - ${{ teeTime.price }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const teeTimes = ref([
  { id: '1', course: 'Pine Valley', time: '8:00 AM', price: 85, holes: 18 },
  { id: '2', course: 'Ocean View', time: '10:30 AM', price: 65, holes: 18 },
  { id: '3', course: 'Mountain Ridge', time: '2:00 PM', price: 45, holes: 9 },
])

const maxPrice = ref(100)
const holesFilter = ref('all')

const filteredTeeTimes = computed(() => {
  return teeTimes.value.filter(teeTime => {
    const priceMatch = teeTime.price <= maxPrice.value
    const holesMatch = holesFilter.value === 'all' || teeTime.holes.toString() === holesFilter.value
    return priceMatch && holesMatch
  })
})
</script>`,
    testCases: [
      {
        input: { maxPrice: 50, holesFilter: 'all' },
        expected: 1,
        description: 'Should filter by price correctly'
      },
      {
        input: { maxPrice: 100, holesFilter: '18' },
        expected: 2,
        description: 'Should filter by holes correctly'
      }
    ]
  },
  {
    id: 'component-communication',
    title: 'Parent-Child Component Communication',
    description: 'Implement props and events for a tee time booking component.',
    difficulty: 'Intermediate',
    category: 'Components',
    starterCode: `<!-- ParentComponent.vue -->
<template>
  <div>
    <TeeTimeCard 
      :tee-time="selectedTeeTime"
      @book="handleBooking"
      @favorite="handleFavorite"
    />
    <p>Booking status: {{ bookingStatus }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TeeTimeCard from './TeeTimeCard.vue'

const selectedTeeTime = ref({
  id: '1',
  course: 'Pine Valley',
  time: '8:00 AM',
  price: 85
})

const bookingStatus = ref('Ready to book')

const handleBooking = (teeTimeId: string) => {
  // Implement booking logic
}

const handleFavorite = (teeTimeId: string) => {
  // Implement favorite logic
}
</script>`,
    solution: `<!-- ParentComponent.vue -->
<template>
  <div>
    <TeeTimeCard 
      :tee-time="selectedTeeTime"
      @book="handleBooking"
      @favorite="handleFavorite"
    />
    <p>Booking status: {{ bookingStatus }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TeeTimeCard from './TeeTimeCard.vue'

const selectedTeeTime = ref({
  id: '1',
  course: 'Pine Valley',
  time: '8:00 AM',
  price: 85
})

const bookingStatus = ref('Ready to book')

const handleBooking = (teeTimeId: string) => {
  bookingStatus.value = \`Booking tee time \${teeTimeId}...\`
  setTimeout(() => {
    bookingStatus.value = 'Booked successfully!'
  }, 2000)
}

const handleFavorite = (teeTimeId: string) => {
  console.log('Added to favorites:', teeTimeId)
}
</script>

<!-- TeeTimeCard.vue -->
<template>
  <div class="tee-time-card p-4 border rounded-lg">
    <h3>{{ teeTime.course }}</h3>
    <p>{{ teeTime.time }} - {{ teeTime.price }}</p>
    <div class="actions space-x-2">
      <button 
        @click="$emit('book', teeTime.id)"
        class="bg-golf-600 text-white px-4 py-2 rounded"
      >
        Book Now
      </button>
      <button 
        @click="$emit('favorite', teeTime.id)"
        class="border border-golf-600 text-golf-600 px-4 py-2 rounded"
      >
        ♥ Favorite
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TeeTime {
  id: string
  course: string
  time: string
  price: number
}

defineProps<{
  teeTime: TeeTime
}>()

defineEmits<{
  book: [id: string]
  favorite: [id: string]
}>()
</script>`,
    testCases: [
      {
        input: 'click book button',
        expected: 'booking event emitted',
        description: 'Should emit book event with tee time ID'
      }
    ]
  },
  {
    id: 'date-time-handling',
    title: 'Date & Time Manipulation',
    description: 'Handle tee time scheduling with date formatting and validation.',
    difficulty: 'Advanced',
    category: 'JavaScript',
    starterCode: `// Implement functions for tee time scheduling

function formatTeeTime(date: Date, time: string): string {
  // Format: "Monday, Dec 25 at 8:00 AM"
  // Your implementation here
}

function isValidTeeTime(date: Date, time: string): boolean {
  // Validate: No tee times before 6:00 AM or after 6:00 PM
  // No tee times in the past
  // Your implementation here
}

function getAvailableSlots(date: Date, bookedTimes: string[]): string[] {
  // Generate 30-minute intervals from 6:00 AM to 6:00 PM
  // Exclude booked times
  // Your implementation here
}`,
    solution: `function formatTeeTime(date: Date, time: string): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  const dayName = days[date.getDay()]
  const monthName = months[date.getMonth()]
  const dayNum = date.getDate()
  
  return \`\${dayName}, \${monthName} \${dayNum} at \${time}\`
}

function isValidTeeTime(date: Date, time: string): boolean {
  const now = new Date()
  const teeTimeDate = new Date(date)
  
  // Check if date is in the past
  if (teeTimeDate.toDateString() < now.toDateString()) {
    return false
  }
  
  // Parse time and validate range
  const [timeStr, period] = time.split(' ')
  const [hours, minutes] = timeStr.split(':').map(Number)
  let hour24 = hours
  
  if (period === 'PM' && hours !== 12) hour24 += 12
  if (period === 'AM' && hours === 12) hour24 = 0
  
  return hour24 >= 6 && hour24 < 18
}

function getAvailableSlots(date: Date, bookedTimes: string[]): string[] {
  const slots: string[] = []
  
  for (let hour = 6; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeStr = \`\${hour > 12 ? hour - 12 : hour === 0 ? 12 : hour}:\${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}\`
      
      if (!bookedTimes.includes(timeStr)) {
        slots.push(timeStr)
      }
    }
  }
  
  return slots
}`,
    testCases: [
      {
        input: { date: new Date('2025-12-25'), time: '8:00 AM' },
        expected: 'Monday, Dec 25 at 8:00 AM',
        description: 'Should format date and time correctly'
      }
    ]
  }
];