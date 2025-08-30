<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>
      
      <div class="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">{{ challenge.title }}</h3>
            <p class="text-sm text-gray-500">{{ challenge.description }}</p>
          </div>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Code Editor -->
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <h4 class="font-medium text-gray-900">Your Solution</h4>
              <div class="space-x-2">
                <button 
                  @click="runCode"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-golf-600 hover:bg-golf-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-golf-500"
                >
                  ▶ Run Code
                </button>
                <button 
                  @click="showSolution = !showSolution"
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-golf-500"
                >
                  {{ showSolution ? 'Hide' : 'Show' }} Solution
                </button>
              </div>
            </div>
            
            <textarea
              v-model="userCode"
              class="code-editor w-full h-96 resize-none focus:ring-golf-500 focus:border-golf-500"
              :placeholder="challenge.starterCode"
            ></textarea>
          </div>

          <!-- Results Panel -->
          <div class="space-y-4">
            <h4 class="font-medium text-gray-900">Test Results</h4>
            
            <div v-if="testResults.length" class="space-y-2">
              <div 
                v-for="(result, index) in testResults" 
                :key="index"
                class="p-3 rounded-lg border"
                :class="result.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm font-medium">{{ result.description }}</span>
                  <span :class="result.passed ? 'text-green-600' : 'text-red-600'">
                    {{ result.passed ? '✓' : '✗' }}
                  </span>
                </div>
                <p class="text-xs text-gray-600">{{ result.message }}</p>
              </div>
            </div>

            <div v-if="showSolution" class="space-y-2">
              <h5 class="font-medium text-gray-700">Solution:</h5>
              <pre class="code-editor text-xs overflow-auto max-h-64">{{ challenge.solution }}</pre>
            </div>

            <div v-if="!testResults.length" class="text-center py-8 text-gray-500">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p class="mt-2">Click "Run Code" to test your solution</p>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-between">
          <div class="flex items-center space-x-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="difficultyClass">
              {{ challenge.difficulty }}
            </span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {{ challenge.category }}
            </span>
          </div>
          
          <div class="space-x-3">
            <button 
              @click="$emit('close')"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-golf-500"
            >
              Close
            </button>
            <button 
              v-if="isCompleted"
              @click="markComplete"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-golf-600 hover:bg-golf-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-golf-500"
            >
              Mark Complete ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Challenge } from '../types'

interface Props {
  challenge: Challenge
  isOpen: boolean
}

interface TestResult {
  passed: boolean
  description: string
  message: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  complete: [id: string]
}>()

const userCode = ref('')
const testResults = ref<TestResult[]>([])
const showSolution = ref(false)

const difficultyClass = computed(() => {
  const classes = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-yellow-100 text-yellow-800',
    Advanced: 'bg-red-100 text-red-800'
  }
  return classes[props.challenge.difficulty] || 'bg-gray-100 text-gray-800'
})

const isCompleted = computed(() => {
  return testResults.value.length > 0 && testResults.value.every(result => result.passed)
})

const runCode = () => {
  // Simulate code execution and testing
  const results: TestResult[] = []
  
  props.challenge.testCases.forEach((testCase) => {
    const passed = Math.random() > 0.3 // Simulate test results
    results.push({
      passed,
      description: testCase.description,
      message: passed ? 'Test passed successfully!' : 'Expected different output. Check your implementation.'
    })
  })
  
  testResults.value = results
}

const markComplete = () => {
  if (isCompleted.value) {
    emit('complete', props.challenge.id)
    emit('close')
  }
}
</script>