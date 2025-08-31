<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-green-800 mb-4">
          ✅ Vue Debugging Solutions
        </h1>
        <p class="text-gray-600">
          Here are the correct solutions to all debugging exercises. Study these patterns for your interview!
        </p>
      </div>

      <!-- Quick Navigation -->
      <div class="mb-8 p-4 bg-white rounded-lg shadow">
        <h2 class="font-semibold mb-3">Jump to Solution:</h2>
        <div class="flex flex-wrap gap-2">
          <a
            v-for="(solution, index) in solutions"
            :key="index"
            :href="`#solution-${index + 1}`"
            class="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
          >
            {{ solution.title }}
          </a>
        </div>
      </div>

      <!-- Solutions -->
      <div class="space-y-8">
        <!-- Solution 1: Reactivity -->
        <div id="solution-1" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold mb-4">Solution 1: Reactivity Loss</h2>
          
          <div class="mb-4 p-4 bg-red-50 rounded">
            <p class="text-sm text-red-800">
              <strong>❌ Problem:</strong> Destructuring reactive objects loses reactivity
            </p>
          </div>
          
          <div class="mb-4 p-4 bg-green-50 rounded">
            <p class="text-sm text-green-800">
              <strong>✅ Solution:</strong> Use toRefs() or access properties directly
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 class="font-semibold mb-2 text-red-600">❌ Wrong Way:</h3>
              <pre class="bg-gray-900 text-red-400 p-3 rounded text-xs overflow-x-auto">
const teeTimeData = reactive({
  available: 10,
  booked: 0
});

// Loses reactivity!
let { available, booked } = teeTimeData;

const bookTeeTime = () => {
  available--; // Won't update UI
  booked++;    // Won't update UI
};</pre>
            </div>
            
            <div>
              <h3 class="font-semibold mb-2 text-green-600">✅ Correct Way:</h3>
              <pre class="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
const teeTimeData = reactive({
  available: 10,
  booked: 0
});

// Option 1: toRefs
const { available, booked } = toRefs(teeTimeData);
available.value--;

// Option 2: Direct access
teeTimeData.available--;</pre>
            </div>
          </div>
        </div>

        <!-- Solution 2: Props Mutation -->
        <div id="solution-2" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold mb-4">Solution 2: Props Mutation</h2>
          
          <div class="mb-4 p-4 bg-red-50 rounded">
            <p class="text-sm text-red-800">
              <strong>❌ Problem:</strong> Directly mutating props (they're readonly!)
            </p>
          </div>
          
          <div class="mb-4 p-4 bg-green-50 rounded">
            <p class="text-sm text-green-800">
              <strong>✅ Solution:</strong> Emit events to parent for updates
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 class="font-semibold mb-2 text-red-600">❌ Wrong Way:</h3>
              <pre class="bg-gray-900 text-red-400 p-3 rounded text-xs overflow-x-auto">
// Child Component
const props = defineProps&lt;{
  course: Course;
}&gt;();

const updateRating = () => {
  // Never mutate props!
  props.course.rating += 0.1;
};</pre>
            </div>
            
            <div>
              <h3 class="font-semibold mb-2 text-green-600">✅ Correct Way:</h3>
              <pre class="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
// Child Component
const emit = defineEmits&lt;{
  'update-rating': [rating: number];
}&gt;();

const updateRating = () => {
  const newRating = props.course.rating + 0.1;
  emit('update-rating', newRating);
};

// Parent handles the update
const handleRatingUpdate = (rating) => {
  course.value.rating = rating;
};</pre>
            </div>
          </div>
        </div>

        <!-- Solution 3: v-model Custom Component -->
        <div id="solution-3" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold mb-4">Solution 3: v-model with Custom Components</h2>
          
          <div class="mb-4 p-4 bg-red-50 rounded">
            <p class="text-sm text-red-800">
              <strong>❌ Problem:</strong> Not emitting the correct event for v-model
            </p>
          </div>
          
          <div class="mb-4 p-4 bg-green-50 rounded">
            <p class="text-sm text-green-800">
              <strong>✅ Solution:</strong> Use modelValue prop and update:modelValue event
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 class="font-semibold mb-2 text-red-600">❌ Wrong Way:</h3>
              <pre class="bg-gray-900 text-red-400 p-3 rounded text-xs overflow-x-auto">
// Custom Input Component
const props = defineProps&lt;{
  modelValue: number;
}&gt;();

const updateValue = (e) => {
  // Wrong! Mutating prop
  props.modelValue = e.target.value;
};</pre>
            </div>
            
            <div>
              <h3 class="font-semibold mb-2 text-green-600">✅ Correct Way:</h3>
              <pre class="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
// Custom Input Component
const props = defineProps&lt;{
  modelValue: number;
}&gt;();

const emit = defineEmits&lt;{
  'update:modelValue': [value: number];
}&gt;();

const updateValue = (e) => {
  emit('update:modelValue', Number(e.target.value));
};</pre>
            </div>
          </div>
        </div>

        <!-- Solution 4: Async Lifecycle -->
        <div id="solution-4" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold mb-4">Solution 4: Async Data Handling</h2>
          
          <div class="mb-4 p-4 bg-red-50 rounded">
            <p class="text-sm text-red-800">
              <strong>❌ Problem:</strong> Accessing async data before it loads
            </p>
          </div>
          
          <div class="mb-4 p-4 bg-green-50 rounded">
            <p class="text-sm text-green-800">
              <strong>✅ Solution:</strong> Use computed properties for derived async state
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 class="font-semibold mb-2 text-red-600">❌ Wrong Way:</h3>
              <pre class="bg-gray-900 text-red-400 p-3 rounded text-xs overflow-x-auto">
const courses = ref&lt;Course[]&gt;([]);

// This runs immediately, before data loads
const featuredCourse = courses.value[0]?.name;

onMounted(async () => {
  // Data loads later
  courses.value = await fetchCourses();
  // featuredCourse is still undefined!
});</pre>
            </div>
            
            <div>
              <h3 class="font-semibold mb-2 text-green-600">✅ Correct Way:</h3>
              <pre class="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
const courses = ref&lt;Course[]&gt;([]);

// Computed reacts to changes
const featuredCourse = computed(() => 
  courses.value.length > 0 
    ? courses.value[0].name 
    : 'Loading...'
);

onMounted(async () => {
  courses.value = await fetchCourses();
  // featuredCourse updates automatically!
});</pre>
            </div>
          </div>
        </div>

        <!-- Solution 5: Form Events -->
        <div id="solution-5" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold mb-4">Solution 5: Form Event Handling</h2>
          
          <div class="mb-4 p-4 bg-red-50 rounded">
            <p class="text-sm text-red-800">
              <strong>❌ Problem:</strong> Form submits and page refreshes
            </p>
          </div>
          
          <div class="mb-4 p-4 bg-green-50 rounded">
            <p class="text-sm text-green-800">
              <strong>✅ Solution:</strong> Prevent default form submission
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 class="font-semibold mb-2 text-red-600">❌ Wrong Way:</h3>
              <pre class="bg-gray-900 text-red-400 p-3 rounded text-xs overflow-x-auto">
&lt;template&gt;
  &lt;form @submit="handleSubmit"&gt;
    &lt;!-- Page will refresh! --&gt;
  &lt;/form&gt;
&lt;/template&gt;

&lt;script setup&gt;
const handleSubmit = () => {
  // This code never runs
  console.log('Submitting...');
};
&lt;/script&gt;</pre>
            </div>
            
            <div>
              <h3 class="font-semibold mb-2 text-green-600">✅ Correct Way:</h3>
              <pre class="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
&lt;template&gt;
  &lt;form @submit.prevent="handleSubmit"&gt;
    &lt;!-- .prevent modifier! --&gt;
  &lt;/form&gt;
&lt;/template&gt;

&lt;script setup&gt;
const handleSubmit = () => {
  // This works!
  console.log('Submitting...');
};

// Or handle in method:
const handleSubmit = (e: Event) => {
  e.preventDefault();
};
&lt;/script&gt;</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- Key Takeaways -->
      <div class="mt-12 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
        <h2 class="text-2xl font-bold mb-4">🎯 Key Takeaways for Your Interview</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-semibold mb-3">Common Patterns to Remember:</h3>
            <ul class="list-disc list-inside space-y-2 text-sm">
              <li>Use <code class="bg-white px-1 rounded">toRefs()</code> when destructuring reactive objects</li>
              <li>Never mutate props - emit events instead</li>
              <li>v-model requires <code class="bg-white px-1 rounded">modelValue</code> and <code class="bg-white px-1 rounded">update:modelValue</code></li>
              <li>Use computed for derived async state</li>
              <li>Always prevent default form submission in SPAs</li>
            </ul>
          </div>
          
          <div>
            <h3 class="font-semibold mb-3">Interview Tips:</h3>
            <ul class="list-disc list-inside space-y-2 text-sm">
              <li>Explain your debugging process out loud</li>
              <li>Check the browser console for warnings</li>
              <li>Use Vue DevTools to inspect component state</li>
              <li>Consider edge cases (empty arrays, null values)</li>
              <li>Ask clarifying questions if unsure</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Practice Reminder -->
      <div class="mt-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 class="font-semibold text-yellow-900 mb-2">📝 Practice Tip:</h3>
        <p class="text-sm text-yellow-800">
          Try to fix the broken exercises first without looking at these solutions. 
          Then compare your approach with these solutions. Remember, there might be multiple correct ways to fix each issue!
        </p>
        <div class="mt-4">
          <router-link 
            to="/debugging-exercises" 
            class="inline-block px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
          >
            Go Back to Exercises
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const solutions = ref([
  { title: 'Reactivity Loss' },
  { title: 'Props Mutation' },
  { title: 'v-model Custom' },
  { title: 'Async Lifecycle' },
  { title: 'Form Events' }
]);
</script>
