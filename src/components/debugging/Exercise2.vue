<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">
        Exercise 2: Golf Course Rating (Props Mutation Bug)
      </h2>
      <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <p class="text-sm text-red-800">
          <strong>🐛 Bug:</strong> Console shows warning about mutating props when updating rating
        </p>
      </div>
    </div>

    <!-- Course Rating Component -->
    <CourseRating :course="course" @update-rating="handleRatingUpdate" />

    <!-- Parent State Display -->
    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 class="font-semibold text-gray-700 mb-2">Parent Component State:</h3>
      <p class="text-sm text-gray-600">
        Current Rating in Parent: <span class="font-bold">{{ course.rating.toFixed(1) }}</span>
      </p>
    </div>

    <!-- Hints Section -->
    <div class="mt-6 space-y-3">
      <details class="group">
        <summary class="cursor-pointer text-sm font-medium text-gray-700 hover:text-green-600">
          💡 Hint 1: Props are Read-Only
        </summary>
        <p class="mt-2 pl-5 text-sm text-gray-600">
          In Vue 3, props are readonly and should never be mutated directly. 
          Think about how child components should communicate changes to their parents.
        </p>
      </details>
      
      <details class="group">
        <summary class="cursor-pointer text-sm font-medium text-gray-700 hover:text-green-600">
          💡 Hint 2: Event Emission Pattern
        </summary>
        <p class="mt-2 pl-5 text-sm text-gray-600">
          Vue uses a one-way data flow. Data flows down through props, and events bubble up through emits.
          The child should emit an event with the new value, and the parent should handle the update.
        </p>
      </details>
      
      <details class="group">
        <summary class="cursor-pointer text-sm font-medium text-gray-700 hover:text-green-600">
          ✅ Solution
        </summary>
        <div class="mt-2 pl-5 text-sm text-gray-600">
          <p class="mb-2">Fix the CourseRating component to emit events instead of mutating props:</p>
          <pre class="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
// In CourseRating component:
const emit = defineEmits&lt;{
  'update-rating': [rating: number];
}&gt;();

const updateRating = () => {
  const newRating = Math.min(5, props.course.rating + 0.1);
  emit('update-rating', newRating);
};</pre>
        </div>
      </details>
    </div>

    <!-- Task Description -->
    <div class="mt-6 p-4 bg-blue-50 rounded-lg">
      <h3 class="font-semibold text-blue-900 mb-2">📝 Your Task:</h3>
      <ol class="list-decimal list-inside text-sm text-blue-800 space-y-1">
        <li>Fix the CourseRating component to properly emit events</li>
        <li>Ensure the parent component receives and handles the rating update</li>
        <li>Verify no console warnings about prop mutation</li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CourseRating from './CourseRating.vue';

interface Course {
  name: string;
  rating: number;
  location: string;
}

const course = ref<Course>({
  name: 'Pebble Beach Golf Links',
  rating: 4.5,
  location: 'California'
});

// This handler is correct - it properly updates the parent's state
const handleRatingUpdate = (newRating: number) => {
  course.value.rating = newRating;
  console.log('Parent received rating update:', newRating);
};
</script>
