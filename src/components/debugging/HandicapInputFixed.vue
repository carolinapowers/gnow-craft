<template>
  <div class="relative">
    <input
      v-model="value"
      type="number"
      step="0.1"
      min="0"
      max="54"
      placeholder="Enter handicap (0-54)"
      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
    />
    <div class="mt-1 text-xs text-gray-500">
      Valid range: 0.0 to 54.0
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: number;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();

// ✅ FIXED: Proper v-model implementation with computed getter/setter
const value = computed({
  get: () => props.modelValue,
  set: (newValue: number) => {
    emit('update:modelValue', newValue);
  }
});
</script>