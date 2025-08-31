<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-green-800 mb-4">
          🐛 Vue Debugging Exercises - GolfNow Interview Prep
        </h1>
        <p class="text-gray-600">
          Practice fixing common Vue 3 bugs you might encounter in your technical interview.
          Each exercise simulates real-world issues in a golf booking system.
        </p>
      </div>

      <!-- Exercise Navigation -->
      <div class="mb-8 flex flex-wrap gap-2">
        <button
          v-for="n in 5"
          :key="n"
          @click="currentExercise = n"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            currentExercise === n
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          ]"
        >
          Exercise {{ n }}
        </button>
      </div>

      <!-- Exercise Content -->
      <div class="space-y-8">
        <transition name="fade" mode="out-in">
          <component :is="currentExerciseComponent" :key="currentExercise" />
        </transition>
      </div>

      <!-- Progress Tracker -->
      <div class="mt-12 p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Your Progress</h2>
        <div class="space-y-3">
          <div v-for="(exercise, index) in exercises" :key="index" class="flex items-center gap-3">
            <input
              type="checkbox"
              :id="`exercise-${index + 1}`"
              v-model="exercise.completed"
              class="h-5 w-5 text-green-600 rounded focus:ring-green-500"
            />
            <label :for="`exercise-${index + 1}`" class="text-gray-700">
              {{ exercise.name }}
            </label>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t">
          <p class="text-sm text-gray-600">
            Completed: {{ completedCount }} / {{ exercises.length }}
          </p>
          <div class="mt-2 bg-gray-200 rounded-full h-2">
            <div
              class="bg-green-600 h-2 rounded-full transition-all duration-300"
              :style="`width: ${progressPercentage}%`"
            ></div>
          </div>
        </div>
      </div>

      <!-- Tips Section -->
      <div class="mt-8 p-6 bg-yellow-50 rounded-lg">
        <h3 class="text-lg font-semibold mb-3">💡 Interview Tips</h3>
        <ul class="list-disc list-inside space-y-2 text-sm text-gray-700">
          <li>Explain your debugging process out loud</li>
          <li>Start by identifying what the expected behavior should be</li>
          <li>Use Vue DevTools to inspect component state</li>
          <li>Check the browser console for warnings and errors</li>
          <li>Consider edge cases and error handling</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, shallowRef } from 'vue';
import Exercise1 from '../components/debugging/Exercise1.vue';
import Exercise2 from '../components/debugging/Exercise2.vue';
import Exercise3 from '../components/debugging/Exercise3.vue';
import Exercise4 from '../components/debugging/Exercise4.vue';
import Exercise5 from '../components/debugging/Exercise5.vue';

const currentExercise = ref(1);

const exerciseComponents = {
  1: Exercise1,
  2: Exercise2,
  3: Exercise3,
  4: Exercise4,
  5: Exercise5
};

const currentExerciseComponent = computed(() => {
  return exerciseComponents[currentExercise.value as keyof typeof exerciseComponents];
});

const exercises = ref([
  { name: 'Exercise 1: Reactivity Loss', completed: false },
  { name: 'Exercise 2: Props Mutation', completed: false },
  { name: 'Exercise 3: v-model Custom Component', completed: false },
  { name: 'Exercise 4: Async Lifecycle', completed: false },
  { name: 'Exercise 5: Form Event Handling', completed: false }
]);

const completedCount = computed(() => 
  exercises.value.filter(e => e.completed).length
);

const progressPercentage = computed(() => 
  (completedCount.value / exercises.value.length) * 100
);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
