<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-golf-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-lg">⛳</span>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900">GolfNow Interview Prep</h1>
            <p class="text-sm text-gray-500">Frontend Practice Platform</p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="text-right">
            <p class="text-sm font-medium text-gray-900">Progress: {{ completedCount }}/{{ totalCount }}</p>
            <div class="w-32 bg-gray-200 rounded-full h-2">
              <div 
                class="bg-golf-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${progressPercentage}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  completedCount: number
  totalCount: number
}

const props = defineProps<Props>()

const progressPercentage = computed(() => {
  return props.totalCount > 0 ? Math.round((props.completedCount / props.totalCount) * 100) : 0
})
</script>