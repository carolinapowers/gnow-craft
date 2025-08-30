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
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-800 mb-8">Vue.js Coding Challenges</h1>
        
        <div v-if="!selectedChallenge" class="space-y-4">
          <div
            v-for="challenge in challenges"
            :key="challenge.id"
            @click="selectChallenge(challenge)"
            class="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 p-6 cursor-pointer border border-gray-100 hover:border-emerald-300"
          >
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="text-xl font-semibold text-gray-800">{{ challenge.title }}</h3>
                <p class="text-gray-600 mt-1">{{ challenge.description }}</p>
              </div>
              <span
                :class="[
                  'px-3 py-1 rounded-full text-sm font-medium',
                  getDifficultyClass(challenge.difficulty)
                ]"
              >
                {{ challenge.difficulty }}
              </span>
            </div>
            
            <div class="flex flex-wrap gap-2 mt-4">
              <span
                v-for="tag in challenge.tags"
                :key="tag"
                class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
        
        <div v-else class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-800">{{ selectedChallenge.title }}</h2>
              <span
                :class="[
                  'inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium',
                  getDifficultyClass(selectedChallenge.difficulty)
                ]"
              >
                {{ selectedChallenge.difficulty }}
              </span>
            </div>
            <button
              @click="selectedChallenge = null"
              class="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div class="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 class="font-semibold text-gray-700 mb-2">Challenge Description:</h3>
            <p class="text-gray-600">{{ selectedChallenge.description }}</p>
            
            <div v-if="selectedChallenge.requirements" class="mt-4">
              <h4 class="font-semibold text-gray-700 mb-2">Requirements:</h4>
              <ul class="list-disc list-inside space-y-1 text-gray-600">
                <li v-for="req in selectedChallenge.requirements" :key="req">
                  {{ req }}
                </li>
              </ul>
            </div>
          </div>
          
          <div class="grid lg:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold text-gray-700 mb-2">Your Solution:</h3>
              <textarea
                v-model="userCode"
                class="w-full h-96 font-mono text-sm p-4 bg-gray-900 text-green-400 rounded-lg"
                spellcheck="false"
              ></textarea>
            </div>
            
            <div>
              <h3 class="font-semibold text-gray-700 mb-2">Test Results:</h3>
              <div class="h-96 bg-gray-100 rounded-lg p-4 overflow-auto">
                <div v-if="testResults.length === 0" class="text-gray-500">
                  Run tests to see results here
                </div>
                <div v-else class="space-y-2">
                  <div
                    v-for="(result, index) in testResults"
                    :key="index"
                    class="flex items-center gap-2"
                  >
                    <span v-if="result.passed" class="text-green-600">✓</span>
                    <span v-else class="text-red-600">✗</span>
                    <span :class="result.passed ? 'text-green-700' : 'text-red-700'">
                      {{ result.message }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-6 flex gap-3">
            <button
              @click="runTests"
              class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Run Tests
            </button>
            <button
              @click="showHint"
              class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Show Hint
            </button>
            <button
              @click="showSolution"
              class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Show Solution
            </button>
          </div>
          
          <div v-if="hint" class="mt-4 p-4 bg-blue-50 rounded-lg">
            <p class="text-blue-700">
              <strong>Hint:</strong> {{ hint }}
            </p>
          </div>
          
          <div v-if="solution" class="mt-4">
            <h3 class="font-semibold text-gray-700 mb-2">Solution:</h3>
            <pre class="p-4 bg-gray-900 text-green-400 rounded-lg overflow-auto"><code>{{ solution }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { challenges as importedChallenges } from '../data/challenges'

interface TestResult {
  passed: boolean
  message: string
}

const challenges = ref(importedChallenges)
const selectedChallenge = ref<any>(null)
const userCode = ref('')
const testResults = ref<TestResult[]>([])
const hint = ref('')
const solution = ref('')

const selectChallenge = (challenge: any) => {
  selectedChallenge.value = challenge
  userCode.value = challenge.starterCode || ''
  testResults.value = []
  hint.value = ''
  solution.value = ''
}

const getDifficultyClass = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-green-100 text-green-700'
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-700'
    case 'hard':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const runTests = () => {
  testResults.value = []
  
  // Simulate test execution
  const tests = selectedChallenge.value.tests || [
    { name: 'Component renders', passed: true },
    { name: 'Props are handled correctly', passed: true },
    { name: 'Events emit properly', passed: Math.random() > 0.3 },
    { name: 'Computed properties work', passed: Math.random() > 0.2 },
    { name: 'Validation passes', passed: Math.random() > 0.4 }
  ]
  
  tests.forEach((test: any) => {
    testResults.value.push({
      passed: test.passed,
      message: test.name
    })
  })
}

const showHint = () => {
  hint.value = selectedChallenge.value.hint || 'Think about how Vue components communicate with each other. Consider using props for parent-to-child communication and events for child-to-parent.'
}

const showSolution = () => {
  solution.value = selectedChallenge.value.solution || userCode.value
}
</script>