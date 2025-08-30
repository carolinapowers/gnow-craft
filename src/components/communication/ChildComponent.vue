<template>
  <div class="p-4 bg-blue-50 rounded">
    <h3 class="font-medium mb-2">Child Component</h3>
    <div class="text-sm text-gray-600">
      Received prop: <code class="bg-gray-100 px-1">{{ message }}</code>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>