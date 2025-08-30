<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8">
    <div class="container mx-auto px-4">
      <header class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">JavaScript Fundamentals</h1>
        <p class="text-gray-600">Essential JavaScript concepts for frontend interviews</p>
      </header>

      <div class="max-w-6xl mx-auto">
        <!-- Category Tabs -->
        <div class="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            v-for="category in categories"
            :key="category"
            @click="activeCategory = category"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              activeCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            ]"
          >
            {{ category }}
          </button>
        </div>

        <!-- Scenarios Grid -->
        <div class="grid lg:grid-cols-2 gap-6">
          <div
            v-for="scenario in filteredScenarios"
            :key="scenario.id"
            class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-semibold text-gray-800">{{ scenario.title }}</h3>
              <span :class="difficultyColors[scenario.difficulty]" class="px-2 py-1 text-xs rounded-full">
                {{ scenario.difficulty }}
              </span>
            </div>
            
            <p class="text-gray-600 mb-4">{{ scenario.description }}</p>
            
            <div class="mb-4">
              <h4 class="font-medium text-gray-800 mb-2">Example:</h4>
              <div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre v-html="scenario.example"></pre>
              </div>
            </div>

            <div class="mb-4">
              <h4 class="font-medium text-gray-800 mb-2">Key Points:</h4>
              <ul class="space-y-1">
                <li 
                  v-for="point in scenario.keyPoints"
                  :key="point"
                  class="text-sm text-gray-600 flex items-start"
                >
                  <span class="text-blue-500 mr-2 mt-1">•</span>
                  {{ point }}
                </li>
              </ul>
            </div>

            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in scenario.tags"
                :key="tag"
                class="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- Interactive Practice Section -->
        <div class="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Quick Practice Challenge</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-medium text-gray-800 mb-2">Try This:</h3>
              <div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <pre>{{ currentChallenge.code }}</pre>
              </div>
              <button
                @click="runChallenge"
                class="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Run Code
              </button>
            </div>
            <div>
              <h3 class="font-medium text-gray-800 mb-2">Output:</h3>
              <div class="bg-gray-100 p-4 rounded-lg min-h-24">
                <pre class="text-sm">{{ challengeOutput }}</pre>
              </div>
              <div class="mt-3">
                <h4 class="font-medium text-gray-800 mb-1">Expected Output:</h4>
                <div class="bg-green-50 p-2 rounded text-sm text-green-800">
                  {{ currentChallenge.expected }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Scenario {
  id: string
  title: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  description: string
  example: string
  keyPoints: string[]
  tags: string[]
}

interface Challenge {
  code: string
  expected: string
}

const activeCategory = ref('All')
const challengeOutput = ref('')

const categories = ['All', 'ES6+ Features', 'Async JavaScript', 'DOM Manipulation', 'Algorithms', 'Object Patterns']

const difficultyColors = {
  'Beginner': 'bg-green-100 text-green-800',
  'Intermediate': 'bg-yellow-100 text-yellow-800', 
  'Advanced': 'bg-red-100 text-red-800'
}

const scenarios: Scenario[] = [
  {
    id: '1',
    title: 'Array Destructuring',
    category: 'ES6+ Features',
    difficulty: 'Beginner',
    description: 'Extract values from arrays using destructuring syntax.',
    example: `const [first, second, ...rest] = [1, 2, 3, 4, 5]
console.log(first)  // 1
console.log(rest)   // [3, 4, 5]`,
    keyPoints: [
      'Use square brackets to destructure arrays',
      'Rest operator (...) collects remaining elements',
      'Can skip elements with empty slots [a, , c]'
    ],
    tags: ['ES6', 'Arrays', 'Destructuring']
  },
  {
    id: '2',
    title: 'Promise Chaining',
    category: 'Async JavaScript',
    difficulty: 'Intermediate',
    description: 'Handle asynchronous operations with promise chains.',
    example: `fetch('/api/user')
  .then(response => response.json())
  .then(user => fetch(\`/api/posts/\${user.id}\`))
  .then(response => response.json())
  .catch(error => console.error(error))`,
    keyPoints: [
      'Each .then() returns a new promise',
      'Chain multiple async operations',
      'Handle errors with .catch()'
    ],
    tags: ['Promises', 'Async', 'API']
  },
  {
    id: '3',
    title: 'Event Delegation',
    category: 'DOM Manipulation',
    difficulty: 'Intermediate',
    description: 'Handle events efficiently using event bubbling.',
    example: `document.querySelector('.list').addEventListener('click', (e) => {
  if (e.target.classList.contains('item')) {
    console.log('Item clicked:', e.target.textContent)
  }
})`,
    keyPoints: [
      'Attach one listener to parent element',
      'Check event.target to identify clicked element',
      'More efficient than individual listeners'
    ],
    tags: ['DOM', 'Events', 'Performance']
  },
  {
    id: '4',
    title: 'Debouncing Function',
    category: 'Algorithms',
    difficulty: 'Advanced',
    description: 'Limit function execution frequency for performance.',
    example: `function debounce(func, delay) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

const search = debounce((query) => {
  console.log('Searching:', query)
}, 300)`,
    keyPoints: [
      'Delays function execution until after delay',
      'Cancels previous timeout on each call',
      'Common for search inputs and scroll handlers'
    ],
    tags: ['Performance', 'Functions', 'Timing']
  },
  {
    id: '5',
    title: 'Module Pattern',
    category: 'Object Patterns',
    difficulty: 'Intermediate',
    description: 'Create private and public methods using closures.',
    example: `const UserModule = (function() {
  let privateData = {}
  
  return {
    setUser(user) {
      privateData = { ...user }
    },
    getName() {
      return privateData.name
    }
  }
})()`,
    keyPoints: [
      'IIFE creates private scope',
      'Return object exposes public interface',
      'Private variables are not accessible outside'
    ],
    tags: ['Modules', 'Closures', 'Patterns']
  },
  {
    id: '6',
    title: 'Async/Await Pattern',
    category: 'Async JavaScript',
    difficulty: 'Intermediate',
    description: 'Write cleaner asynchronous code with async/await.',
    example: `async function fetchUserData(userId) {
  try {
    const user = await fetch(\`/api/users/\${userId}\`)
    const userData = await user.json()
    return userData
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw error
  }
}`,
    keyPoints: [
      'async functions always return promises',
      'await pauses execution until promise resolves',
      'Use try/catch for error handling'
    ],
    tags: ['Async', 'Promises', 'Modern JS']
  }
]

const currentChallenge: Challenge = {
  code: `// Fix this function to properly filter and map
const numbers = [1, 2, 3, 4, 5, 6]
const result = numbers
  .filter(n => n % 2 === 0)
  .map(n => n * 2)

console.log(result)`,
  expected: '[4, 8, 12]'
}

const filteredScenarios = computed(() => {
  if (activeCategory.value === 'All') {
    return scenarios
  }
  return scenarios.filter(scenario => scenario.category === activeCategory.value)
})

const runChallenge = () => {
  try {
    // Simulate running the code
    const numbers = [1, 2, 3, 4, 5, 6]
    const result = numbers
      .filter(n => n % 2 === 0)
      .map(n => n * 2)
    
    challengeOutput.value = JSON.stringify(result)
  } catch (error) {
    challengeOutput.value = `Error: ${error.message}`
  }
}
</script>