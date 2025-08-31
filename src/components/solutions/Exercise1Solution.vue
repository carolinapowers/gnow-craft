<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">
        Exercise 1 Solution: Tee Time Availability (Fixed!)
      </h2>
      <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
        <p class="text-sm text-green-800">
          <strong>✅ Fixed:</strong> Using toRefs to maintain reactivity
        </p>
      </div>
    </div>

    <!-- Working Booking Interface -->
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

    <!-- Solution Explanation -->
    <div class="mt-6 p-4 bg-blue-50 rounded-lg">
      <h3 class="font-semibold text-blue-900 mb-2">📚 Solution Explanation:</h3>
      <p class="text-sm text-blue-800 mb-3">
        The issue was that destructuring a reactive object loses the proxy wrapper that Vue uses for reactivity.
        We fixed it by using <code class="bg-white px-1 py-0.5 rounded">toRefs()</code> which maintains reactivity.
      </p>
      <pre class="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
// ✅ SOLUTION 1: Using toRefs
import { reactive, toRefs } from 'vue';

const teeTimeData = reactive({
  available: 10,
  booked: 0
});

// toRefs maintains reactivity
const { available, booked } = toRefs(teeTimeData);

const bookTeeTime = () => {
  if (available.value > 0) {
    available.value--;  // Use .value
    booked.value++;     // Use .value
  }
};

// ✅ SOLUTION 2: Direct access (alternative)
const bookTeeTime = () => {
  if (teeTimeData.available > 0) {
    teeTimeData.available--;
    teeTimeData.booked++;
  }
};</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue';

// The tee time data
const teeTimeData = reactive({
  available: 10,
  booked: 0
});

// ✅ FIXED: Using toRefs to maintain reactivity
const { available, booked } = toRefs(teeTimeData);

const bookTeeTime = () => {
  if (available.value > 0) {
    available.value--;
    booked.value++;
    console.log('✅ Booking successful! Available:', available.value, 'Booked:', booked.value);
  }
};
</script>
