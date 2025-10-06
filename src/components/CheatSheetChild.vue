<template>
  <div class="p-3 bg-blue-50 rounded">
    <p class="text-sm">Child received: {{ message }}</p>
    <button @click="sendMessage" class="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm">
      Send to Parent
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string
}>()

const emit = defineEmits<{
  update: [value: string]
}>()

const sendMessage = () => {
  emit('update', 'Hello from child!')
}
</script>