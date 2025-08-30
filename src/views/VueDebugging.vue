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
                  class="px-3 py-1 text-xs bg-golf-600 text-white rounded hover:bg-golf-700 transition-colors"
                >
                  Run Code
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
                <div v-if="previewError" class="text-center">
                  <div class="text-red-500 text-6xl mb-4">⚠️</div>
                  <h3 class="text-lg font-semibold text-red-600 mb-2">Component Error</h3>
                  <p class="text-sm text-gray-600 max-w-md">{{ previewError }}</p>
                </div>
                <div v-else-if="!previewContent" class="text-center text-gray-400">
                  <div class="text-4xl mb-2">🔧</div>
                  <p>Click "Run Code" to see preview</p>
                </div>
                <div v-else v-html="previewContent" class="w-full"></div>
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
                  <div v-if="browserError" class="text-center py-8">
                    <div class="text-red-500 text-4xl mb-2">❌</div>
                    <h3 class="text-lg font-semibold text-red-600 mb-2">Runtime Error</h3>
                    <pre class="text-sm text-left bg-red-50 p-3 rounded border text-red-800">{{ browserError }}</pre>
                  </div>
                  <div v-else-if="!mockPreview" class="text-center py-8 text-gray-400">
                    <div class="text-4xl mb-2">🌐</div>
                    <p>Component will render here</p>
                  </div>
                  <div v-else class="space-y-4">
                    <div class="p-4 border rounded-lg bg-blue-50">
                      <h4 class="font-semibold text-blue-900 mb-2">Mock Component Output:</h4>
                      <div v-html="mockPreview"></div>
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
import { ref, computed, onMounted } from 'vue'

interface Scenario {
  id: string
  title: string
  description: string
  code: string
  hints: string[]
  expectedFixes: string[]
}

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
  }
]

const currentScenarioId = ref('reactive-bug')
const currentCode = ref('')
const activeTab = ref('preview')
const showHints = ref(false)
const consoleLogs = ref<Array<{type: string; message: string; timestamp: Date}>>([])
const previewContent = ref('')
const previewError = ref('')
const browserError = ref('')
const mockPreview = ref('')

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
  previewContent.value = ''
  previewError.value = ''
  browserError.value = ''
  mockPreview.value = ''
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
  addConsoleLog('info', 'Running code...')
  
  try {
    // Analyze the code for common issues
    const analysis = analyzeCode(currentCode.value)
    
    if (analysis.errors.length > 0) {
      analysis.errors.forEach(error => {
        addConsoleLog('error', error)
      })
      previewError.value = analysis.errors[0]
      return
    }
    
    // Generate mock preview based on the scenario
    generateMockPreview()
    
    addConsoleLog('success', 'Component compiled successfully')
    previewContent.value = '<div class="text-green-600">✅ Component ready - switch to Browser tab to see it render</div>'
    
  } catch (error: any) {
    addConsoleLog('error', error.message)
    previewError.value = error.message
    browserError.value = error.stack || error.message
  }
}

function analyzeCode(code: string) {
  const errors: string[] = []
  
  // Check for common issues based on current scenario
  if (currentScenarioId.value === 'reactive-bug') {
    if (!code.includes('ref(') && !code.includes('reactive(')) {
      errors.push('Missing reactive declaration - use ref() or reactive()')
    }
    if (code.includes('let count = 0') && !code.includes('ref(0)')) {
      errors.push('Variable "count" is not reactive - wrap with ref()')
    }
  }
  
  if (currentScenarioId.value === 'lifecycle-bug') {
    if (code.includes('titleRef.value?.offsetWidth') && !code.includes('onMounted')) {
      errors.push('DOM access outside lifecycle hook - move to onMounted()')
    }
  }
  
  if (currentScenarioId.value === 'prop-validation') {
    if (code.includes("defineProps(['title'") && !code.includes('String')) {
      errors.push('Props need type validation - use proper prop types')
    }
  }
  
  return { errors }
}

function generateMockPreview() {
  switch (currentScenarioId.value) {
    case 'reactive-bug':
      if (currentCode.value.includes('ref(0)')) {
        mockPreview.value = `
          <div class="p-4">
            <h2 class="text-xl font-bold mb-4">Counter Component</h2>
            <div class="flex items-center gap-4">
              <button class="px-4 py-2 bg-blue-500 text-white rounded">Count: 5</button>
              <button class="px-3 py-2 bg-gray-500 text-white rounded">Reset</button>
            </div>
          </div>
        `
      } else {
        browserError.value = 'Count is not reactive - clicks don\'t update the display'
        mockPreview.value = `
          <div class="p-4">
            <div class="bg-red-50 border border-red-200 rounded p-3">
              <p class="text-red-800">❌ Counter not updating - count stays at 0</p>
            </div>
          </div>
        `
      }
      break
    case 'prop-validation':
      mockPreview.value = `
        <div class="p-4 border rounded-lg">
          <h3 class="text-lg font-semibold">Sample Title</h3>
          <p class="text-gray-600">Sample description</p>
          <div class="mt-2">
            <span class="px-2 py-1 text-sm rounded bg-blue-100 text-blue-800">active</span>
          </div>
        </div>
      `
      break
    case 'lifecycle-bug':
      if (currentCode.value.includes('onMounted')) {
        mockPreview.value = `
          <div class="p-4">
            <h2 class="text-xl font-bold mb-4">Dynamic Title</h2>
            <input class="border p-2 rounded w-full" placeholder="Type something..." />
            <p class="mt-2 text-sm text-gray-600">Title width: 142px</p>
          </div>
        `
      } else {
        browserError.value = 'Cannot read properties of null (reading \'offsetWidth\')'
        mockPreview.value = `
          <div class="p-4">
            <div class="bg-red-50 border border-red-200 rounded p-3">
              <p class="text-red-800">❌ TypeError: Cannot read offsetWidth of null</p>
            </div>
          </div>
        `
      }
      break
  }
}

function onCodeChange() {
  // Could implement auto-run with debouncing here
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