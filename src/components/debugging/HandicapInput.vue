<template>
  <div class="relative">
    <input 
      :value="modelValue" 
      @input="updateValue"
      type="number"
      min="0"
      max="36"
      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
      placeholder="Enter handicap (0-36)"
    />
    <div class="mt-2 p-2 bg-yellow-100 rounded text-xs">
      <p class="text-yellow-800">
        ⚠️ This input doesn't update the parent's value correctly!
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: number;
}>();

// BUG: This component is not emitting the correct event for v-model!
const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  // ❌ This is wrong - we're trying to mutate the prop directly!
  // @ts-ignore
  props.modelValue = Number(target.value);
  
  console.log('Attempted to update value to:', target.value);
  console.log('But prop value is still:', props.modelValue);
};

// TO FIX THIS BUG:
// 1. Define the emit: const emit = defineEmits<{ 'update:modelValue': [value: number] }>();
// 2. In updateValue, emit the event: emit('update:modelValue', Number(target.value));
// 3. Remove the direct prop mutation
</script>
