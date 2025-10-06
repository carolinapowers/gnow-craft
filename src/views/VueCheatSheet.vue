<template>
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-4xl font-bold text-emerald-600 mb-8">Vue.js Cheat Sheet & Quick Tests</h1>
    
    <!-- Reactivity Tests -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-4">🔄 Reactivity</h2>
      <div class="grid md:grid-cols-2 gap-6">
        
        <!-- ref vs reactive -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-semibold">ref vs reactive</h3>
            <button @click="toggleCode('refReactive')" class="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              {{ showCode.refReactive ? 'Hide Code' : 'Show Code' }}
            </button>
          </div>
          <div class="space-y-2">
            <p>ref count: {{ refCount }}</p>
            <p>reactive state: {{ reactiveState.count }}</p>
            <div class="flex gap-2">
              <button @click="refCount++" class="btn-primary">Increment ref</button>
              <button @click="reactiveState.count++" class="btn-primary">Increment reactive</button>
            </div>
          </div>
          <div v-if="showCode.refReactive" class="mt-4 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre><code>// ref - for primitives and single values
const refCount = ref(0)
refCount.value++ // Need .value to access

// reactive - for objects
const reactiveState = reactive({ count: 0 })
reactiveState.count++ // Direct access</code></pre>
          </div>
        </div>

        <!-- Computed Properties -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-semibold">Computed Properties</h3>
            <button @click="toggleCode('computed')" class="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              {{ showCode.computed ? 'Hide Code' : 'Show Code' }}
            </button>
          </div>
          <input v-model="firstName" placeholder="First name" class="input mb-2">
          <input v-model="lastName" placeholder="Last name" class="input mb-2">
          <p>Full name: {{ fullName }}</p>
          <p>Computed called: {{ computedCallCount }} times</p>
          <div v-if="showCode.computed" class="mt-4 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre><code>const firstName = ref('')
const lastName = ref('')
const computedCallCount = ref(0)

const fullName = computed(() => {
  computedCallCount.value++
  return \`\${firstName.value} \${lastName.value}\`.trim()
})

// Cached until dependencies change</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- Component Communication -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-4">📡 Component Communication</h2>
      <div class="grid md:grid-cols-2 gap-6">
        
        <!-- Props & Emits -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-semibold">Props & Emits</h3>
            <button @click="toggleCode('propsEmits')" class="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              {{ showCode.propsEmits ? 'Hide Code' : 'Show Code' }}
            </button>
          </div>
          <CheatSheetChild
            :message="parentMessage"
            @update="handleChildUpdate"
          />
          <p class="mt-2">Parent message: {{ parentMessage }}</p>
          <p>Child said: {{ childResponse }}</p>
          <div v-if="showCode.propsEmits" class="mt-4 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre><code>// Parent
const parentMessage = ref('Hello from parent!')
const childResponse = ref('')

const handleChildUpdate = (value: string) => {
  childResponse.value = value
}

// Child Component
defineProps&lt;{ message: string }&gt;()
const emit = defineEmits&lt;{
  update: [value: string]
}&gt;()

emit('update', 'Response from child')</code></pre>
          </div>
        </div>

        <!-- v-model on Component -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-semibold">v-model on Component</h3>
            <button @click="toggleCode('vModel')" class="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              {{ showCode.vModel ? 'Hide Code' : 'Show Code' }}
            </button>
          </div>
          <CustomInput v-model="customValue" />
          <p class="mt-2">Value: {{ customValue }}</p>
          <div v-if="showCode.vModel" class="mt-4 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre><code>// Parent
const customValue = ref('')

// Child Component
const props = defineProps&lt;{
  modelValue: string
}&gt;()

const emit = defineEmits&lt;{
  'update:modelValue': [value: string]
}&gt;()

// Emit on input
emit('update:modelValue', newValue)</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- Lifecycle & Watchers -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-4">⏱️ Lifecycle & Watchers</h2>
      <div class="grid md:grid-cols-2 gap-6">
        
        <!-- Watch vs WatchEffect -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-semibold">watch vs watchEffect</h3>
            <button @click="toggleCode('watch')" class="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              {{ showCode.watch ? 'Hide Code' : 'Show Code' }}
            </button>
          </div>
          <input v-model.number="watchValue" type="number" class="input mb-2">
          <p>Value: {{ watchValue }}</p>
          <p>Doubled (watch): {{ watchDoubled }}</p>
          <p>Tripled (watchEffect): {{ watchTripled }}</p>
          <div v-if="showCode.watch" class="mt-4 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre><code>const watchValue = ref(1)
const watchDoubled = ref(2)
const watchTripled = ref(3)

// watch - explicit dependencies
watch(watchValue, (newVal) => {
  watchDoubled.value = newVal * 2
})

// watchEffect - auto-tracks dependencies
watchEffect(() => {
  watchTripled.value = watchValue.value * 3
})</code></pre>
          </div>
        </div>

        <!-- Template Refs -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-semibold">Template Refs</h3>
            <button @click="toggleCode('templateRef')" class="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              {{ showCode.templateRef ? 'Hide Code' : 'Show Code' }}
            </button>
          </div>
          <input ref="inputRef" placeholder="Focus me!" class="input mb-2">
          <button @click="focusInput" class="btn-primary">Focus Input</button>
          <p>Input value: {{ inputRefValue }}</p>
          <div v-if="showCode.templateRef" class="mt-4 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre><code>const inputRef = ref&lt;HTMLInputElement&gt;()
const inputRefValue = ref('')

const focusInput = () => {
  inputRef.value?.focus()
  inputRefValue.value = inputRef.value?.value || ''
}

// Template
&lt;input ref="inputRef" /&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- Directives -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-4">🎯 Directives</h2>
      <div class="grid md:grid-cols-2 gap-6">
        
        <!-- v-if vs v-show -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-semibold">v-if vs v-show</h3>
            <button @click="toggleCode('vIfShow')" class="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              {{ showCode.vIfShow ? 'Hide Code' : 'Show Code' }}
            </button>
          </div>
          <button @click="toggleVisibility" class="btn-primary mb-2">Toggle Both</button>
          <div v-if="isVisible" class="p-2 bg-blue-100 rounded">v-if (DOM removed)</div>
          <div v-show="isVisible" class="p-2 bg-green-100 rounded mt-2">v-show (display: none)</div>
          <div v-if="showCode.vIfShow" class="mt-4 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre><code>const isVisible = ref(true)

const toggleVisibility = () => {
  isVisible.value = !isVisible.value
}

// v-if - element removed from DOM
&lt;div v-if="isVisible"&gt;...&lt;/div&gt;

// v-show - display: none (stays in DOM)
&lt;div v-show="isVisible"&gt;...&lt;/div&gt;</code></pre>
          </div>
        </div>

        <!-- v-for with key -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-semibold">v-for with :key</h3>
            <button @click="toggleCode('vFor')" class="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              {{ showCode.vFor ? 'Hide Code' : 'Show Code' }}
            </button>
          </div>
          <button @click="shuffleItems" class="btn-primary mb-2">Shuffle</button>
          <ul>
            <li v-for="item in items" :key="item.id" class="flex items-center gap-2">
              <input type="checkbox">
              {{ item.name }}
            </li>
          </ul>
          <div v-if="showCode.vFor" class="mt-4 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre><code>const items = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
])

const shuffleItems = () => {
  items.value = [...items.value].sort(() => Math.random() - 0.5)
}

// Template - ALWAYS use unique :key
&lt;li v-for="item in items" :key="item.id"&gt;
  {{ item.name }}
&lt;/li&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- Composition API Patterns -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-4">🎨 Composition API Patterns</h2>
      <div class="grid md:grid-cols-2 gap-6">
        
        <!-- Composables -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-semibold">Custom Composable</h3>
            <button @click="toggleCode('composable')" class="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              {{ showCode.composable ? 'Hide Code' : 'Show Code' }}
            </button>
          </div>
          <p>Mouse X: {{ x }}</p>
          <p>Mouse Y: {{ y }}</p>
          <p>Counter: {{ counter }}</p>
          <button @click="increment" class="btn-primary">Increment</button>
          <div v-if="showCode.composable" class="mt-4 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre><code>// composables/useMouse.ts
export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  const update = (e: MouseEvent) => {
    x.value = e.pageX
    y.value = e.pageY
  }

  onMounted(() => {
    window.addEventListener('mousemove', update)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', update)
  })

  return { x, y }
}

// Usage in component
const { x, y } = useMouse()</code></pre>
          </div>
        </div>

        <!-- Provide/Inject -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-semibold">Provide/Inject</h3>
            <button @click="toggleCode('provideInject')" class="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              {{ showCode.provideInject ? 'Hide Code' : 'Show Code' }}
            </button>
          </div>
          <p>Theme from parent: {{ theme }}</p>
          <button @click="toggleTheme" class="btn-primary">Toggle Theme</button>
          <div v-if="showCode.provideInject" class="mt-4 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre><code>// Parent/Ancestor Component
const theme = ref('light')
provide('theme', theme)

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

// Child/Descendant Component (any level deep)
const theme = inject('theme')

// With default value
const theme = inject('theme', 'light')</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- Advanced Patterns -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-4">🚀 Advanced Patterns</h2>
      <div class="grid md:grid-cols-2 gap-6">
        
        <!-- Async Components -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-semibold">Async Setup</h3>
            <button @click="toggleCode('async')" class="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              {{ showCode.async ? 'Hide Code' : 'Show Code' }}
            </button>
          </div>
          <Suspense>
            <template #default>
              <AsyncDataComponent />
            </template>
            <template #fallback>
              <div>Loading async data...</div>
            </template>
          </Suspense>
          <div v-if="showCode.async" class="mt-4 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre><code>// Async Component
const data = await fetch('/api/data')
  .then(res => res.json())

// Parent Component with Suspense
&lt;Suspense&gt;
  &lt;template #default&gt;
    &lt;AsyncDataComponent /&gt;
  &lt;/template&gt;
  &lt;template #fallback&gt;
    &lt;div&gt;Loading...&lt;/div&gt;
  &lt;/template&gt;
&lt;/Suspense&gt;</code></pre>
          </div>
        </div>

        <!-- Teleport -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-lg font-semibold">Teleport</h3>
            <button @click="toggleCode('teleport')" class="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              {{ showCode.teleport ? 'Hide Code' : 'Show Code' }}
            </button>
          </div>
          <button @click="showModal = true" class="btn-primary">Open Modal</button>
          <Teleport to="body">
            <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div class="bg-white p-6 rounded-lg">
                <h4 class="text-lg font-semibold mb-2">Modal (Teleported to body)</h4>
                <button @click="showModal = false" class="btn-secondary">Close</button>
              </div>
            </div>
          </Teleport>
          <div v-if="showCode.teleport" class="mt-4 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <pre><code>const showModal = ref(false)

// Teleport renders content in different DOM location
&lt;Teleport to="body"&gt;
  &lt;div v-if="showModal" class="modal"&gt;
    Modal content
  &lt;/div&gt;
&lt;/Teleport&gt;

// Useful for modals, tooltips, notifications</code></pre>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, watchEffect, onMounted, provide, Suspense } from 'vue'
import CheatSheetChild from '../components/CheatSheetChild.vue'
import CustomInput from '../components/CustomInput.vue'
import AsyncDataComponent from '../components/AsyncDataComponent.vue'
import { useMouse, useCounter } from '../composables/useCheatSheet'

// Show/Hide Code State
const showCode = reactive({
  refReactive: false,
  computed: false,
  propsEmits: false,
  vModel: false,
  watch: false,
  templateRef: false,
  vIfShow: false,
  vFor: false,
  composable: false,
  provideInject: false,
  async: false,
  teleport: false
})

const toggleCode = (section: keyof typeof showCode) => {
  showCode[section] = !showCode[section]
}

// Reactivity
const refCount = ref(0)
const reactiveState = reactive({ count: 0 })

// Computed
const firstName = ref('')
const lastName = ref('')
const computedCallCount = ref(0)
const fullName = computed(() => {
  computedCallCount.value++
  return `${firstName.value} ${lastName.value}`.trim()
})

// Component Communication
const parentMessage = ref('Hello from parent!')
const childResponse = ref('')
const customValue = ref('')

const handleChildUpdate = (value: string) => {
  childResponse.value = value
}

// Watchers
const watchValue = ref(1)
const watchDoubled = ref(2)
const watchTripled = ref(3)

watch(watchValue, (newVal) => {
  watchDoubled.value = newVal * 2
})

watchEffect(() => {
  watchTripled.value = watchValue.value * 3
})

// Template Refs
const inputRef = ref<HTMLInputElement>()
const inputRefValue = ref('')

const focusInput = () => {
  inputRef.value?.focus()
  inputRefValue.value = inputRef.value?.value || ''
}

// Directives
const isVisible = ref(true)
const toggleVisibility = () => {
  isVisible.value = !isVisible.value
}

const items = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
])

const shuffleItems = () => {
  items.value = [...items.value].sort(() => Math.random() - 0.5)
}

// Composables
const { x, y } = useMouse()
const { counter, increment } = useCounter()

// Provide/Inject
const theme = ref('light')
provide('theme', theme)

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

// Advanced
const showModal = ref(false)

onMounted(() => {
  console.log('Vue Cheat Sheet mounted!')
})
</script>

<style scoped>
.btn-primary {
  padding: 1rem;
  background-color: rgb(5 150 105);
  color: white;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: rgb(4 120 87);
}

.btn-secondary {
  padding: 1rem;
  background-color: rgb(75 85 99);
  color: white;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background-color: rgb(55 65 81);
}

.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid rgb(209 213 219);
  border-radius: 0.25rem;
}

.input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgb(5 150 105 / 0.5);
}
</style>