<template>
  <div class="p-4 bg-blue-50 rounded">
    <h3 class="font-medium mb-2">Child Component</h3>
    <button
      @click="emitEvent"
      class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Emit Event to Parent
    </button>
    <div class="mt-2 text-sm text-gray-600">
      Click count: {{ clickCount }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  'custom-event': [value: string]
}>()

const clickCount = ref(0)

const emitEvent = () => {
  clickCount.value++
  emit('custom-event', `Event #${clickCount.value} at ${new Date().toLocaleTimeString()}`)
}
</script>