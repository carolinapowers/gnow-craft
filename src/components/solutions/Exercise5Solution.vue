<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">
        Exercise 5 Solution: Player Registration Form (Fixed!)
      </h2>
      <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
        <p class="text-sm text-green-800">
          <strong>✅ Fixed:</strong> Proper form validation and event handling
        </p>
      </div>
    </div>

    <!-- Working Registration Form -->
    <div class="p-6 bg-gray-50 rounded-lg">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Player Name *
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            :class="[
              'w-full px-3 py-2 border rounded-lg',
              errors.name ? 'border-red-500' : 'border-gray-300'
            ]"
            placeholder="Enter player name"
          />
          <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            v-model="form.email"
            type="email"
            required
            :class="[
              'w-full px-3 py-2 border rounded-lg',
              errors.email ? 'border-red-500' : 'border-gray-300'
            ]"
            placeholder="Enter email address"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Handicap
          </label>
          <input
            v-model.number="form.handicap"
            type="number"
            step="0.1"
            min="0"
            max="54"
            :class="[
              'w-full px-3 py-2 border rounded-lg',
              errors.handicap ? 'border-red-500' : 'border-gray-300'
            ]"
            placeholder="Enter handicap (optional)"
          />
          <p v-if="errors.handicap" class="mt-1 text-sm text-red-600">{{ errors.handicap }}</p>
        </div>
        
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? 'Registering...' : 'Register Player' }}
        </button>
      </form>
      
      <div v-if="submitMessage" class="mt-4 p-3 rounded-lg" :class="submitSuccess ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
        {{ submitMessage }}
      </div>
    </div>

    <!-- Solution Explanation -->
    <div class="mt-6 p-4 bg-blue-50 rounded-lg">
      <h3 class="font-semibold text-blue-900 mb-2">📚 Solution Explanation:</h3>
      <p class="text-sm text-blue-800 mb-3">
        The key fixes were: using <code class="bg-white px-1 py-0.5 rounded">@submit.prevent</code> to prevent default form submission,
        implementing proper validation with reactive error messages, and handling async form submission correctly.
      </p>
      <pre class="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
// ✅ SOLUTION: Proper form handling
const handleSubmit = async () => {
  if (!validateForm()) return;
  
  try {
    isSubmitting.value = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    submitMessage.value = 'Player registered successfully!';
    submitSuccess.value = true;
    resetForm();
  } catch (error) {
    submitMessage.value = 'Registration failed. Please try again.';
    submitSuccess.value = false;
  } finally {
    isSubmitting.value = false;
  }
};</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const form = reactive({
  name: '',
  email: '',
  handicap: null as number | null
});

const errors = reactive({
  name: '',
  email: '',
  handicap: ''
});

const isSubmitting = ref(false);
const submitMessage = ref('');
const submitSuccess = ref(false);

// ✅ FIXED: Proper form validation
const validateForm = (): boolean => {
  let isValid = true;
  
  // Reset errors
  errors.name = '';
  errors.email = '';
  errors.handicap = '';
  
  // Name validation
  if (!form.name.trim()) {
    errors.name = 'Name is required';
    isValid = false;
  } else if (form.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
    isValid = false;
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email.trim()) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Please enter a valid email address';
    isValid = false;
  }
  
  // Handicap validation (optional but if provided must be valid)
  if (form.handicap !== null && (form.handicap < 0 || form.handicap > 54)) {
    errors.handicap = 'Handicap must be between 0 and 54';
    isValid = false;
  }
  
  return isValid;
};

// ✅ FIXED: Proper async form submission with prevent default
const handleSubmit = async () => {
  submitMessage.value = '';
  
  if (!validateForm()) {
    return;
  }
  
  try {
    isSubmitting.value = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('✅ Player registered:', form);
    submitMessage.value = 'Player registered successfully!';
    submitSuccess.value = true;
    
    // Reset form after successful submission
    resetForm();
  } catch (error) {
    console.error('Registration error:', error);
    submitMessage.value = 'Registration failed. Please try again.';
    submitSuccess.value = false;
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  form.name = '';
  form.email = '';
  form.handicap = null;
  errors.name = '';
  errors.email = '';
  errors.handicap = '';
};
</script>