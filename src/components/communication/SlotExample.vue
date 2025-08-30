<template>
  <div class="p-4 bg-white border rounded-lg">
    <div class="border-b pb-2 mb-2">
      <slot name="header">
        <h3 class="font-medium text-gray-500">Default Header</h3>
      </slot>
    </div>
    
    <div class="py-2">
      <slot>
        <p class="text-gray-400">Default content when no slot content provided</p>
      </slot>
    </div>
    
    <div class="border-t pt-2 mt-2">
      <slot name="footer">
        <p class="text-xs text-gray-400">Default Footer</p>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>