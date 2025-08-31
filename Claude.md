# GolfNow Vue.js Interview Prep Guide

## 🎯 Overview
This guide will help you practice Vue.js debugging scenarios and build features for your GolfNow interview. Each exercise builds on real-world bugs you might encounter during the technical interview with Mike Marrow's team.

## 📚 Table of Contents
1. [Quick Start](#quick-start)
2. [Debugging Exercises](#debugging-exercises)
3. [Advanced Challenges](#advanced-challenges)
4. [Feature Building](#feature-building)
5. [Interview Tips](#interview-tips)

---

## Quick Start

### Running Your Project
```bash
cd ~/Repos/gnow-craft
npm install
npm run dev
```

Navigate to http://localhost:5173 to see your app.

---

## Debugging Exercises

These exercises simulate common Vue 3 bugs you'll need to fix during your technical interview. Each bug has hints and a solution.

### Exercise 1: Reactivity Loss Bug 🔴

**Scenario**: The tee time booking counter isn't updating when users book slots.

**Bug Location**: `src/components/debugging/Exercise1.vue`

**Symptoms**:
- Clicking "Book Tee Time" doesn't update the available count
- The booked count stays at 0

**Your Task**: Fix the reactivity issue so the counts update properly.

<details>
<summary>💡 Hint 1</summary>

The problem is with how we're destructuring the reactive object. When you destructure a reactive object in Vue 3, you lose reactivity.

```javascript
// ❌ This loses reactivity
let { available, booked } = teeTimeData;

// ✅ These maintain reactivity
// Option 1: Use toRefs
const { available, booked } = toRefs(teeTimeData);

// Option 2: Access directly
teeTimeData.available--;
```
</details>

<details>
<summary>✅ Solution</summary>

```vue
<script setup lang="ts">
import { reactive, toRefs } from 'vue';

const teeTimeData = reactive({
  available: 10,
  booked: 0
});

// Solution 1: Use toRefs to maintain reactivity
const { available, booked } = toRefs(teeTimeData);

const bookTeeTime = () => {
  if (available.value > 0) {
    available.value--;
    booked.value++;
  }
};

// OR Solution 2: Access properties directly
const bookTeeTime = () => {
  if (teeTimeData.available > 0) {
    teeTimeData.available--;
    teeTimeData.booked++;
  }
};
</script>
```
</details>

---

### Exercise 2: Props Mutation Bug 🔴

**Scenario**: The golf course rating component throws warnings about mutating props.

**Bug Location**: `src/components/debugging/Exercise2.vue`

**Symptoms**:
- Console warning: "Set operation on key 'rating' failed: target is readonly"
- Parent component doesn't receive updates

**Your Task**: Fix the component to properly communicate rating changes to the parent.

<details>
<summary>💡 Hint 1</summary>

In Vue 3, props are readonly. You should never mutate them directly. Instead, emit events to the parent.

```javascript
// ❌ Never mutate props
props.course.rating = newRating;

// ✅ Emit events instead
emit('update-rating', newRating);
```
</details>

<details>
<summary>✅ Solution</summary>

```vue
<!-- Child Component -->
<script setup lang="ts">
interface Course {
  name: string;
  rating: number;
}

const props = defineProps<{
  course: Course;
}>();

const emit = defineEmits<{
  'update-rating': [rating: number];
}>();

const updateRating = () => {
  const newRating = Math.min(5, props.course.rating + 0.1);
  emit('update-rating', newRating);
};
</script>

<!-- Parent Component -->
<script setup lang="ts">
const course = ref({
  name: 'Pebble Beach',
  rating: 4.5
});

const handleRatingUpdate = (newRating: number) => {
  course.value.rating = newRating;
};
</script>

<template>
  <CourseRating 
    :course="course" 
    @update-rating="handleRatingUpdate"
  />
</template>
```
</details>

---

### Exercise 3: v-model Custom Component Bug 🔴

**Scenario**: Custom handicap input component doesn't update the parent's data.

**Bug Location**: `src/components/debugging/Exercise3.vue`

**Symptoms**:
- Typing in the input doesn't update the parent's `playerHandicap`
- Two-way binding is broken

**Your Task**: Fix the custom component to work properly with v-model.

<details>
<summary>💡 Hint 1</summary>

Custom components need to:
1. Accept a `modelValue` prop
2. Emit `update:modelValue` events

```javascript
// Props
defineProps<{
  modelValue: number;
}>();

// Emit
emit('update:modelValue', newValue);
```
</details>

<details>
<summary>✅ Solution</summary>

```vue
<!-- HandicapInput.vue -->
<script setup lang="ts">
const props = defineProps<{
  modelValue: number;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', Number(target.value));
};
</script>

<template>
  <input 
    :value="modelValue" 
    @input="updateValue"
    type="number"
    class="border rounded px-2 py-1"
    placeholder="Enter handicap"
  />
</template>
```
</details>

---

### Exercise 4: Async Lifecycle Bug 🔴

**Scenario**: Golf courses list shows "undefined" initially and crashes.

**Bug Location**: `src/components/debugging/Exercise4.vue`

**Symptoms**:
- "Featured: undefined" appears before data loads
- Potential runtime errors accessing properties of undefined

**Your Task**: Fix the component to handle async data properly.

<details>
<summary>💡 Hint 1</summary>

Don't access async data immediately in setup. Use `computed` properties that react to data changes.

```javascript
// ❌ This runs immediately, before data loads
const featuredCourse = courses.value[0]?.name;

// ✅ This reacts to data changes
const featuredCourse = computed(() => 
  courses.value[0]?.name || 'Loading...'
);
```
</details>

<details>
<summary>✅ Solution</summary>

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface Course {
  id: number;
  name: string;
}

const courses = ref<Course[]>([]);
const loading = ref(false);

// Use computed for derived state
const featuredCourse = computed(() => {
  return courses.value.length > 0 
    ? courses.value[0].name 
    : 'Loading...';
});

onMounted(async () => {
  loading.value = true;
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    courses.value = [
      { id: 1, name: 'Augusta National' },
      { id: 2, name: 'St. Andrews' }
    ];
  } finally {
    loading.value = false;
  }
});
</script>
```
</details>

---

### Exercise 5: Form Event Handling Bug 🔴

**Scenario**: Booking form submits and refreshes the page instead of handling data.

**Bug Location**: `src/components/debugging/Exercise5.vue`

**Symptoms**:
- Page refreshes when form is submitted
- Data is lost
- No confirmation message appears

**Your Task**: Prevent the default form submission and handle the data properly.

<details>
<summary>💡 Hint 1</summary>

Use Vue's event modifiers to prevent default behavior:

```vue
<!-- ❌ Without prevention -->
<form @submit="handleSubmit">

<!-- ✅ With prevention -->
<form @submit.prevent="handleSubmit">
```
</details>

<details>
<summary>✅ Solution</summary>

```vue
<script setup lang="ts">
import { reactive } from 'vue';

const bookingData = reactive({
  name: '',
  date: '',
  players: 1
});

const handleSubmit = () => {
  console.log('Booking submitted:', bookingData);
  alert(`Booking for ${bookingData.name} confirmed!`);
  // Reset form or navigate
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <!-- form fields -->
    <button type="submit">Submit Booking</button>
  </form>
</template>
```
</details>

---

## Advanced Challenges

### Challenge 1: State Management Pattern

**Task**: Implement a simple store pattern for managing golf course bookings across components without Pinia.

<details>
<summary>📝 Requirements</summary>

1. Create a reactive store for bookings
2. Share state between multiple components
3. Implement methods to add/remove bookings
4. Show booking count in header

</details>

<details>
<summary>✅ Solution</summary>

```typescript
// src/stores/bookingStore.ts
import { reactive, readonly } from 'vue';

interface Booking {
  id: string;
  courseName: string;
  date: string;
  time: string;
  players: number;
}

const state = reactive({
  bookings: [] as Booking[],
  isLoading: false
});

export const bookingStore = {
  state: readonly(state),
  
  addBooking(booking: Omit<Booking, 'id'>) {
    const newBooking = {
      ...booking,
      id: Date.now().toString()
    };
    state.bookings.push(newBooking);
    return newBooking;
  },
  
  removeBooking(id: string) {
    const index = state.bookings.findIndex(b => b.id === id);
    if (index > -1) {
      state.bookings.splice(index, 1);
    }
  },
  
  getBookingCount() {
    return state.bookings.length;
  }
};
```
</details>

---

### Challenge 2: Composable for API Calls

**Task**: Create a reusable composable for fetching golf course data with loading and error states.

<details>
<summary>📝 Requirements</summary>

1. Generic composable for API calls
2. Loading, error, and data states
3. Automatic retry on failure
4. TypeScript support

</details>

<details>
<summary>✅ Solution</summary>

```typescript
// src/composables/useApi.ts
import { ref, Ref } from 'vue';

interface UseApiReturn<T> {
  data: Ref<T | null>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  execute: () => Promise<void>;
}

export function useApi<T>(
  url: string,
  options: RequestInit = {}
): UseApiReturn<T> {
  const data = ref<T | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const execute = async (retries = 3) => {
    loading.value = true;
    error.value = null;
    
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        data.value = await response.json();
        break;
      } catch (e) {
        if (i === retries - 1) {
          error.value = e as Error;
        } else {
          await new Promise(r => setTimeout(r, 1000 * (i + 1)));
        }
      }
    }
    
    loading.value = false;
  };

  return { data, loading, error, execute };
}
```
</details>

---

## Feature Building

### Feature 1: Build a Complete Tee Time Search

Create a full-featured tee time search with filters, sorting, and pagination.

**Requirements**:
- Date range picker
- Price filter
- Course difficulty filter
- Sort by price/rating/distance
- Pagination (10 results per page)
- Responsive design with Tailwind

### Feature 2: Implement Real-time Availability

Build a system that shows real-time tee time availability with WebSocket simulation.

**Requirements**:
- Mock WebSocket connection
- Live updates when slots are booked
- Visual indicators for availability changes
- Optimistic UI updates

---

## Interview Tips

### Technical Interview Strategy

1. **Think Out Loud**: Explain your debugging process
   - "I see the issue might be with reactivity..."
   - "Let me check if props are being mutated..."

2. **Ask Clarifying Questions**:
   - "Should this component handle its own state or emit to parent?"
   - "What's the expected behavior when the API fails?"

3. **Show Best Practices**:
   - Use TypeScript interfaces
   - Add proper error handling
   - Consider edge cases

### Common Vue 3 Interview Questions

**Q: Difference between ref and reactive?**
```typescript
// ref: for primitives and objects
const count = ref(0);
count.value++; // Need .value

// reactive: for objects only
const state = reactive({ count: 0 });
state.count++; // Direct access
```

**Q: When to use computed vs watch?**
```typescript
// computed: derive state from other state
const fullName = computed(() => 
  `${firstName.value} ${lastName.value}`
);

// watch: side effects when state changes
watch(userId, async (newId) => {
  await fetchUserData(newId);
});
```

**Q: How does Vue 3's reactivity work?**
- Uses JavaScript Proxies
- Tracks dependencies automatically
- Updates only affected components

### Mike's Team Specific Tips

Based on your conversation with Mike:

1. **Emphasize Collaboration**:
   - "I enjoy pair programming and code reviews"
   - "I believe in clear communication with designers"

2. **Show Learning Mindset**:
   - "I'm excited to learn Nuxt for the headless architecture"
   - "I'd love to contribute to the design system"

3. **Demonstrate Problem-Solving**:
   - Start with the simplest solution
   - Iterate to improve
   - Explain trade-offs

### Questions to Ask

Technical:
- "How do you handle state management between GolfNow and GolfPass?"
- "What's your approach to component testing?"
- "How does the team handle accessibility requirements?"

Team/Culture:
- "What does a typical sprint look like?"
- "How do you onboard new team members?"
- "What opportunities exist for learning and growth?"

---

## Practice Schedule

### Week 1 (Current Week)
- [ ] Complete all 5 debugging exercises
- [ ] Build the booking store pattern
- [ ] Create the useApi composable
- [ ] Practice explaining Vue reactivity

### Week 2 (Before Interview)
- [ ] Build the tee time search feature
- [ ] Implement mock real-time updates
- [ ] Review Nuxt.js basics
- [ ] Practice whiteboard coding

### Day Before Interview
- [ ] Review this guide
- [ ] Test all debugging solutions
- [ ] Prepare questions for Mike
- [ ] Get good rest!

---

## Resources

### Vue 3 Documentation
- [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [TypeScript with Vue](https://vuejs.org/guide/typescript/composition-api.html)

### Practice Platforms
- [Vue.js Challenges](https://github.com/webfansplz/vuejs-challenges)
- [Vue School](https://vueschool.io/courses)

### GolfNow Specific
- Research their current platform
- Understand golf terminology
- Think about user personas (casual vs serious golfers)

---

## Final Checklist

Before your interview:

- [ ] All exercises running without errors
- [ ] Comfortable with Vue 3 Composition API
- [ ] Can explain reactivity system
- [ ] Practiced debugging out loud
- [ ] Reviewed TypeScript basics
- [ ] Understand Tailwind utility classes
- [ ] Prepared examples from past experience
- [ ] Ready to discuss design systems
- [ ] Questions prepared for the team

Remember: Mike already believes in you! Focus on demonstrating your Vue.js skills and collaborative mindset. You've got this! 🚀

---

## Quick Commands

```bash
# Run the project
npm run dev

# Type check
npm run build

# Navigate to different sections:
# Debugging Exercises: http://localhost:5173/debugging-exercises
# Solutions: http://localhost:5173/debugging-solutions  
# Advanced Patterns: http://localhost:5173/advanced-patterns
```

## Project Structure

Your gnow-craft project is now set up with:

```
src/
├── components/
│   ├── debugging/          # Buggy components to fix
│   │   ├── Exercise1.vue   # Reactivity loss
│   │   ├── Exercise2.vue   # Props mutation
│   │   ├── Exercise3.vue   # v-model custom
│   │   ├── Exercise4.vue   # Async lifecycle
│   │   ├── Exercise5.vue   # Form events
│   │   ├── CourseRating.vue
│   │   └── HandicapInput.vue
│   └── solutions/          # Fixed versions
├── composables/
│   └── useApi.ts          # Reusable API composable
├── stores/
│   └── bookingStore.ts    # Store pattern example
└── views/
    ├── DebuggingExercises.vue  # Practice exercises
    ├── DebuggingSolutions.vue   # Solutions reference
    └── AdvancedPatterns.vue     # Advanced patterns
```

Good luck with your interview! 🏌️‍♂️
