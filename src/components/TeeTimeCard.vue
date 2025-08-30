<template>
  <div class="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 overflow-hidden">
    <div class="flex flex-col md:flex-row">
      <div class="md:w-48 h-48 md:h-auto relative">
        <img
          :src="teeTime.courseImage"
          :alt="teeTime.courseName"
          class="w-full h-full object-cover"
        />
        <div v-if="teeTime.isHotDeal" class="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-sm font-semibold">
          HOT DEAL
        </div>
      </div>
      
      <div class="flex-1 p-6">
        <div class="flex justify-between items-start mb-3">
          <div>
            <h3 class="text-xl font-semibold text-gray-800">{{ teeTime.courseName }}</h3>
            <div class="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <span class="flex items-center gap-1">
                <span class="text-yellow-500">★</span>
                {{ teeTime.rating.toFixed(1) }} ({{ teeTime.reviews }} reviews)
              </span>
              <span>{{ teeTime.distance }}</span>
              <span class="px-2 py-0.5 bg-gray-100 rounded text-xs">{{ teeTime.difficulty }}</span>
            </div>
          </div>
          
          <div class="text-right">
            <div v-if="teeTime.originalPrice" class="text-sm text-gray-500 line-through">
              ${{ teeTime.originalPrice }}
            </div>
            <div class="text-2xl font-bold text-emerald-600">
              ${{ teeTime.price }}
            </div>
            <div class="text-sm text-gray-600">per player</div>
          </div>
        </div>
        
        <div class="flex items-center gap-6 mb-4 text-sm">
          <div class="flex items-center gap-2">
            <span class="text-gray-500">⏰</span>
            <span>{{ formatTime(teeTime.time) }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-gray-500">👥</span>
            <span>{{ teeTime.players }} players</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-gray-500">🏌️</span>
            <span>{{ teeTime.holes }} holes</span>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-2 mb-4">
          <span
            v-for="amenity in teeTime.amenities"
            :key="amenity"
            class="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full"
          >
            {{ amenity }}
          </span>
        </div>
        
        <div class="flex gap-3">
          <button
            @click="$emit('book', teeTime)"
            class="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            Book Now
          </button>
          <button
            @click="toggleFavorite"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span v-if="isFavorite" class="text-red-500">♥</span>
            <span v-else class="text-gray-400">♡</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TeeTime } from '../utils/mockData'

defineProps<{
  teeTime: TeeTime
}>()

defineEmits<{
  book: [teeTime: TeeTime]
}>()

const isFavorite = ref(false)

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}
</script>