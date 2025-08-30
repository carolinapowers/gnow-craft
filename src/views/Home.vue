<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
    <div class="container mx-auto px-4 py-8">
      <header class="text-center mb-12">
        <h1 class="text-5xl font-bold text-emerald-800 mb-4">
          GolfNow Interview Prep
        </h1>
        <p class="text-xl text-emerald-600">
          Master Vue.js and frontend concepts for your GolfNow interview
        </p>
      </header>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <router-link
          v-for="section in sections"
          :key="section.path"
          :to="section.path"
          class="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-emerald-100 hover:border-emerald-300"
        >
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <span class="text-2xl">{{ section.icon }}</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 ml-4">{{ section.title }}</h3>
          </div>
          <p class="text-gray-600 mb-4">{{ section.description }}</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in section.tags"
              :key="tag"
              class="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full"
            >
              {{ tag }}
            </span>
          </div>
        </router-link>
      </div>

      <div class="mt-12 bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Interview Focus Areas</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-semibold text-emerald-700 mb-2">Core Vue.js Concepts</h3>
            <ul class="space-y-1 text-gray-600">
              <li class="flex items-start">
                <span class="text-emerald-500 mr-2">✓</span>
                Composition API vs Options API
              </li>
              <li class="flex items-start">
                <span class="text-emerald-500 mr-2">✓</span>
                Reactive data management
              </li>
              <li class="flex items-start">
                <span class="text-emerald-500 mr-2">✓</span>
                Component lifecycle hooks
              </li>
              <li class="flex items-start">
                <span class="text-emerald-500 mr-2">✓</span>
                Props, emits, and slots
              </li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-emerald-700 mb-2">GolfNow-Specific Skills</h3>
            <ul class="space-y-1 text-gray-600">
              <li class="flex items-start">
                <span class="text-emerald-500 mr-2">✓</span>
                Real-time availability systems
              </li>
              <li class="flex items-start">
                <span class="text-emerald-500 mr-2">✓</span>
                Complex filtering interfaces
              </li>
              <li class="flex items-start">
                <span class="text-emerald-500 mr-2">✓</span>
                Date/time selection components
              </li>
              <li class="flex items-start">
                <span class="text-emerald-500 mr-2">✓</span>
                Performance optimization
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Section {
  title: string
  path: string
  description: string
  icon: string
  tags: string[]
}

const sections: Section[] = [
  {
    title: 'Tee Time Booking',
    path: '/tee-time-booking',
    description: 'Build a complete tee time booking interface with filtering, availability, and real-time updates.',
    icon: '⛳',
    tags: ['Components', 'Forms', 'Validation']
  },
  {
    title: 'Coding Challenges',
    path: '/challenges',
    description: 'Interactive Vue.js coding challenges similar to what you might encounter in the interview.',
    icon: '💻',
    tags: ['Problem Solving', 'Vue 3', 'TypeScript']
  },
  {
    title: 'Component Communication',
    path: '/component-communication',
    description: 'Master props, emits, provide/inject, and other component communication patterns.',
    icon: '🔄',
    tags: ['Props', 'Events', 'Slots']
  },
  {
    title: 'Reactive Data',
    path: '/reactive-data',
    description: 'Practice with ref, reactive, computed, and watchers in real-world scenarios.',
    icon: '📊',
    tags: ['Reactivity', 'Computed', 'Watchers']
  },
  {
    title: 'JavaScript Fundamentals',
    path: '/javascript-practice',
    description: 'Master core JavaScript concepts commonly tested in frontend interviews.',
    icon: '🔧',
    tags: ['ES6+', 'Algorithms', 'DOM', 'Async']
  },
  {
    title: 'Testing with Vitest',
    path: '/testing-practice',
    description: 'Learn unit testing, component testing, and TDD practices with Vitest and Vue Test Utils.',
    icon: '🧪',
    tags: ['Unit Tests', 'TDD', 'Mocking', 'Coverage']
  },
  {
    title: 'Practice Arena',
    path: '/practice',
    description: 'Free-form practice area to experiment with Vue concepts and build components.',
    icon: '🎯',
    tags: ['Sandbox', 'Experimentation']
  }
]
</script>