<template>
  <details :id="id" class="bg-white rounded-lg shadow-lg border-l-4 scroll-mt-4" :class="borderColorClass">
    <summary class="cursor-pointer p-8 hover:bg-gray-50 transition list-none">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-3">
            <svg
              class="w-6 h-6 text-gray-400 transform transition-transform duration-200 details-open:rotate-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <h2 class="text-2xl font-bold text-gray-900">
              {{ title }}
            </h2>
          </div>
          <p class="text-gray-600 mt-2 ml-9">{{ description }}</p>
        </div>
        <span class="px-3 py-1 rounded-full text-sm font-semibold ml-4" :class="badgeClass">
          {{ badge }}
        </span>
      </div>
    </summary>

    <div class="px-8 pb-8 space-y-4">
      <slot />
    </div>
  </details>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  id?: string;
  title: string;
  description: string;
  badge: string;
  borderColor?: 'red' | 'yellow' | 'purple' | 'blue' | 'green' | 'orange' | 'pink';
}

const props = withDefaults(defineProps<Props>(), {
  borderColor: 'red'
});

const borderColorClass = computed(() => {
  const colors = {
    red: 'border-red-500',
    yellow: 'border-yellow-500',
    purple: 'border-purple-500',
    blue: 'border-blue-500',
    green: 'border-green-500',
    orange: 'border-orange-500',
    pink: 'border-pink-500'
  };
  return colors[props.borderColor];
});

const badgeClass = computed(() => {
  const classes = {
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    orange: 'bg-orange-100 text-orange-800',
    pink: 'bg-pink-100 text-pink-800'
  };
  return classes[props.borderColor];
});
</script>

<style scoped>
details[open] summary svg {
  transform: rotate(90deg);
}
</style>
