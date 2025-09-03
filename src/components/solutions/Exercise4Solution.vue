<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">
        Exercise 4 Solution: Course Data Loading (Fixed!)
      </h2>
      <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
        <p class="text-sm text-green-800">
          <strong>✅ Fixed:</strong> Proper async/await with error handling in lifecycle hooks
        </p>
      </div>
    </div>

    <!-- Working Course Data Display -->
    <div class="p-6 bg-gray-50 rounded-lg">
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading course data...</p>
      </div>
      
      <div v-else-if="error" class="text-center py-8">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button
          @click="loadData"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Retry
        </button>
      </div>
      
      <div v-else class="space-y-4">
        <div
          v-for="course in courses"
          :key="course.id"
          class="p-4 bg-white rounded-lg border"
        >
          <h3 class="font-semibold text-gray-800">{{ course.name }}</h3>
          <p class="text-sm text-gray-600">{{ course.location }}</p>
          <p class="text-sm text-green-600">Par {{ course.par }}</p>
        </div>
      </div>
    </div>

    <!-- Solution Explanation -->
    <div class="mt-6 p-4 bg-blue-50 rounded-lg">
      <h3 class="font-semibold text-blue-900 mb-2">📚 Solution Explanation:</h3>
      <p class="text-sm text-blue-800 mb-3">
        The issue was not properly handling async operations in lifecycle hooks.
        We need to use async/await correctly and handle both success and error states.
      </p>
      <pre class="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
// ✅ SOLUTION: Proper async lifecycle handling
onMounted(async () => {
  await loadData();
});

const loadData = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    // Simulate API call
    const response = await fetch('/api/courses');
    if (!response.ok) throw new Error('Failed to load');
    
    courses.value = await response.json();
  } catch (err) {
    error.value = 'Failed to load course data';
    console.error(err);
  } finally {
    loading.value = false;
  }
};</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Course {
  id: number;
  name: string;
  location: string;
  par: number;
}

const courses = ref<Course[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// ✅ FIXED: Proper async data loading with error handling
const loadData = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    // Simulate API call with potential failure
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate occasional failure for demo
    if (Math.random() > 0.8) {
      throw new Error('Network error');
    }
    
    courses.value = [
      { id: 1, name: 'Pebble Beach Golf Links', location: 'California, USA', par: 72 },
      { id: 2, name: 'St. Andrews Old Course', location: 'Scotland, UK', par: 72 },
      { id: 3, name: 'Augusta National', location: 'Georgia, USA', par: 72 },
      { id: 4, name: 'Pinehurst No. 2', location: 'North Carolina, USA', par: 70 }
    ];
  } catch (err) {
    error.value = 'Failed to load course data. Please try again.';
    console.error('Course loading error:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadData();
});
</script>