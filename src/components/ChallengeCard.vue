<template>
  <div class="challenge-card p-6 cursor-pointer" @click="$emit('select', challenge.id)">
    <div class="flex justify-between items-start mb-4">
      <div class="flex items-center space-x-3">
        <div class="w-12 h-12 rounded-lg flex items-center justify-center" :class="iconBgClass">
          <span class="text-lg">{{ categoryIcon }}</span>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900">{{ challenge.title }}</h3>
          <p class="text-sm text-gray-600">{{ challenge.category }}</p>
        </div>
      </div>
      <div class="flex flex-col items-end space-y-2">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="difficultyClass">
          {{ challenge.difficulty }}
        </span>
        <div v-if="isCompleted" class="text-golf-600">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
    <p class="text-gray-600 text-sm mb-4">{{ challenge.description }}</p>
    <div class="flex items-center justify-between text-xs text-gray-500">
      <span>{{ challenge.testCases.length }} test cases</span>
      <span class="flex items-center space-x-1">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L10 9.586V6z" clip-rule="evenodd" />
        </svg>
        <span>15-30 min</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Challenge } from '../types'

interface Props {
  challenge: Challenge
  isCompleted: boolean
}

const props = defineProps<Props>()

defineEmits<{
  select: [id: string]
}>()

const categoryIcon = computed(() => {
  const icons = {
    Vue: '⚡',
    JavaScript: '🔧',
    TypeScript: '📘',
    Components: '🧩'
  }
  return icons[props.challenge.category] || '💻'
})

const iconBgClass = computed(() => {
  const classes = {
    Vue: 'bg-green-100 text-green-600',
    JavaScript: 'bg-yellow-100 text-yellow-600',
    TypeScript: 'bg-blue-100 text-blue-600',
    Components: 'bg-purple-100 text-purple-600'
  }
  return classes[props.challenge.category] || 'bg-gray-100 text-gray-600'
})

const difficultyClass = computed(() => {
  const classes = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-yellow-100 text-yellow-800',
    Advanced: 'bg-red-100 text-red-800'
  }
  return classes[props.challenge.difficulty] || 'bg-gray-100 text-gray-800'
})
</script>