<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-800">Complete Your Booking</h2>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
      </div>
      
      <div class="p-6">
        <div class="bg-emerald-50 rounded-lg p-4 mb-6">
          <h3 class="font-semibold text-emerald-800 mb-2">{{ teeTime.courseName }}</h3>
          <div class="grid grid-cols-2 gap-2 text-sm text-emerald-700">
            <div>Date: {{ formatDate(teeTime.date) }}</div>
            <div>Time: {{ formatTime(teeTime.time) }}</div>
            <div>Players: {{ teeTime.players }}</div>
            <div>Holes: {{ teeTime.holes }}</div>
          </div>
        </div>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Primary Player Name *
            </label>
            <input
              v-model="bookingForm.primaryPlayer"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              v-model="bookingForm.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="john@example.com"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Phone *
            </label>
            <input
              v-model="bookingForm.phone"
              type="tel"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="(555) 123-4567"
            />
          </div>
          
          <div v-if="teeTime.players > 1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Additional Players
            </label>
            <div class="space-y-2">
              <input
                v-for="i in teeTime.players - 1"
                :key="i"
                v-model="bookingForm.additionalPlayers[i - 1]"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                :placeholder="`Player ${i + 1} Name`"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Special Requests
            </label>
            <textarea
              v-model="bookingForm.specialRequests"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Any special requests or notes..."
            ></textarea>
          </div>
          
          <div class="border-t pt-4">
            <div class="flex justify-between items-center mb-4">
              <span class="text-lg font-semibold">Total:</span>
              <span class="text-2xl font-bold text-emerald-600">
                ${{ teeTime.price * teeTime.players }}
              </span>
            </div>
            
            <div class="flex gap-3">
              <button
                type="button"
                @click="$emit('close')"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { TeeTime } from '../utils/mockData'

const props = defineProps<{
  teeTime: TeeTime
}>()

const emit = defineEmits<{
  close: []
  confirm: [bookingData: any]
}>()

const bookingForm = reactive({
  primaryPlayer: '',
  email: '',
  phone: '',
  additionalPlayers: Array(props.teeTime.players - 1).fill(''),
  specialRequests: ''
})

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

const handleSubmit = () => {
  emit('confirm', {
    ...bookingForm,
    teeTime: props.teeTime
  })
}
</script>