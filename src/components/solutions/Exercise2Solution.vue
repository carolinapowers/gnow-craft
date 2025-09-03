<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">
        Exercise 2 Solution: Tee Time Filter (Fixed!)
      </h2>
      <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
        <p class="text-sm text-green-800">
          <strong>✅ Fixed:</strong> Avoiding direct props mutation
        </p>
      </div>
    </div>

    <!-- Working Filter Interface -->
    <div class="p-6 bg-gray-50 rounded-lg">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Filter by Time of Day
        </label>
        <select
          v-model="localSelectedTime"
          @change="handleTimeChange"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
        >
          <option value="">All Times</option>
          <option value="morning">Morning (6AM - 12PM)</option>
          <option value="afternoon">Afternoon (12PM - 6PM)</option>
          <option value="evening">Evening (6PM - 8PM)</option>
        </select>
      </div>
      
      <div class="grid gap-2">
        <div
          v-for="time in filteredTimes"
          :key="time.id"
          class="p-3 bg-white rounded border flex justify-between items-center"
        >
          <span class="font-medium">{{ time.time }}</span>
          <span class="text-sm text-gray-600">{{ time.course }}</span>
        </div>
      </div>
    </div>

    <!-- Solution Explanation -->
    <div class="mt-6 p-4 bg-blue-50 rounded-lg">
      <h3 class="font-semibold text-blue-900 mb-2">📚 Solution Explanation:</h3>
      <p class="text-sm text-blue-800 mb-3">
        The issue was directly mutating props. Vue components should never mutate props directly.
        Instead, we use a local reactive variable and emit events to communicate changes to the parent.
      </p>
      <pre class="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
// ✅ SOLUTION: Use local state + emit
import { ref, computed, watch } from 'vue';

const props = defineProps(['selectedTime']);
const emit = defineEmits(['update:selectedTime']);

// Local reactive copy
const localSelectedTime = ref(props.selectedTime);

// Watch for prop changes
watch(() => props.selectedTime, (newVal) => {
  localSelectedTime.value = newVal;
});

// Emit changes to parent
const handleTimeChange = () => {
  emit('update:selectedTime', localSelectedTime.value);
};</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps<{
  selectedTime: string;
}>();

const emit = defineEmits<{
  'update:selectedTime': [value: string];
}>();

// ✅ FIXED: Use local state instead of mutating props
const localSelectedTime = ref(props.selectedTime);

// Watch for prop changes (if parent updates)
watch(() => props.selectedTime, (newVal) => {
  localSelectedTime.value = newVal;
});

const teeTimes = [
  { id: 1, time: '7:00 AM', course: 'Pebble Beach', category: 'morning' },
  { id: 2, time: '9:30 AM', course: 'St. Andrews', category: 'morning' },
  { id: 3, time: '1:00 PM', course: 'Augusta National', category: 'afternoon' },
  { id: 4, time: '3:30 PM', course: 'Pinehurst', category: 'afternoon' },
  { id: 5, time: '6:30 PM', course: 'Torrey Pines', category: 'evening' }
];

const filteredTimes = computed(() => {
  if (!localSelectedTime.value) return teeTimes;
  return teeTimes.filter(time => time.category === localSelectedTime.value);
});

const handleTimeChange = () => {
  emit('update:selectedTime', localSelectedTime.value);
  console.log('✅ Time filter changed:', localSelectedTime.value);
};
</script>