<template>
  <div class="p-3 bg-blue-100 rounded mt-2">
    <div class="text-sm">
      <strong>Deeply Nested Component</strong>
      <div class="text-gray-600">
        Also sees: <code class="bg-white px-1">{{ sharedValue }}</code>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, Ref } from 'vue'

const sharedValue = inject<Ref<string>>('sharedValue')
</script>