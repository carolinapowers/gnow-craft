<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">
        Exercise 3: Player Handicap Input (v-model Bug)
      </h2>
      <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <p class="text-sm text-red-800">
          <strong>🐛 Bug:</strong> Custom input component doesn't update parent's data
        </p>
      </div>
    </div>

    <!-- Handicap Form -->
    <div class="p-6 bg-gray-50 rounded-lg">
      <form class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Player Name
          </label>
          <input 
            v-model="playerName"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter your name"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Handicap Index
          </label>
          <!-- This custom component has a v-model bug -->
          <HandicapInput v-model="playerHandicap" />
          <p class="mt-1 text-xs text-gray-500">
            Handicap should be between 0 and 36
          </p>
        </div>
        
        <div class="p-4 bg-white rounded-lg">
          <h4 class="font-semibold text-gray-700 mb-2">Current Values:</h4>
          <p class="text-sm text-gray-600">Name: <span class="font-bold">{{ playerName || 'Not set' }}</span></p>
          <p class="text-sm text-gray-600">Handicap: <span class="font-bold">{{ playerHandicap }}</span></p>
        </div>
      </form>
    </div>

    <!-- Hints Section -->
    <div class="mt-6 space-y-3">
      <details class="group">
        <summary class="cursor-pointer text-sm font-medium text-gray-700 hover:text-green-600">
          💡 Hint 1: v-model Convention
        </summary>
        <p class="mt-2 pl-5 text-sm text-gray-600">
          v-model on a custom component expects a prop called 'modelValue' and an event called 'update:modelValue'.
          This is the Vue 3 convention for two-way binding.
        </p>
      </details>
      
      <details class="group">
        <summary class="cursor-pointer text-sm font-medium text-gray-700 hover:text-green-600">
          💡 Hint 2: Event Naming
        </summary>
        <p class="mt-2 pl-5 text-sm text-gray-600">
          In Vue 3, the v-model event name changed from 'input' (Vue 2) to 'update:modelValue' (Vue 3).
          Make sure you're emitting the correct event name.
        </p>
      </details>
      
      <details class="group">
        <summary class="cursor-pointer text-sm font-medium text-gray-700 hover:text-green-600">
          ✅ Solution
        </summary>
        <div class="mt-2 pl-5 text-sm text-gray-600">
          <p class="mb-2">Fix the HandicapInput component to properly work with v-model:</p>
          <pre class="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
// HandicapInput.vue
const props = defineProps&lt;{
  modelValue: number;
}&gt;();

const emit = defineEmits&lt;{
  'update:modelValue': [value: number];
}&gt;();

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', Number(target.value));
};</pre>
        </div>
      </details>
    </div>

    <!-- Task Description -->
    <div class="mt-6 p-4 bg-blue-50 rounded-lg">
      <h3 class="font-semibold text-blue-900 mb-2">📝 Your Task:</h3>
      <ol class="list-decimal list-inside text-sm text-blue-800 space-y-1">
        <li>Fix the HandicapInput component to work with v-model</li>
        <li>Ensure typing in the handicap input updates the parent's playerHandicap value</li>
        <li>Test that the two-way binding works correctly</li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import HandicapInput from './HandicapInput.vue';

const playerName = ref('');
const playerHandicap = ref(15);
</script>
