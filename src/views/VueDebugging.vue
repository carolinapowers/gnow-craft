<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Vue.js Component Debugging</h1>
        <p class="text-gray-600">Practice debugging Vue components with real-world scenarios</p>
        
        <!-- Scenario Selector -->
        <div class="mt-4 flex flex-wrap gap-2">
          <button 
            v-for="scenario in scenarios" 
            :key="scenario.id"
            @click="selectScenario(scenario.id)"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              currentScenario.id === scenario.id 
                ? 'bg-golf-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            ]"
          >
            {{ scenario.title }}
          </button>
        </div>
      </div>

      <!-- Main Practice Area -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px]">
        <!-- Left Side - Code Editor -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col">
          <div class="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-xl">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold text-gray-900">{{ currentScenario.title }}</h3>
              <div class="flex items-center gap-2">
                <button 
                  @click="resetCode"
                  class="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  Reset
                </button>
                <button 
                  @click="runCode"
                  :disabled="isCompiling"
                  :class="[
                    'px-3 py-1 text-xs rounded transition-colors',
                    isCompiling 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-golf-600 text-white hover:bg-golf-700'
                  ]"
                >
                  {{ isCompiling ? 'Compiling...' : 'Run Code' }}
                </button>
              </div>
            </div>
            <p class="text-sm text-gray-600 mt-1">{{ currentScenario.description }}</p>
          </div>
          
          <div class="flex-1 relative">
            <textarea
              v-model="currentCode"
              class="w-full h-full resize-none font-mono text-sm p-4 border-none outline-none bg-gray-900 text-green-400"
              spellcheck="false"
              @input="onCodeChange"
              rows="25"
            ></textarea>
          </div>
        </div>

        <!-- Right Side - Preview & Console -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col">
          <!-- Tab Navigation -->
          <div class="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-xl">
            <div class="flex space-x-1">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  activeTab === tab.id
                    ? 'bg-white text-golf-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                ]"
              >
                {{ tab.label }}
                <span v-if="tab.id === 'console' && consoleErrors.length > 0" 
                      class="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                  {{ consoleErrors.length }}
                </span>
              </button>
            </div>
          </div>

          <!-- Tab Content -->
          <div class="flex-1 overflow-hidden">
            <!-- Preview Tab -->
            <div v-show="activeTab === 'preview'" class="h-full p-4">
              <div class="h-full border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
                <div v-if="compilationError" class="text-center">
                  <div class="text-red-500 text-6xl mb-4">⚠️</div>
                  <h3 class="text-lg font-semibold text-red-600 mb-2">Compilation Error</h3>
                  <pre class="text-sm text-left bg-red-50 p-3 rounded border text-red-800 max-w-md">{{ compilationError }}</pre>
                </div>
                <div v-else-if="!compiledComponent && !isCompiling" class="text-center text-gray-400">
                  <div class="text-4xl mb-2">🔧</div>
                  <p>Click "Run Code" to compile and preview</p>
                </div>
                <div v-else-if="isCompiling" class="text-center text-gray-400">
                  <div class="text-4xl mb-2 animate-spin">⚙️</div>
                  <p>Compiling component...</p>
                </div>
                <div v-else class="text-center text-green-600">
                  <div class="text-4xl mb-2">✅</div>
                  <p>Component compiled successfully!</p>
                  <p class="text-sm text-gray-600 mt-1">Switch to Browser tab to see it render</p>
                </div>
              </div>
            </div>

            <!-- Console Tab -->
            <div v-show="activeTab === 'console'" class="h-full">
              <div class="h-full bg-gray-900 text-green-400 font-mono text-sm overflow-auto p-4">
                <div v-for="(log, index) in consoleLogs" :key="index" 
                     :class="['mb-1', logTypeClass(log.type)]">
                  <span class="text-gray-500">[{{ formatTime(log.timestamp) }}]</span>
                  <span class="ml-2">{{ log.message }}</span>
                </div>
                <div v-if="consoleLogs.length === 0" class="text-gray-500">
                  Console output will appear here...
                </div>
              </div>
            </div>

            <!-- Browser Tab -->
            <div v-show="activeTab === 'browser'" class="h-full p-4">
              <div class="h-full border border-gray-200 rounded-lg bg-white overflow-auto">
                <div class="p-4">
                  <div v-if="runtimeError" class="text-center py-8">
                    <div class="text-red-500 text-4xl mb-2">❌</div>
                    <h3 class="text-lg font-semibold text-red-600 mb-2">Runtime Error</h3>
                    <pre class="text-sm text-left bg-red-50 p-3 rounded border text-red-800">{{ runtimeError }}</pre>
                  </div>
                  <div v-else-if="!compiledComponent" class="text-center py-8 text-gray-400">
                    <div class="text-4xl mb-2">🌐</div>
                    <p>Compile component first to see it render</p>
                  </div>
                  <div v-else class="space-y-4">
                    <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg border">
                      <h4 class="font-semibold text-blue-900">Live Component:</h4>
                      <div class="text-sm text-blue-700">
                        {{ compiledComponent ? 'Rendering' : 'Not compiled' }}
                      </div>
                    </div>
                    <!-- Dynamic Component Rendering -->
                    <div class="border rounded-lg p-4 bg-gray-50">
                      <div class="mb-2 text-xs text-gray-500">
                        Debug: Component = {{ !!compiledComponent }}, Error = {{ !!runtimeError }}
                      </div>
                      
                      <ErrorBoundary @error="handleRuntimeError">
                        <component 
                          v-if="compiledComponent" 
                          :is="compiledComponent"
                          :title="'Sample Title'"
                          :description="'This is a test description'"
                          :status="'active'"
                        />
                        <div v-else-if="!runtimeError" class="text-gray-500 text-sm">
                          No component to render
                        </div>
                      </ErrorBoundary>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Hints & Solutions -->
      <div class="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Need Help?</h3>
          <button 
            @click="showHints = !showHints"
            class="px-4 py-2 text-sm bg-golf-100 text-golf-700 rounded-lg hover:bg-golf-200 transition-colors"
          >
            {{ showHints ? 'Hide Hints' : 'Show Hints' }}
          </button>
        </div>
        
        <div v-show="showHints" class="space-y-3">
          <div v-for="(hint, index) in currentScenario.hints" :key="index" 
               class="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div class="text-blue-500 font-semibold text-sm">{{ index + 1 }}.</div>
            <p class="text-blue-800 text-sm">{{ hint }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineComponent, markRaw, h } from 'vue'
import { compileVueComponent } from '../utils/vue-compiler'

interface Scenario {
  id: string
  title: string
  description: string
  code: string
  hints: string[]
  expectedFixes: string[]
}

// Error Boundary Component
const ErrorBoundary = defineComponent({
  emits: ['error'],
  setup(_, { emit, slots }) {
    const hasError = ref(false)
    const error = ref<Error | null>(null)

    const resetError = () => {
      hasError.value = false
      error.value = null
    }

    return () => {
      if (hasError.value) {
        return h('div', { 
          class: 'text-red-600 p-4 bg-red-50 rounded border' 
        }, [
          h('p', { class: 'font-semibold' }, 'Component Error:'),
          h('pre', { class: 'text-sm mt-2 whitespace-pre-wrap' }, error.value?.message || 'Unknown error'),
          h('button', {
            class: 'mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700',
            onClick: resetError
          }, 'Reset')
        ])
      }

      try {
        return slots.default?.()
      } catch (err: any) {
        hasError.value = true
        error.value = err
        emit('error', err)
        return null
      }
    }
  },
  errorCaptured(err: unknown) {
    console.error('ErrorBoundary caught:', err)
    return false
  }
})

const getReactivityCode = () => {
  return `<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Counter Component</h2>
    <div class="flex items-center gap-4">
      <button 
        @click="increment" 
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Count: {{ count }}
      </button>
      <button 
        @click="reset"
        class="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script setup>
let count = 0

function increment() {
  count++
  console.log('Count incremented to:', count)
}

function reset() {
  count = 0
  console.log('Count reset to:', count)
}
<\/script>`
}

const getPropValidationCode = () => {
  return `<template>
  <div class="p-4 border rounded-lg">
    <h3 class="text-lg font-semibold">{{ title }}</h3>
    <p class="text-gray-600">{{ description }}</p>
    <div class="mt-2">
      <span class="px-2 py-1 text-sm rounded" 
            :class="statusColor">
        {{ status }}
      </span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['title', 'description', 'status'])

const statusColor = computed(() => {
  switch (props.status) {
    case 'active': return 'bg-green-100 text-green-800'
    case 'inactive': return 'bg-gray-100 text-gray-800'
    case 'error': return 'bg-red-100 text-red-800'
    default: return 'bg-blue-100 text-blue-800'
  }
})
<\/script>`
}

const getLifecycleCode = () => {
  return `<template>
  <div class="p-4">
    <h2 ref="titleRef" class="text-xl font-bold mb-4">Dynamic Title</h2>
    <input
      ref="inputRef"
      v-model="inputValue"
      class="border p-2 rounded w-full"
      placeholder="Type something..."
    />
    <p class="mt-2 text-sm text-gray-600">
      Title width: {{ titleWidth }}px
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const titleRef = ref(null)
const inputRef = ref(null)
const inputValue = ref('')
const titleWidth = ref(0)

// This runs immediately when component is created
console.log('Getting title width...')
titleWidth.value = titleRef.value?.offsetWidth || 0

onMounted(() => {
  console.log('Component mounted')
  inputRef.value?.focus()
})
<\/script>`
}

const getWatcherCode = () => {
  return `<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">User Search</h2>
    <input
      v-model="searchQuery"
      class="border p-2 rounded w-full mb-4"
      placeholder="Search users..."
    />
    <div v-if="isLoading" class="text-gray-500">Searching...</div>
    <div v-else-if="results.length" class="space-y-2">
      <div v-for="user in results" :key="user.id"
           class="p-3 border rounded bg-gray-50">
        {{ user.name }}
      </div>
    </div>
    <p class="text-sm text-gray-500 mt-2">API calls made: {{ apiCallCount }}</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const searchQuery = ref('')
const results = ref([])
const isLoading = ref(false)
const apiCallCount = ref(0)

// Mock API call
async function searchUsers(query) {
  apiCallCount.value++
  await new Promise(resolve => setTimeout(resolve, 300))
  return [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' }
  ].filter(u => u.name.toLowerCase().includes(query.toLowerCase()))
}

// BUG: This will make an API call on EVERY keystroke
watch(searchQuery, async (newQuery) => {
  if (!newQuery) {
    results.value = []
    return
  }
  isLoading.value = true
  results.value = await searchUsers(newQuery)
  isLoading.value = false
})
<\/script>`
}

const getComputedCode = () => {
  return `<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Shopping Cart</h2>
    <div v-for="item in cart" :key="item.id" class="flex justify-between mb-2">
      <span>{{ item.name }} (x{{ item.quantity }})</span>
      <span>\${{ item.price * item.quantity }}</span>
    </div>
    <div class="border-t mt-4 pt-4">
      <div class="flex justify-between font-bold">
        <span>Total:</span>
        <span>\${{ cartTotal() }}</span>
      </div>
      <p class="text-xs text-gray-500 mt-2">
        Calculation count: {{ calculationCount }}
      </p>
    </div>
    <button
      @click="addRandomItem"
      class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
    >
      Add Item
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const cart = ref([
  { id: 1, name: 'Golf Club', price: 299, quantity: 1 },
  { id: 2, name: 'Golf Balls', price: 49, quantity: 2 }
])
const calculationCount = ref(0)

// BUG: Function instead of computed - recalculates on every render
function cartTotal() {
  calculationCount.value++
  return cart.value.reduce((sum, item) =>
    sum + (item.price * item.quantity), 0
  )
}

function addRandomItem() {
  const items = ['Tees', 'Glove', 'Towel']
  cart.value.push({
    id: Date.now(),
    name: items[Math.floor(Math.random() * items.length)],
    price: Math.floor(Math.random() * 50) + 10,
    quantity: 1
  })
}
<\/script>`
}

const getVModelCode = () => {
  return `<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">User Profile</h2>
    <CustomInput v-model="username" label="Username" />
    <CustomInput v-model="email" label="Email" />
    <p class="mt-4 text-sm">Username: {{ username }}</p>
    <p class="text-sm">Email: {{ email }}</p>
  </div>
</template>

<script setup>
import { ref, defineComponent, h } from 'vue'

const username = ref('')
const email = ref('')

// BUG: Custom component doesn't properly implement v-model
const CustomInput = defineComponent({
  props: ['label', 'value'],
  setup(props, { emit }) {
    return () => h('div', { class: 'mb-3' }, [
      h('label', { class: 'block text-sm font-medium mb-1' }, props.label),
      h('input', {
        value: props.value,
        onInput: (e) => emit('input', e.target.value),
        class: 'border p-2 rounded w-full'
      })
    ])
  }
})
<\/script>`
}

const getEventModifierCode = () => {
  return `<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Tee Time Booking</h2>
    <form @submit="handleSubmit" class="space-y-4">
      <input
        v-model="playerName"
        class="border p-2 rounded w-full"
        placeholder="Player name"
      />
      <input
        v-model="teeTime"
        type="time"
        class="border p-2 rounded w-full"
      />
      <button
        type="submit"
        class="px-4 py-2 bg-golf-600 text-white rounded"
      >
        Book Tee Time
      </button>
    </form>
    <p v-if="bookingConfirmed" class="mt-4 text-green-600">
      Booking confirmed!
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const playerName = ref('')
const teeTime = ref('')
const bookingConfirmed = ref(false)

// BUG: Form will refresh the page on submit
function handleSubmit() {
  console.log('Booking:', playerName.value, teeTime.value)
  bookingConfirmed.value = true
}
<\/script>`
}

const getArrayMutationCode = () => {
  return `<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Leaderboard</h2>
    <div class="space-y-2 mb-4">
      <div v-for="(player, index) in leaderboard" :key="player.id"
           class="flex justify-between p-2 border rounded">
        <span>{{ index + 1 }}. {{ player.name }}</span>
        <span>{{ player.score }}</span>
      </div>
    </div>
    <button
      @click="sortByScore"
      class="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Sort by Score
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const leaderboard = ref([
  { id: 1, name: 'Tiger Woods', score: 68 },
  { id: 2, name: 'Phil Mickelson', score: 71 },
  { id: 3, name: 'Rory McIlroy', score: 69 }
])

// BUG: Array sort mutates in place but doesn't trigger reactivity properly
function sortByScore() {
  leaderboard.value.sort((a, b) => a.score - b.score)
  console.log('Sorted:', leaderboard.value)
}
<\/script>`
}

const getAsyncDataCode = () => {
  return `<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Course Details</h2>
    <div v-if="course">
      <h3 class="text-lg font-semibold">{{ course.name }}</h3>
      <p>Par: {{ course.par }}</p>
      <p>Length: {{ course.length }} yards</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const course = ref(null)

// BUG: Async data fetch not in proper lifecycle hook
async function loadCourse() {
  const response = await new Promise(resolve =>
    setTimeout(() => resolve({
      name: 'Pebble Beach',
      par: 72,
      length: 6828
    }), 100)
  )
  course.value = response
}

// This won't run automatically!
loadCourse()
<\/script>`
}

const scenarios: Scenario[] = [
  {
    id: 'reactive-bug',
    title: 'Reactivity Issue',
    description: 'The counter is not updating when clicked. Find and fix the reactivity bug.',
    code: getReactivityCode(),
    hints: [
      'Vue 3 composition API requires reactive references for reactivity',
      'Check if the count variable is properly declared as reactive',
      'Use ref() or reactive() to make data reactive',
      'The console shows the value is changing, but the template is not updating'
    ],
    expectedFixes: ['ref()', 'reactive()']
  },
  {
    id: 'prop-validation',
    title: 'Prop Validation Error',
    description: 'The component is receiving invalid props. Fix the prop validation and handling.',
    code: getPropValidationCode(),
    hints: [
      'Props need proper type validation in Vue 3',
      'The description prop should be a string, not a number',
      'The status prop should have restricted allowed values',
      'Use defineProps with proper TypeScript types or runtime validation'
    ],
    expectedFixes: ['type validation', 'prop types', 'validator']
  },
  {
    id: 'lifecycle-bug',
    title: 'Lifecycle Hook Issue',
    description: 'The component is trying to access DOM elements before they are rendered.',
    code: getLifecycleCode(),
    hints: [
      'DOM elements are not available immediately when script setup runs',
      'Template refs are null until the component is mounted',
      'Move DOM operations to the appropriate lifecycle hook',
      'Consider using nextTick() for DOM updates'
    ],
    expectedFixes: ['onMounted', 'nextTick', 'lifecycle timing']
  },
  {
    id: 'watcher-performance',
    title: 'Watcher Performance',
    description: 'Search makes too many API calls. Implement debouncing to optimize performance.',
    code: getWatcherCode(),
    hints: [
      'Watch is triggering on every keystroke - very inefficient',
      'Consider using watchDebounced or implementing manual debouncing',
      'You could use a computed ref with a timeout',
      'Vue 3.3+ has built-in support for debouncing with vueuse'
    ],
    expectedFixes: ['debounce', 'watchDebounced', 'setTimeout']
  },
  {
    id: 'computed-vs-method',
    title: 'Computed vs Method',
    description: 'Cart total is recalculating too often. Fix the performance issue.',
    code: getComputedCode(),
    hints: [
      'Methods in templates recalculate on every render',
      'Computed properties cache their results',
      'Watch the calculation count increase rapidly',
      'Convert cartTotal() function to a computed property'
    ],
    expectedFixes: ['computed', 'computed property', 'caching']
  },
  {
    id: 'v-model-bug',
    title: 'Custom v-model',
    description: 'Custom input component does not work with v-model. Fix the binding.',
    code: getVModelCode(),
    hints: [
      'Vue 3 changed v-model prop name from "value" to "modelValue"',
      'Vue 3 changed v-model event from "input" to "update:modelValue"',
      'The component is using Vue 2 v-model pattern',
      'Update both the prop name and the emit event name'
    ],
    expectedFixes: ['modelValue', 'update:modelValue', 'v-model']
  },
  {
    id: 'event-modifier',
    title: 'Event Modifier Missing',
    description: 'Form submits and refreshes the page. Prevent the default behavior.',
    code: getEventModifierCode(),
    hints: [
      'Forms have default browser submit behavior that refreshes the page',
      'Vue has event modifiers to prevent default behavior',
      'Use .prevent modifier on the @submit event',
      'Alternative: call event.preventDefault() in the handler'
    ],
    expectedFixes: ['.prevent', '@submit.prevent', 'preventDefault']
  },
  {
    id: 'array-mutation',
    title: 'Array Reactivity',
    description: 'Leaderboard does not update when sorted. Fix the array mutation.',
    code: getArrayMutationCode(),
    hints: [
      'Array.sort() mutates the array in place',
      'Vue reactivity tracks the ref, not mutations to its contents',
      'You need to trigger reactivity by reassigning the value',
      'Create a new sorted array instead of mutating the original'
    ],
    expectedFixes: ['spread operator', 'new array', '[...array].sort()']
  },
  {
    id: 'async-lifecycle',
    title: 'Async Data Loading',
    description: 'Course data is not loading. Fix the async data fetch timing.',
    code: getAsyncDataCode(),
    hints: [
      'Calling loadCourse() at top level runs immediately, before component mounts',
      'Async operations should be in lifecycle hooks',
      'Use onMounted() to run code after component is mounted',
      'Top-level await in script setup is supported but requires Suspense wrapper'
    ],
    expectedFixes: ['onMounted', 'lifecycle hook', 'async']
  }
]

const currentScenarioId = ref('reactive-bug')
const currentCode = ref('')
const activeTab = ref('preview')
const showHints = ref(false)
const consoleLogs = ref<Array<{type: string; message: string; timestamp: Date}>>([])
const compiledComponent = ref<any>(null)
const compilationError = ref('')
const runtimeError = ref('')
const isCompiling = ref(false)

const tabs = [
  { id: 'preview', label: 'Preview' },
  { id: 'console', label: 'Console' },
  { id: 'browser', label: 'Browser' }
]

const currentScenario = computed(() => 
  scenarios.find(s => s.id === currentScenarioId.value) || scenarios[0]
)

const consoleErrors = computed(() => 
  consoleLogs.value.filter(log => log.type === 'error')
)

function selectScenario(scenarioId: string) {
  currentScenarioId.value = scenarioId
  currentCode.value = currentScenario.value.code
  resetOutput()
}

function resetCode() {
  currentCode.value = currentScenario.value.code
  resetOutput()
}

function resetOutput() {
  consoleLogs.value = []
  compiledComponent.value = null
  compilationError.value = ''
  runtimeError.value = ''
  isCompiling.value = false
}

function addConsoleLog(type: string, message: string) {
  consoleLogs.value.push({
    type,
    message,
    timestamp: new Date()
  })
}

function runCode() {
  resetOutput()
  isCompiling.value = true
  addConsoleLog('info', 'Starting compilation...')
  
  try {
    // Compile the Vue component
    const result = compileVueComponent(currentCode.value, addConsoleLog)
    
    if (result.error) {
      addConsoleLog('error', `Compilation failed: ${result.error}`)
      compilationError.value = result.error
      activeTab.value = 'preview'
    } else {
      compiledComponent.value = markRaw(result.component)
      addConsoleLog('success', 'Component compiled successfully!')
      // Switch to browser tab to show the result
      activeTab.value = 'browser'
    }
  } catch (error: any) {
    addConsoleLog('error', `Unexpected error: ${error.message}`)
    compilationError.value = error.message
    activeTab.value = 'preview'
  } finally {
    isCompiling.value = false
  }
}


function handleRuntimeError(error: Error) {
  runtimeError.value = error.message
  addConsoleLog('error', `Runtime error: ${error.message}`)
}

function onCodeChange() {
  // Clear previous compilation when user starts typing
  if (compiledComponent.value) {
    compiledComponent.value = null
    compilationError.value = ''
    runtimeError.value = ''
  }
}

function logTypeClass(type: string): string {
  switch (type) {
    case 'error': return 'text-red-400'
    case 'warn': return 'text-yellow-400'
    case 'success': return 'text-green-400'
    default: return 'text-gray-300'
  }
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  })
}

// Initialize
onMounted(() => {
  selectScenario(currentScenarioId.value)
})
</script>