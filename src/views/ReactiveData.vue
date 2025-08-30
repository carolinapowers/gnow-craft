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
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Reactive Data Management</h1>
      
      <div class="grid lg:grid-cols-2 gap-6">
        <!-- ref() Demo -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">ref() - Primitive Values</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">String ref:</label>
              <input
                v-model="stringRef"
                class="w-full px-3 py-2 border rounded"
              />
              <div class="mt-1 text-sm text-gray-600">
                Value: <code class="bg-gray-100 px-1">{{ stringRef }}</code>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">Number ref:</label>
              <div class="flex gap-2">
                <button
                  @click="numberRef--"
                  class="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  -
                </button>
                <input
                  v-model.number="numberRef"
                  type="number"
                  class="flex-1 px-3 py-2 border rounded text-center"
                />
                <button
                  @click="numberRef++"
                  class="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">Boolean ref:</label>
              <button
                @click="booleanRef = !booleanRef"
                :class="[
                  'px-4 py-2 rounded transition-colors',
                  booleanRef ? 'bg-emerald-600 text-white' : 'bg-gray-200'
                ]"
              >
                {{ booleanRef ? 'TRUE' : 'FALSE' }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- reactive() Demo -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">reactive() - Objects</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Player Object:</label>
              <div class="space-y-2">
                <input
                  v-model="player.name"
                  placeholder="Name"
                  class="w-full px-3 py-2 border rounded"
                />
                <input
                  v-model.number="player.handicap"
                  type="number"
                  placeholder="Handicap"
                  class="w-full px-3 py-2 border rounded"
                />
                <select
                  v-model="player.level"
                  class="w-full px-3 py-2 border rounded"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Pro</option>
                </select>
              </div>
            </div>
            
            <div class="p-3 bg-gray-100 rounded">
              <pre class="text-sm">{{ JSON.stringify(player, null, 2) }}</pre>
            </div>
          </div>
        </div>
        
        <!-- computed() Demo -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">computed() Properties</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Score Input:</label>
              <div class="grid grid-cols-3 gap-2">
                <input
                  v-model.number="scores[0]"
                  type="number"
                  placeholder="Round 1"
                  class="px-3 py-2 border rounded"
                />
                <input
                  v-model.number="scores[1]"
                  type="number"
                  placeholder="Round 2"
                  class="px-3 py-2 border rounded"
                />
                <input
                  v-model.number="scores[2]"
                  type="number"
                  placeholder="Round 3"
                  class="px-3 py-2 border rounded"
                />
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-2">
              <div class="p-3 bg-emerald-50 rounded">
                <div class="text-sm text-gray-600">Average Score</div>
                <div class="text-xl font-bold text-emerald-700">{{ averageScore }}</div>
              </div>
              <div class="p-3 bg-blue-50 rounded">
                <div class="text-sm text-gray-600">Best Score</div>
                <div class="text-xl font-bold text-blue-700">{{ bestScore }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- watch() Demo -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">watch() & watchEffect()</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Watched Value:</label>
              <input
                v-model="watchedValue"
                class="w-full px-3 py-2 border rounded"
              />
            </div>
            
            <div class="p-3 bg-yellow-50 rounded">
              <div class="text-sm font-medium mb-2">Watch Log:</div>
              <div class="space-y-1 text-sm text-gray-600 max-h-32 overflow-auto">
                <div v-for="(log, index) in watchLogs" :key="index">
                  {{ log }}
                </div>
              </div>
            </div>
            
            <button
              @click="clearLogs"
              class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Clear Logs
            </button>
          </div>
        </div>
      </div>
      
      <!-- Advanced Patterns -->
      <div class="mt-6 bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Advanced Reactive Patterns</h2>
        <div class="grid lg:grid-cols-3 gap-4">
          <div>
            <h3 class="font-medium mb-2">toRef / toRefs</h3>
            <div class="p-3 bg-gray-100 rounded text-sm">
              <pre>const { name, handicap } = toRefs(player)</pre>
              <div class="mt-2">
                Destructured name: {{ playerName }}
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="font-medium mb-2">shallowRef</h3>
            <div class="p-3 bg-gray-100 rounded text-sm">
              <button
                @click="updateShallow"
                class="px-3 py-1 bg-emerald-600 text-white rounded"
              >
                Update Shallow
              </button>
              <div class="mt-2">
                Count: {{ shallowData.count }}
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="font-medium mb-2">readonly</h3>
            <div class="p-3 bg-gray-100 rounded text-sm">
              <div>Original: {{ originalValue }}</div>
              <div>Readonly: {{ readonlyValue }}</div>
              <button
                @click="originalValue++"
                class="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
              >
                Increment Original
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, watchEffect, toRefs, shallowRef, readonly } from 'vue'

// ref() examples
const stringRef = ref('Hello Vue 3')
const numberRef = ref(42)
const booleanRef = ref(true)

// reactive() example
const player = reactive({
  name: 'Tiger Woods',
  handicap: 0,
  level: 'Pro'
})

// computed() examples
const scores = ref([72, 68, 70])

const averageScore = computed(() => {
  const validScores = scores.value.filter(s => s > 0)
  if (validScores.length === 0) return 0
  return Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
})

const bestScore = computed(() => {
  const validScores = scores.value.filter(s => s > 0)
  return validScores.length > 0 ? Math.min(...validScores) : 0
})

// watch() example
const watchedValue = ref('')
const watchLogs = ref<string[]>([])

watch(watchedValue, (newVal, oldVal) => {
  const log = `Changed from "${oldVal}" to "${newVal}" at ${new Date().toLocaleTimeString()}`
  watchLogs.value.unshift(log)
  if (watchLogs.value.length > 10) {
    watchLogs.value.pop()
  }
})

watchEffect(() => {
  if (numberRef.value > 100) {
    console.log('Number is over 100!')
  }
})

const clearLogs = () => {
  watchLogs.value = []
}

// Advanced patterns
const { name: playerName } = toRefs(player)

const shallowData = shallowRef({ count: 0 })
const updateShallow = () => {
  shallowData.value = { count: shallowData.value.count + 1 }
}

const originalValue = ref(0)
const readonlyValue = readonly(originalValue)
</script>