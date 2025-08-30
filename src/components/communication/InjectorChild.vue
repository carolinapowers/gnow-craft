<template>
  <div class="p-4 bg-blue-50 rounded">
    <h3 class="font-medium mb-2">Injector Component (Descendant)</h3>
    <div class="text-sm text-gray-600">
      Injected value: <code class="bg-gray-100 px-1">{{ sharedValue }}</code>
    </div>
    <div class="mt-2">
      <NestedInjector />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, Ref } from 'vue'
import NestedInjector from './NestedInjector.vue'

const sharedValue = inject<Ref<string>>('sharedValue')
</script>