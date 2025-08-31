<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-green-800 mb-4">
          🚀 Advanced Vue Patterns - Interview Practice
        </h1>
        <p class="text-gray-600">
          Practice advanced Vue 3 patterns that might come up during your technical interview.
        </p>
      </div>

      <!-- Tab Navigation -->
      <div class="mb-8 border-b">
        <nav class="flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="space-y-8">
        <!-- Composables Pattern -->
        <div v-if="activeTab === 'composables'" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold mb-4">Composables Pattern</h2>
          
          <div class="mb-6">
            <p class="text-gray-600 mb-4">
              Test the useApi composable with a mock API endpoint:
            </p>
            
            <div class="space-y-4">
              <button
                @click="fetchCourses"
                :disabled="loading"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {{ loading ? 'Loading...' : 'Fetch Golf Courses' }}
              </button>
              
              <div v-if="error" class="p-4 bg-red-100 rounded-lg">
                <p class="text-red-800">Error: {{ error.message }}</p>
              </div>
              
              <div v-if="data" class="p-4 bg-green-100 rounded-lg">
                <h3 class="font-semibold text-green-900 mb-2">Fetched Data:</h3>
                <pre class="text-sm text-green-700 overflow-x-auto">{{ JSON.stringify(data, null, 2) }}</pre>
              </div>
            </div>
          </div>
          
          <div class="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 class="font-semibold mb-2">Key Concepts:</h3>
            <ul class="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Reusable logic extraction</li>
              <li>Reactive state management</li>
              <li>Error handling and retries</li>
              <li>TypeScript generics for type safety</li>
            </ul>
          </div>
        </div>

        <!-- Store Pattern -->
        <div v-if="activeTab === 'store'" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold mb-4">Store Pattern (without Pinia)</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Add Booking Form -->
            <div>
              <h3 class="font-semibold mb-3">Add New Booking</h3>
              <form @submit.prevent="handleBookingSubmit" class="space-y-3">
                <input
                  v-model="newBooking.playerName"
                  placeholder="Player Name"
                  required
                  class="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  v-model="newBooking.email"
                  type="email"
                  placeholder="Email"
                  required
                  class="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  v-model="newBooking.courseName"
                  placeholder="Course Name"
                  required
                  class="w-full px-3 py-2 border rounded-lg"
                />
                <div class="grid grid-cols-2 gap-2">
                  <input
                    v-model="newBooking.date"
                    type="date"
                    required
                    class="px-3 py-2 border rounded-lg"
                  />
                  <input
                    v-model="newBooking.time"
                    type="time"
                    required
                    class="px-3 py-2 border rounded-lg"
                  />
                </div>
                <button
                  type="submit"
                  class="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add Booking
                </button>
              </form>
            </div>
            
            <!-- Bookings List -->
            <div>
              <h3 class="font-semibold mb-3">
                Current Bookings ({{ bookingCount }})
              </h3>
              <div v-if="storeState.bookings.length > 0" class="space-y-2 max-h-96 overflow-y-auto">
                <div
                  v-for="booking in storeState.bookings"
                  :key="booking.id"
                  class="p-3 border rounded-lg"
                  :class="{
                    'bg-green-50': booking.status === 'confirmed',
                    'bg-yellow-50': booking.status === 'pending',
                    'bg-red-50': booking.status === 'cancelled'
                  }"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="font-medium">{{ booking.courseName }}</p>
                      <p class="text-sm text-gray-600">
                        {{ booking.playerName }} • {{ booking.date }} at {{ booking.time }}
                      </p>
                      <span
                        class="text-xs px-2 py-1 rounded-full"
                        :class="{
                          'bg-green-200 text-green-800': booking.status === 'confirmed',
                          'bg-yellow-200 text-yellow-800': booking.status === 'pending',
                          'bg-red-200 text-red-800': booking.status === 'cancelled'
                        }"
                      >
                        {{ booking.status }}
                      </span>
                    </div>
                    <button
                      @click="bookingStore.removeBooking(booking.id)"
                      class="text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
              <p v-else class="text-gray-500">No bookings yet</p>
            </div>
          </div>
        </div>

        <!-- Watchers & Effects -->
        <div v-if="activeTab === 'watchers'" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold mb-4">Watchers & Side Effects</h2>
          
          <div class="space-y-6">
            <!-- Search with Debounce -->
            <div>
              <h3 class="font-semibold mb-3">Search with Debounce</h3>
              <input
                v-model="searchQuery"
                placeholder="Search for golf courses..."
                class="w-full px-3 py-2 border rounded-lg"
              />
              <p class="mt-2 text-sm text-gray-600">
                Search will execute after 500ms of no typing
              </p>
              <div v-if="searchResults.length > 0" class="mt-3 p-3 bg-gray-50 rounded">
                <p class="text-sm font-medium mb-2">Results:</p>
                <ul class="list-disc list-inside text-sm">
                  <li v-for="result in searchResults" :key="result">{{ result }}</li>
                </ul>
              </div>
            </div>
            
            <!-- Deep Watcher -->
            <div>
              <h3 class="font-semibold mb-3">Deep Object Watching</h3>
              <div class="space-y-2">
                <input
                  v-model="playerProfile.name"
                  placeholder="Name"
                  class="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  v-model.number="playerProfile.handicap"
                  type="number"
                  placeholder="Handicap"
                  class="w-full px-3 py-2 border rounded-lg"
                />
                <select
                  v-model="playerProfile.membership"
                  class="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
              <p class="mt-3 text-sm text-gray-600">
                Changes detected: {{ profileChangeCount }} times
              </p>
            </div>
          </div>
        </div>

        <!-- Performance Optimization -->
        <div v-if="activeTab === 'performance'" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold mb-4">Performance Optimization</h2>
          
          <div class="space-y-6">
            <!-- Expensive Computation -->
            <div>
              <h3 class="font-semibold mb-3">Computed vs Methods</h3>
              <button
                @click="incrementCounter"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Increment Counter ({{ counter }})
              </button>
              
              <div class="mt-4 grid grid-cols-2 gap-4">
                <div class="p-3 bg-gray-50 rounded">
                  <p class="text-sm font-medium">Computed (cached):</p>
                  <p class="text-lg">{{ expensiveComputed }}</p>
                  <p class="text-xs text-gray-500">Calculations: {{ computedCalls }}</p>
                </div>
                <div class="p-3 bg-gray-50 rounded">
                  <p class="text-sm font-medium">Method (not cached):</p>
                  <p class="text-lg">{{ expensiveMethod() }}</p>
                  <p class="text-xs text-gray-500">Calculations: {{ methodCalls }}</p>
                </div>
              </div>
            </div>
            
            <!-- List Rendering -->
            <div>
              <h3 class="font-semibold mb-3">Efficient List Rendering</h3>
              <p class="text-sm text-gray-600 mb-3">
                Use :key properly for efficient updates
              </p>
              <button
                @click="shuffleList"
                class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Shuffle List
              </button>
              <div class="mt-3 grid grid-cols-3 gap-2">
                <TransitionGroup name="list">
                  <div
                    v-for="item in listItems"
                    :key="item.id"
                    class="p-2 bg-purple-100 rounded text-center"
                  >
                    {{ item.name }}
                  </div>
                </TransitionGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive, onMounted } from 'vue';
import { useApi } from '../composables/useApi';
import { bookingStore } from '../stores/bookingStore';

// Tab management
const tabs = [
  { id: 'composables', label: 'Composables' },
  { id: 'store', label: 'Store Pattern' },
  { id: 'watchers', label: 'Watchers' },
  { id: 'performance', label: 'Performance' }
];
const activeTab = ref('composables');

// Composables Demo
const { data, loading, error, execute } = useApi<any>(
  'https://jsonplaceholder.typicode.com/posts/1'
);

const fetchCourses = () => {
  execute();
};

// Store Pattern Demo
const storeState = bookingStore.state;
const bookingCount = computed(() => storeState.bookings.length);

const newBooking = reactive({
  playerName: '',
  email: '',
  courseName: '',
  date: '',
  time: '',
  players: 1
});

const handleBookingSubmit = () => {
  bookingStore.addBooking(newBooking);
  // Reset form
  Object.assign(newBooking, {
    playerName: '',
    email: '',
    courseName: '',
    date: '',
    time: '',
    players: 1
  });
};

// Watchers Demo
const searchQuery = ref('');
const searchResults = ref<string[]>([]);
let searchTimeout: number;

watch(searchQuery, (newQuery) => {
  clearTimeout(searchTimeout);
  searchResults.value = [];
  
  if (newQuery) {
    searchTimeout = setTimeout(() => {
      // Simulate API search
      searchResults.value = [
        `Result for "${newQuery}": Pebble Beach`,
        `Result for "${newQuery}": Augusta National`,
        `Result for "${newQuery}": St. Andrews`
      ];
    }, 500);
  }
});

// Deep watcher demo
const playerProfile = reactive({
  name: '',
  handicap: 15,
  membership: 'basic'
});

const profileChangeCount = ref(0);

watch(
  playerProfile,
  () => {
    profileChangeCount.value++;
  },
  { deep: true }
);

// Performance Demo
const counter = ref(0);
const computedCalls = ref(0);
const methodCalls = ref(0);

const expensiveComputed = computed(() => {
  computedCalls.value++;
  // Simulate expensive operation
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += i;
  }
  return result + counter.value;
});

const expensiveMethod = () => {
  methodCalls.value++;
  // Same expensive operation
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += i;
  }
  return result + counter.value;
};

const incrementCounter = () => {
  counter.value++;
};

// List rendering demo
const listItems = ref([
  { id: 1, name: 'Putter' },
  { id: 2, name: 'Driver' },
  { id: 3, name: 'Iron' },
  { id: 4, name: 'Wedge' },
  { id: 5, name: 'Hybrid' },
  { id: 6, name: 'Wood' }
]);

const shuffleList = () => {
  listItems.value = [...listItems.value].sort(() => Math.random() - 0.5);
};

// Load store data on mount
onMounted(() => {
  bookingStore.loadBookings();
});
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style>
