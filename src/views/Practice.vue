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
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Practice Arena</h1>
      
      <div class="grid lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Code Editor</h2>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select Template
            </label>
            <select
              v-model="selectedTemplate"
              @change="loadTemplate"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="component">Basic Component</option>
              <option value="composition">Composition API</option>
              <option value="reactive">Reactive Data</option>
              <option value="lifecycle">Lifecycle Hooks</option>
              <option value="props-emit">Props & Emits</option>
            </select>
          </div>
          
          <div class="relative">
            <textarea
              v-model="code"
              class="w-full h-96 font-mono text-sm p-4 bg-gray-900 text-green-400 rounded-lg"
              spellcheck="false"
            ></textarea>
          </div>
          
          <div class="mt-4 flex gap-3">
            <button
              @click="runCode"
              class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Run Code
            </button>
            <button
              @click="clearCode"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Output & Console</h2>
          
          <div class="mb-4">
            <div class="flex gap-2 border-b">
              <button
                @click="activeTab = 'preview'"
                :class="[
                  'px-4 py-2 font-medium transition-colors',
                  activeTab === 'preview'
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-gray-600 hover:text-gray-800'
                ]"
              >
                Preview
              </button>
              <button
                @click="activeTab = 'console'"
                :class="[
                  'px-4 py-2 font-medium transition-colors',
                  activeTab === 'console'
                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                    : 'text-gray-600 hover:text-gray-800'
                ]"
              >
                Console
              </button>
            </div>
          </div>
          
          <div v-if="activeTab === 'preview'" class="h-96 border rounded-lg p-4 overflow-auto">
            <div v-if="output" v-html="output"></div>
            <div v-else class="text-gray-400">
              Run your code to see the preview here
            </div>
          </div>
          
          <div v-if="activeTab === 'console'" class="h-96 bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm overflow-auto">
            <div v-for="(log, index) in consoleLogs" :key="index">
              <span class="text-gray-500">{{ log.time }}</span>
              <span :class="getLogClass(log.type)"> {{ log.message }}</span>
            </div>
            <div v-if="consoleLogs.length === 0" class="text-gray-500">
              Console output will appear here
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-8 bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Quick References</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div>
            <h3 class="font-medium text-gray-700 mb-2">Composition API</h3>
            <ul class="space-y-1 text-sm text-gray-600">
              <li><code class="bg-gray-100 px-1">ref()</code> - Reactive reference</li>
              <li><code class="bg-gray-100 px-1">reactive()</code> - Reactive object</li>
              <li><code class="bg-gray-100 px-1">computed()</code> - Computed property</li>
              <li><code class="bg-gray-100 px-1">watch()</code> - Watch for changes</li>
              <li><code class="bg-gray-100 px-1">onMounted()</code> - Lifecycle hook</li>
            </ul>
          </div>
          
          <div>
            <h3 class="font-medium text-gray-700 mb-2">Template Directives</h3>
            <ul class="space-y-1 text-sm text-gray-600">
              <li><code class="bg-gray-100 px-1">v-if</code> - Conditional rendering</li>
              <li><code class="bg-gray-100 px-1">v-for</code> - List rendering</li>
              <li><code class="bg-gray-100 px-1">v-model</code> - Two-way binding</li>
              <li><code class="bg-gray-100 px-1">v-on / @</code> - Event handling</li>
              <li><code class="bg-gray-100 px-1">v-bind / :</code> - Attribute binding</li>
            </ul>
          </div>
          
          <div>
            <h3 class="font-medium text-gray-700 mb-2">Component Patterns</h3>
            <ul class="space-y-1 text-sm text-gray-600">
              <li><code class="bg-gray-100 px-1">defineProps()</code> - Define props</li>
              <li><code class="bg-gray-100 px-1">defineEmits()</code> - Define events</li>
              <li><code class="bg-gray-100 px-1">provide/inject</code> - Dependency injection</li>
              <li><code class="bg-gray-100 px-1">&lt;slot&gt;</code> - Content distribution</li>
              <li><code class="bg-gray-100 px-1">&lt;teleport&gt;</code> - Portal rendering</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedTemplate = ref('component')
const code = ref('')
const output = ref('')
const activeTab = ref('preview')
const consoleLogs = ref<Array<{ time: string; type: string; message: string }>>([])

const templates = {
  component: `<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">{{ title }}</h2>
    <button 
      @click="increment"
      class="px-4 py-2 bg-emerald-600 text-white rounded"
    >
      Count: {{ count }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('My Component')
const count = ref(0)

const increment = () => {
  count.value++
  console.log('Count is now:', count.value)
}
<\/script>`,
  
  composition: `<script setup>
import { ref, reactive, computed, watch } from 'vue'

// Refs for primitive values
const name = ref('Golf Player')
const score = ref(72)

// Reactive for objects
const player = reactive({
  name: 'Tiger Woods',
  handicap: 0,
  rounds: []
})

// Computed property
const underPar = computed(() => score.value < 72)

// Watcher
watch(score, (newScore, oldScore) => {
  console.log(\`Score changed from \${oldScore} to \${newScore}\`)
})

// Method
const addRound = (roundScore) => {
  player.rounds.push(roundScore)
}
<\/script>`,
  
  reactive: `<template>
  <div class="p-4">
    <div class="mb-4">
      <input
        v-model="searchQuery"
        placeholder="Search courses..."
        class="px-3 py-2 border rounded"
      />
    </div>
    
    <div class="space-y-2">
      <div
        v-for="course in filteredCourses"
        :key="course.id"
        class="p-2 bg-gray-100 rounded"
      >
        {{ course.name }} - {{ course.location }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')

const courses = ref([
  { id: 1, name: 'Pebble Beach', location: 'California' },
  { id: 2, name: 'St. Andrews', location: 'Scotland' },
  { id: 3, name: 'Augusta National', location: 'Georgia' }
])

const filteredCourses = computed(() => {
  return courses.value.filter(course =>
    course.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
<\/script>`,
  
  lifecycle: `<script setup>
import { ref, onMounted, onUpdated, onUnmounted } from 'vue'

const data = ref(null)
const timer = ref(0)
let interval

onMounted(() => {
  console.log('Component mounted!')
  // Simulate API call
  setTimeout(() => {
    data.value = 'Data loaded from API'
  }, 1000)
  
  // Start timer
  interval = setInterval(() => {
    timer.value++
  }, 1000)
})

onUpdated(() => {
  console.log('Component updated!')
})

onUnmounted(() => {
  console.log('Component unmounted!')
  clearInterval(interval)
})
<\/script>`,
  
  'props-emit': `<template>
  <div class="p-4 border rounded">
    <h3 class="font-bold mb-2">{{ title }}</h3>
    <p class="mb-4">Players: {{ players }}</p>
    
    <button
      @click="handleBook"
      class="px-4 py-2 bg-emerald-600 text-white rounded"
    >
      Book Tee Time
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  players: {
    type: Number,
    default: 2
  }
})

const emit = defineEmits(['book', 'cancel'])

const handleBook = () => {
  emit('book', {
    title: props.title,
    players: props.players,
    timestamp: new Date()
  })
}
<\/script>`
}

const loadTemplate = () => {
  code.value = templates[selectedTemplate.value] || ''
}

const runCode = () => {
  addConsoleLog('info', 'Running code...')
  
  try {
    // Simple validation
    if (!code.value.includes('<template>') || !code.value.includes('<script')) {
      throw new Error('Invalid Vue component structure')
    }
    
    output.value = `
      <div class="text-center text-gray-500">
        <p class="mb-2">✅ Code is valid!</p>
        <p class="text-sm">Note: Full component rendering is simulated in this practice environment.</p>
        <p class="text-sm mt-2">In a real interview, you would see the actual component output here.</p>
      </div>
    `
    addConsoleLog('success', 'Code executed successfully!')
  } catch (error) {
    output.value = `
      <div class="text-red-500">
        <p class="font-bold">Error:</p>
        <p>${error.message}</p>
      </div>
    `
    addConsoleLog('error', error.message)
  }
}

const clearCode = () => {
  code.value = ''
  output.value = ''
  consoleLogs.value = []
}

const addConsoleLog = (type: string, message: string) => {
  const time = new Date().toLocaleTimeString()
  consoleLogs.value.push({ time, type, message })
}

const getLogClass = (type: string) => {
  switch (type) {
    case 'error':
      return 'text-red-400'
    case 'success':
      return 'text-green-400'
    case 'warning':
      return 'text-yellow-400'
    default:
      return 'text-gray-300'
  }
}

// Load initial template
loadTemplate()
</script>