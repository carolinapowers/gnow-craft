<template>
  <div class="p-4 border rounded-lg bg-green-50">
    <h3 class="font-semibold text-lg mb-3">{{ course.name }}</h3>
    <p class="text-sm text-gray-600 mb-2">
      <i class="fas fa-map-marker-alt mr-1"></i>{{ course.location }}
    </p>
    <div class="flex items-center gap-4">
      <p class="text-lg">
        Rating: 
        <span class="font-bold text-yellow-600">
          ⭐ {{ course.rating.toFixed(1) }}
        </span>
      </p>
      <button 
        @click="updateRating" 
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
      >
        Improve Rating
      </button>
    </div>
    
    <div class="mt-4 p-3 bg-yellow-100 rounded text-sm">
      <p class="text-yellow-800">
        ⚠️ Check the console for warnings when clicking the button!
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Course {
  name: string;
  rating: number;
  location: string;
}

const props = defineProps<{
  course: Course;
}>();

// BUG: This component is trying to mutate props directly!
// This is an anti-pattern in Vue and will cause warnings
const updateRating = () => {
  // ❌ NEVER mutate props directly!
  props.course.rating = Math.min(5, props.course.rating + 0.1);
  console.log('Attempted to update rating to:', props.course.rating);
};

// TO FIX THIS BUG:
// 1. Define emits: const emit = defineEmits<{ 'update-rating': [rating: number] }>();
// 2. Calculate the new rating: const newRating = Math.min(5, props.course.rating + 0.1);
// 3. Emit the event: emit('update-rating', newRating);
// 4. Let the parent handle the actual update
</script>
