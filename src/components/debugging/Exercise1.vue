<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">
        Exercise 1: Tee Time Availability (Reactivity Bug)
      </h2>
      <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <p class="text-sm text-red-800">
          <strong>🐛 Bug:</strong> The available count doesn't update when clicking "Book Tee Time"
        </p>
      </div>
    </div>

    <!-- Booking Interface -->
    <div class="p-6 bg-gray-50 rounded-lg">
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="text-center p-4 bg-white rounded-lg">
          <p class="text-sm text-gray-600 mb-1">Available Tee Times</p>
          <p class="text-3xl font-bold text-green-600">{{ available }}</p>
        </div>
        <div class="text-center p-4 bg-white rounded-lg">
          <p class="text-sm text-gray-600 mb-1">Booked</p>
          <p class="text-3xl font-bold text-blue-600">{{ booked }}</p>
        </div>
      </div>
      
      <button
        @click="bookTeeTime"
        :disabled="available <= 0"
        :class="[
          'w-full py-3 px-4 rounded-lg font-medium transition-colors',
          available > 0
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        ]"
      >
        {{ available > 0 ? 'Book Tee Time' : 'No Times Available' }}
      </button>
    </div>

    <!-- Hints Section -->
    <div class="mt-6 space-y-3">
      <details class="group">
        <summary class="cursor-pointer text-sm font-medium text-gray-700 hover:text-green-600">
          💡 Hint 1: Check the Console
        </summary>
        <p class="mt-2 pl-5 text-sm text-gray-600">
          Look for any warnings in the console. Are the values being updated but not triggering re-renders?
        </p>
      </details>
      
      <details class="group">
        <summary class="cursor-pointer text-sm font-medium text-gray-700 hover:text-green-600">
          💡 Hint 2: Reactivity System
        </summary>
        <p class="mt-2 pl-5 text-sm text-gray-600">
          Vue 3's reactivity is based on JavaScript Proxies. When you destructure a reactive object,
          you lose the proxy wrapper. Think about how to maintain reactivity when extracting values.
        </p>
      </details>
      
      <details class="group">
        <summary class="cursor-pointer text-sm font-medium text-gray-700 hover:text-green-600">
          ✅ Solution
        </summary>
        <div class="mt-2 pl-5 text-sm text-gray-600">
          <p class="mb-2">The problem is with destructuring. Use one of these approaches:</p>
          <pre class="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
// Option 1: Use toRefs
const { available, booked } = toRefs(teeTimeData);
// Then use .value in the function
available.value--;
booked.value++;

// Option 2: Access directly from reactive object
teeTimeData.available--;
teeTimeData.booked++;</pre>
        </div>
      </details>
    </div>

    <!-- Task Description -->
    <div class="mt-6 p-4 bg-blue-50 rounded-lg">
      <h3 class="font-semibold text-blue-900 mb-2">📝 Your Task:</h3>
      <ol class="list-decimal list-inside text-sm text-blue-800 space-y-1">
        <li>Fix the reactivity issue so the counts update when booking</li>
        <li>Ensure the button becomes disabled when no times are available</li>
        <li>Test that the UI updates immediately when clicking the button</li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

// The tee time data
const teeTimeData = reactive({
  available: 10,
  booked: 0
});

// BUG: Destructuring loses reactivity!
// This is the problematic code that needs to be fixed
let { available, booked } = teeTimeData;

const bookTeeTime = () => {
  if (available > 0) {
    // These updates won't trigger UI updates because
    // available and booked are no longer reactive
    available--;
    booked++;
    
    // Debug: Let's log to see if values are changing
    console.log('After booking - Available:', available, 'Booked:', booked);
    console.log('Original object - Available:', teeTimeData.available, 'Booked:', teeTimeData.booked);
  }
};

// TO FIX THIS BUG:
// 1. Import toRefs from 'vue'
// 2. Use: const { available, booked } = toRefs(teeTimeData);
// 3. Update the function to use .value
// OR
// Just use teeTimeData.available and teeTimeData.booked directly
</script>
