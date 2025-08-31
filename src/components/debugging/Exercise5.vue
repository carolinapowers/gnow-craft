<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">
        Exercise 5: Booking Form (Event Handling Bug)
      </h2>
      <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <p class="text-sm text-red-800">
          <strong>🐛 Bug:</strong> Form submits and page refreshes instead of handling data
        </p>
      </div>
    </div>

    <!-- Booking Form -->
    <div class="p-6 bg-gray-50 rounded-lg">
      <!-- BUG: Form submission isn't prevented! -->
      <form @submit="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input 
            v-model="bookingData.name" 
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input 
            v-model="bookingData.email" 
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Preferred Date *
          </label>
          <input 
            v-model="bookingData.date" 
            type="date"
            required
            :min="minDate"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Number of Players
          </label>
          <select 
            v-model.number="bookingData.players" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option v-for="n in 4" :key="n" :value="n">
              {{ n }} {{ n === 1 ? 'Player' : 'Players' }}
            </option>
          </select>
        </div>

        <button 
          type="submit" 
          class="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Submit Booking
        </button>
      </form>

      <!-- Success Message (should appear after submission) -->
      <div v-if="submitted" class="mt-4 p-4 bg-green-100 rounded-lg">
        <p class="text-green-800 font-medium">
          ✅ Booking confirmed for {{ bookingData.name }}!
        </p>
      </div>
    </div>

    <!-- Console Info -->
    <div class="mt-4 p-4 bg-gray-900 rounded-lg">
      <p class="text-xs text-green-400 font-mono mb-2">// Expected Console Output:</p>
      <p class="text-xs text-gray-400 font-mono">
        Booking submitted: { name: "...", email: "...", date: "...", players: ... }
      </p>
      <p class="text-xs text-red-400 font-mono mt-2">
        // Actual: Page refreshes and data is lost!
      </p>
    </div>

    <!-- Hints Section -->
    <div class="mt-6 space-y-3">
      <details class="group">
        <summary class="cursor-pointer text-sm font-medium text-gray-700 hover:text-green-600">
          💡 Hint 1: Default Form Behavior
        </summary>
        <p class="mt-2 pl-5 text-sm text-gray-600">
          HTML forms have default submit behavior that causes a page refresh.
          Vue provides a way to prevent this default behavior.
        </p>
      </details>
      
      <details class="group">
        <summary class="cursor-pointer text-sm font-medium text-gray-700 hover:text-green-600">
          💡 Hint 2: Event Modifiers
        </summary>
        <p class="mt-2 pl-5 text-sm text-gray-600">
          Vue has event modifiers that can be chained to event listeners.
          One of them prevents the default action of an event.
        </p>
      </details>
      
      <details class="group">
        <summary class="cursor-pointer text-sm font-medium text-gray-700 hover:text-green-600">
          ✅ Solution
        </summary>
        <div class="mt-2 pl-5 text-sm text-gray-600">
          <p class="mb-2">Add the .prevent modifier to the submit event:</p>
          <pre class="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
// Change this:
// ❌ &lt;form @submit="handleSubmit"&gt;

// To this:
// ✅ &lt;form @submit.prevent="handleSubmit"&gt;

// Or handle it in the method:
const handleSubmit = (event: Event) => {
  event.preventDefault();
  // ... rest of the logic
};</pre>
        </div>
      </details>
    </div>

    <!-- Task Description -->
    <div class="mt-6 p-4 bg-blue-50 rounded-lg">
      <h3 class="font-semibold text-blue-900 mb-2">📝 Your Task:</h3>
      <ol class="list-decimal list-inside text-sm text-blue-800 space-y-1">
        <li>Prevent the form from refreshing the page on submit</li>
        <li>Log the booking data to the console</li>
        <li>Show the success message after submission</li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';

const bookingData = reactive({
  name: '',
  email: '',
  date: '',
  players: 1
});

const submitted = ref(false);

// Get today's date for the min date attribute
const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

// BUG: Form submission isn't prevented, causing page refresh!
const handleSubmit = () => {
  // This code never runs because the page refreshes!
  console.log('Booking submitted:', bookingData);
  submitted.value = true;
  
  // In a real app, you'd send this to an API
  setTimeout(() => {
    alert(`Booking confirmed for ${bookingData.name}!`);
  }, 100);
};

// TO FIX THIS BUG:
// Option 1: Add .prevent modifier to the form's @submit event
//           @submit.prevent="handleSubmit"
// 
// Option 2: Accept the event parameter and call preventDefault:
//           const handleSubmit = (event: Event) => {
//             event.preventDefault();
//             // ... rest of the logic
//           }
</script>
