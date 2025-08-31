<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">
        Exercise 4: Course List Loading (Lifecycle Bug)
      </h2>
      <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <p class="text-sm text-red-800">
          <strong>🐛 Bug:</strong> Courses show as "undefined" initially, then cause errors
        </p>
      </div>
    </div>

    <!-- Course Display -->
    <div class="p-6 bg-gray-50 rounded-lg">
      <div class="mb-4 p-4 bg-green-100 rounded-lg">
        <h3 class="font-semibold text-green-900 mb-1">Featured Course:</h3>
        <p class="text-lg text-green-700">{{ featuredCourse }}</p>
      </div>

      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
      
      <div v-else>
        <h3 class="font-semibold text-gray-700 mb-3">All Courses:</h3>
        <div v-if="courses.length > 0" class="space-y-2">
          <div 
            v-for="course in courses" 
            :key="course.id"
            class="p-3 bg-white rounded-lg border border-gray-200"
          >
            <p class="font-medium">{{ course.name }}</p>
            <p class="text-sm text-gray-600">{{ course.location }}</p>
          </div>
        </div>
        <p v-else class="text-gray-500">No courses available</p>
      </div>
    </div>

    <!-- Console Output -->
    <div class="mt-4 p-4 bg-gray-900 rounded-lg">
      <p class="text-xs text-green-400 font-mono mb-2">// Console Output:</p>
      <p class="text-xs text-red-400 font-mono">
        Warning: Cannot read properties of undefined (reading 'name')
      </p>
    </div>

    <!-- Hints Section -->
    <div class="mt-6 space-y-3">
      <details class="group">
        <summary class="cursor-pointer text-sm font-medium text-gray-700 hover:text-green-600">
          💡 Hint 1: Timing Issue
        </summary>
        <p class="mt-2 pl-5 text-sm text-gray-600">
          The featured course is being accessed before the async data loads. 
          Think about when different parts of your setup function execute.
        </p>
      </details>
      
      <details class="group">
        <summary class="cursor-pointer text-sm font-medium text-gray-700 hover:text-green-600">
          💡 Hint 2: Computed Properties
        </summary>
        <p class="mt-2 pl-5 text-sm text-gray-600">
          Computed properties automatically re-evaluate when their dependencies change.
          They're perfect for deriving state from async data.
        </p>
      </details>
      
      <details class="group">
        <summary class="cursor-pointer text-sm font-medium text-gray-700 hover:text-green-600">
          ✅ Solution
        </summary>
        <div class="mt-2 pl-5 text-sm text-gray-600">
          <p class="mb-2">Use a computed property for the featured course:</p>
          <pre class="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
// Instead of accessing immediately:
// ❌ const featuredCourse = courses.value[0]?.name || 'Loading...';

// Use computed to react to changes:
// ✅ 
const featuredCourse = computed(() => {
  return courses.value.length > 0 
    ? courses.value[0].name 
    : 'Loading...';
});</pre>
        </div>
      </details>
    </div>

    <!-- Task Description -->
    <div class="mt-6 p-4 bg-blue-50 rounded-lg">
      <h3 class="font-semibold text-blue-900 mb-2">📝 Your Task:</h3>
      <ol class="list-decimal list-inside text-sm text-blue-800 space-y-1">
        <li>Fix the featured course to handle async data properly</li>
        <li>Ensure no "undefined" errors appear</li>
        <li>Show appropriate loading states</li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Course {
  id: number;
  name: string;
  location: string;
}

const courses = ref<Course[]>([]);
const loading = ref(false);

// BUG: This tries to access courses immediately, before they're loaded!
// courses.value is empty at this point, so courses.value[0] is undefined
const featuredCourse = courses.value[0]?.name || 'Loading...';

onMounted(async () => {
  loading.value = true;
  console.log('Starting to fetch courses...');
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  courses.value = [
    { id: 1, name: 'Augusta National', location: 'Georgia' },
    { id: 2, name: 'St. Andrews', location: 'Scotland' },
    { id: 3, name: 'Pebble Beach', location: 'California' }
  ];
  
  console.log('Courses loaded:', courses.value);
  console.log('But featuredCourse is still:', featuredCourse);
  
  loading.value = false;
});

// TO FIX THIS BUG:
// 1. Import computed from 'vue'
// 2. Change featuredCourse to a computed property:
//    const featuredCourse = computed(() => 
//      courses.value.length > 0 ? courses.value[0].name : 'Loading...'
//    );
</script>
