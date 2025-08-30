<template>
  <div class="p-4 bg-blue-50 rounded">
    <h3 class="font-medium mb-2">Child Component (v-model)</h3>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="w-full px-3 py-2 border rounded"
      placeholder="Edit in child..."
    />
    <div class="mt-2 text-sm text-gray-600">
      Child sees: <code class="bg-gray-100 px-1">{{ modelValue }}</code>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>