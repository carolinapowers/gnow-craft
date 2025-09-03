<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">
        Exercise 3 Solution: Custom Input Component (Fixed!)
      </h2>
      <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
        <p class="text-sm text-green-800">
          <strong>✅ Fixed:</strong> Proper v-model implementation with computed getter/setter
        </p>
      </div>
    </div>

    <!-- Working Custom Input -->
    <div class="p-6 bg-gray-50 rounded-lg">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Golfer Handicap
        </label>
        <HandicapInputFixed v-model="handicapValue" />
      </div>
      
      <div class="mt-4 p-3 bg-white rounded border">
        <p class="text-sm text-gray-600">
          Current Value: <span class="font-semibold">{{ handicapValue }}</span>
        </p>
      </div>
    </div>

    <!-- Solution Explanation -->
    <div class="mt-6 p-4 bg-blue-50 rounded-lg">
      <h3 class="font-semibold text-blue-900 mb-2">📚 Solution Explanation:</h3>
      <p class="text-sm text-blue-800 mb-3">
        For v-model to work properly with custom components, you need to implement both 
        <code class="bg-white px-1 py-0.5 rounded">modelValue</code> prop and 
        <code class="bg-white px-1 py-0.5 rounded">update:modelValue</code> emit.
        Using a computed property with getter/setter makes this clean.
      </p>
      <pre class="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
// ✅ SOLUTION: Proper v-model implementation
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const value = computed({
  get: () => props.modelValue,
  set: (newValue) => emit('update:modelValue', newValue)
});

// Template usage:
// &lt;input v-model="value" /&gt;</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import HandicapInputFixed from '../debugging/HandicapInputFixed.vue';

const handicapValue = ref(5.2);
</script>