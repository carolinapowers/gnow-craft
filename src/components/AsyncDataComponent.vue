<template>
  <div class="p-3 bg-green-50 rounded">
    <p class="text-sm font-semibold">Async Data Loaded!</p>
    <p class="text-sm">{{ data }}</p>
  </div>
</template>

<script setup lang="ts">
// Simulate async data fetching
const data = await new Promise<string>((resolve) => {
  setTimeout(() => {
    resolve('Data fetched after 2 seconds')
  }, 2000)
})
</script>