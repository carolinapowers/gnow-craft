<template>
  <div class="min-h-screen bg-gradient-to-br from-golf-50 to-green-50">
    <Header :completed-count="completedChallenges.length" :total-count="challenges.length" />
    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          Master Frontend Skills for GolfNow
        </h2>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto">
          Practice Vue.js, TypeScript, and JavaScript concepts commonly used in golf booking platforms. 
          Build your confidence with hands-on coding challenges and realistic scenarios.
        </p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg p-6 text-center shadow-sm">
          <div class="text-2xl font-bold text-golf-600">{{ challenges.length }}</div>
          <div class="text-sm text-gray-500">Total Challenges</div>
        </div>
        <div class="bg-white rounded-lg p-6 text-center shadow-sm">
          <div class="text-2xl font-bold text-green-600">{{ completedChallenges.length }}</div>
          <div class="text-sm text-gray-500">Completed</div>
        </div>
        <div class="bg-white rounded-lg p-6 text-center shadow-sm">
          <div class="text-2xl font-bold text-blue-600">{{ currentStreak }}</div>
          <div class="text-sm text-gray-500">Day Streak</div>
        </div>
        <div class="bg-white rounded-lg p-6 text-center shadow-sm">
          <div class="text-2xl font-bold text-purple-600">{{ Math.round(progressPercentage) }}%</div>
          <div class="text-sm text-gray-500">Progress</div>
        </div>
      </div>

      <!-- Practice Sections -->
      <div class="space-y-8">
        <!-- Interactive Tee Time Booking -->
        <section>
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Practice: Interactive Booking Interface</h3>
          <TeeTimeBooking />
        </section>

        <!-- Coding Challenges -->
        <section>
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold text-gray-900">Coding Challenges</h3>
            <div class="flex space-x-2">
              <select 
                v-model="selectedCategory" 
                class="rounded-md border-gray-300 shadow-sm focus:border-golf-500 focus:ring-golf-500"
              >
                <option value="">All Categories</option>
                <option value="Vue">Vue</option>
                <option value="JavaScript">JavaScript</option>
                <option value="TypeScript">TypeScript</option>
                <option value="Components">Components</option>
              </select>
              <select 
                v-model="selectedDifficulty" 
                class="rounded-md border-gray-300 shadow-sm focus:border-golf-500 focus:ring-golf-500"
              >
                <option value="">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ChallengeCard
              v-for="challenge in filteredChallenges"
              :key="challenge.id"
              :challenge="challenge"
              :is-completed="completedChallenges.includes(challenge.id)"
              @select="openChallenge"
            />
          </div>
        </section>

        <!-- Tips & Resources -->
        <section class="bg-white rounded-lg p-6 shadow-sm">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Interview Tips for GolfNow Frontend Role</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Vue.js Concepts to Master</h4>
              <ul class="text-sm text-gray-600 space-y-1">
                <li>• Composition API and reactivity</li>
                <li>• Component communication (props, events)</li>
                <li>• State management with Pinia/Vuex</li>
                <li>• Vue Router for SPA navigation</li>
                <li>• Custom directives and composables</li>
              </ul>
            </div>
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Domain-Specific Skills</h4>
              <ul class="text-sm text-gray-600 space-y-1">
                <li>• Date/time handling for bookings</li>
                <li>• Real-time availability updates</li>
                <li>• Form validation and UX patterns</li>
                <li>• Mobile-responsive design</li>
                <li>• Performance optimization</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Challenge Modal -->
    <ChallengeModal
      v-if="selectedChallenge"
      :challenge="selectedChallenge"
      :is-open="!!selectedChallenge"
      @close="closeChallenge"
      @complete="markChallengeComplete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Header from './components/Header.vue'
import ChallengeCard from './components/ChallengeCard.vue'
import ChallengeModal from './components/ChallengeModal.vue'
import TeeTimeBooking from './components/TeeTimeBooking.vue'
import { challenges } from './data/challenges'
import type { Challenge } from './types'

const completedChallenges = ref<string[]>([])
const currentStreak = ref(3)
const selectedCategory = ref('')
const selectedDifficulty = ref('')
const selectedChallenge = ref<Challenge | null>(null)

const progressPercentage = computed(() => {
  return challenges.length > 0 ? (completedChallenges.value.length / challenges.length) * 100 : 0
})

const filteredChallenges = computed(() => {
  return challenges.filter(challenge => {
    const categoryMatch = !selectedCategory.value || challenge.category === selectedCategory.value
    const difficultyMatch = !selectedDifficulty.value || challenge.difficulty === selectedDifficulty.value
    return categoryMatch && difficultyMatch
  })
})

const openChallenge = (challengeId: string) => {
  const challenge = challenges.find(c => c.id === challengeId)
  if (challenge) {
    selectedChallenge.value = challenge
  }
}

const closeChallenge = () => {
  selectedChallenge.value = null
}

const markChallengeComplete = (challengeId: string) => {
  if (!completedChallenges.value.includes(challengeId)) {
    completedChallenges.value.push(challengeId)
  }
}
</script>