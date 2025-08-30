<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 to-indigo-100 py-8">
    <div class="container mx-auto px-4">
      <header class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">CSS & Styling Best Practices</h1>
        <p class="text-gray-600">Master responsive design, Tailwind CSS, and Vue styling patterns</p>
      </header>

      <div class="max-w-6xl mx-auto">
        <!-- Category Tabs -->
        <div class="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            v-for="category in categories"
            :key="category"
            @click="activeCategory = category"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              activeCategory === category
                ? 'bg-pink-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            ]"
          >
            {{ category }}
          </button>
        </div>

        <!-- CSS Scenarios Grid -->
        <div class="grid gap-6">
          <div
            v-for="scenario in filteredScenarios"
            :key="scenario.id"
            class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-semibold text-gray-800">{{ scenario.title }}</h3>
                <span :class="difficultyColors[scenario.difficulty]" class="px-2 py-1 text-xs rounded-full">
                  {{ scenario.difficulty }}
                </span>
              </div>
              
              <p class="text-gray-600 mb-4">{{ scenario.description }}</p>
              
              <!-- Code Example -->
              <div class="mb-6">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-medium text-gray-800">Implementation</h4>
                  <button
                    @click="toggleCode(scenario.id)"
                    class="text-pink-600 hover:text-pink-700 text-sm"
                  >
                    {{ expandedCode.includes(scenario.id) ? 'Hide' : 'Show' }} Code
                  </button>
                </div>
                
                <div v-show="expandedCode.includes(scenario.id)" class="space-y-4">
                  <!-- Vue Component Code -->
                  <div>
                    <h5 class="text-sm font-medium text-gray-700 mb-1">Vue Component</h5>
                    <div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{{ scenario.vueCode }}</pre>
                    </div>
                  </div>
                  
                  <!-- CSS/Tailwind Code -->
                  <div>
                    <h5 class="text-sm font-medium text-gray-700 mb-1">{{ scenario.cssLabel }}</h5>
                    <div class="bg-gray-900 text-blue-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{{ scenario.cssCode }}</pre>
                    </div>
                  </div>
                </div>
              </div>


              <!-- Key Concepts -->
              <div class="mb-4">
                <h4 class="font-medium text-gray-800 mb-2">Key Concepts:</h4>
                <ul class="space-y-1">
                  <li 
                    v-for="concept in scenario.concepts"
                    :key="concept"
                    class="text-sm text-gray-600 flex items-start"
                  >
                    <span class="text-pink-500 mr-2 mt-1">•</span>
                    {{ concept }}
                  </li>
                </ul>
              </div>

              <!-- Tags -->
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in scenario.tags"
                  :key="tag"
                  class="px-2 py-1 bg-pink-50 text-pink-700 text-xs rounded-full"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Best Practices Guide -->
        <div class="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">CSS Best Practices for GolfNow</h2>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Performance -->
            <div>
              <h3 class="font-semibold text-pink-700 mb-3 flex items-center">
                <span class="mr-2">⚡</span>
                Performance
              </h3>
              <ul class="space-y-2 text-sm text-gray-600">
                <li class="flex items-start">
                  <span class="text-pink-500 mr-2">✓</span>
                  Use Tailwind's purge/content config
                </li>
                <li class="flex items-start">
                  <span class="text-pink-500 mr-2">✓</span>
                  Minimize CSS bundle size
                </li>
                <li class="flex items-start">
                  <span class="text-pink-500 mr-2">✓</span>
                  Optimize critical CSS loading
                </li>
                <li class="flex items-start">
                  <span class="text-pink-500 mr-2">✓</span>
                  Use CSS containment when possible
                </li>
              </ul>
            </div>

            <!-- Responsive Design -->
            <div>
              <h3 class="font-semibold text-pink-700 mb-3 flex items-center">
                <span class="mr-2">📱</span>
                Responsive Design
              </h3>
              <ul class="space-y-2 text-sm text-gray-600">
                <li class="flex items-start">
                  <span class="text-pink-500 mr-2">✓</span>
                  Mobile-first approach
                </li>
                <li class="flex items-start">
                  <span class="text-pink-500 mr-2">✓</span>
                  Use Tailwind breakpoint system
                </li>
                <li class="flex items-start">
                  <span class="text-pink-500 mr-2">✓</span>
                  Test across device sizes
                </li>
                <li class="flex items-start">
                  <span class="text-pink-500 mr-2">✓</span>
                  Consider touch targets (44px min)
                </li>
              </ul>
            </div>

            <!-- Maintainability -->
            <div>
              <h3 class="font-semibold text-pink-700 mb-3 flex items-center">
                <span class="mr-2">🔧</span>
                Maintainability
              </h3>
              <ul class="space-y-2 text-sm text-gray-600">
                <li class="flex items-start">
                  <span class="text-pink-500 mr-2">✓</span>
                  Use design tokens consistently
                </li>
                <li class="flex items-start">
                  <span class="text-pink-500 mr-2">✓</span>
                  Create reusable component classes
                </li>
                <li class="flex items-start">
                  <span class="text-pink-500 mr-2">✓</span>
                  Document custom utility classes
                </li>
                <li class="flex items-start">
                  <span class="text-pink-500 mr-2">✓</span>
                  Follow consistent naming conventions
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Interactive Media Query Tester -->
        <div class="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Media Query Tester</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-medium text-gray-800 mb-2">Custom Media Query:</h3>
              <textarea
                v-model="customMediaQuery"
                placeholder="@media (max-width: 768px) { .custom-class { display: none; } }"
                class="w-full p-3 border rounded-lg h-32 resize-none font-mono text-sm"
              ></textarea>
              <div class="mt-3 flex flex-wrap gap-2">
                <button
                  v-for="preset in mediaQueryPresets"
                  :key="preset.name"
                  @click="customMediaQuery = preset.query"
                  class="px-3 py-1 bg-pink-100 text-pink-700 text-sm rounded hover:bg-pink-200 transition-colors"
                >
                  {{ preset.name }}
                </button>
              </div>
            </div>
            <div>
              <h3 class="font-medium text-gray-800 mb-2">Test Result:</h3>
              <div class="bg-gray-100 p-3 rounded-lg h-32 overflow-y-auto">
                <div class="text-sm text-gray-600">
                  Current viewport: <span class="font-mono">{{ currentViewport }}</span>
                </div>
                <div class="text-sm text-gray-600 mt-2">
                  Media query matches: 
                  <span :class="mediaQueryMatches ? 'text-green-600' : 'text-red-600'" class="font-semibold">
                    {{ mediaQueryMatches ? 'YES' : 'NO' }}
                  </span>
                </div>
                <div class="text-xs text-gray-500 mt-3">
                  Resize your browser window to see how media queries respond to different viewport sizes.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface CssScenario {
  id: string
  title: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  description: string
  vueCode: string
  cssCode: string
  cssLabel: string
  concepts: string[]
  tags: string[]
}

const activeCategory = ref('All')
const expandedCode = ref<string[]>([])
const customMediaQuery = ref('@media (max-width: 768px) {\n  .custom-class {\n    display: none;\n  }\n}')
const currentViewport = ref('')
const mediaQueryMatches = ref(false)

const categories = ['All', 'Responsive Design', 'Tailwind Utilities', 'Vue Styling', 'Layout Patterns', 'Performance']

const difficultyColors = {
  'Beginner': 'bg-green-100 text-green-800',
  'Intermediate': 'bg-yellow-100 text-yellow-800',
  'Advanced': 'bg-red-100 text-red-800'
}

const mediaQueryPresets = [
  { name: 'Mobile', query: '@media (max-width: 640px) {\n  .mobile-only {\n    display: block;\n  }\n}' },
  { name: 'Tablet', query: '@media (min-width: 641px) and (max-width: 1024px) {\n  .tablet-only {\n    display: block;\n  }\n}' },
  { name: 'Desktop', query: '@media (min-width: 1025px) {\n  .desktop-only {\n    display: block;\n  }\n}' },
  { name: 'Dark Mode', query: '@media (prefers-color-scheme: dark) {\n  .dark-mode {\n    background: #1a1a1a;\n    color: #ffffff;\n  }\n}' },
  { name: 'Reduced Motion', query: '@media (prefers-reduced-motion: reduce) {\n  .animate {\n    animation: none;\n  }\n}' }
]

const scenarios: CssScenario[] = [
  {
    id: '1',
    title: 'Responsive Card Grid with Tailwind',
    category: 'Responsive Design',
    difficulty: 'Beginner',
    description: 'Create a responsive golf course card grid that adapts to different screen sizes using Tailwind breakpoints.',
    vueCode: '// Responsive Card Grid Component\n' +
      'export default {\n' +
      '  name: "GolfCourseGrid",\n' +
      '  props: ["golfCourses"],\n' +
      '  template: `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">\n' +
      '    <div v-for="course in golfCourses" :key="course.id"\n' +
      '         class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">\n' +
      '      <img :src="course.image" :alt="course.name"\n' +
      '           class="w-full h-48 object-cover rounded-t-lg" />\n' +
      '      <div class="p-4">\n' +
      '        <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ course.name }}</h3>\n' +
      '        <p class="text-gray-600 text-sm mb-3">{{ course.location }}</p>\n' +
      '        <div class="flex justify-between items-center">\n' +
      '          <span class="text-emerald-600 font-bold">{{ course.price }}</span>\n' +
      '          <button class="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm\n' +
      '                         hover:bg-emerald-700 transition-colors">Book Now</button>\n' +
      '        </div>\n' +
      '      </div>\n' +
      '    </div>\n' +
      '  </div>`\n' +
      '}',
    cssCode: `/* Tailwind Classes Used:
 * grid - CSS Grid display
 * grid-cols-1 - 1 column on mobile
 * md:grid-cols-2 - 2 columns on medium screens (768px+)
 * lg:grid-cols-3 - 3 columns on large screens (1024px+)
 * gap-6 - 1.5rem gap between items
 * 
 * Responsive breakpoints:
 * sm: 640px
 * md: 768px
 * lg: 1024px
 * xl: 1280px
 * 2xl: 1536px
 */

@media (min-width: 768px) {
  .grid-cols-1 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .md\\:grid-cols-2 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}`,
    cssLabel: 'Tailwind Classes & Media Queries',
    concepts: [
      'Mobile-first responsive design approach',
      'Tailwind breakpoint system (sm, md, lg, xl)',
      'CSS Grid with responsive columns',
      'Hover states for better interactivity'
    ],
    tags: ['Responsive', 'Grid Layout', 'Tailwind', 'Mobile-First']
  },
  {
    id: '2',
    title: 'Dynamic CSS Classes in Vue',
    category: 'Vue Styling',
    difficulty: 'Intermediate',
    description: 'Use Vue class binding to create dynamic styling based on component state and props.',
    vueCode: '// Dynamic CSS Classes Component\n' +
      'export default {\n' +
      '  name: "TeeTimeSlot",\n' +
      '  props: ["slot", "isPremium"],\n' +
      '  computed: {\n' +
      '    slotClasses() {\n' +
      '      return {\n' +
      '        available: this.slot.available,\n' +
      '        unavailable: !this.slot.available,\n' +
      '        premium: this.isPremium,\n' +
      '        "peak-time": this.slot.isPeakTime,\n' +
      '        "last-minute": this.slot.isLastMinute\n' +
      '      }\n' +
      '    },\n' +
      '    buttonClasses() {\n' +
      '      return {\n' +
      '        "bg-emerald-600 hover:bg-emerald-700 text-white": this.slot.available,\n' +
      '        "bg-gray-300 text-gray-500 cursor-not-allowed": !this.slot.available,\n' +
      '        "bg-yellow-600 hover:bg-yellow-700": this.slot.isLastMinute && this.slot.available\n' +
      '      }\n' +
      '    }\n' +
      '  },\n' +
      '  methods: {\n' +
      '    formatTime(time) { return new Date(time).toLocaleTimeString() },\n' +
      '    bookSlot() { this.$emit("book", this.slot) }\n' +
      '  }\n' +
      '}',
    cssCode: `.tee-time-slot {
  @apply p-4 rounded-lg border transition-all duration-300;
}

.tee-time-slot.available {
  @apply border-emerald-200 bg-emerald-50 hover:shadow-md;
}

.tee-time-slot.unavailable {
  @apply border-gray-200 bg-gray-50 opacity-60;
}

.tee-time-slot.premium {
  @apply border-yellow-300 bg-yellow-50;
  position: relative;
}

.tee-time-slot.premium::before {
  content: "PREMIUM";
  @apply absolute top-2 right-2 text-xs bg-yellow-600 text-white px-2 py-1 rounded;
}

.tee-time-slot.peak-time .price {
  @apply text-red-600 font-bold;
}

.price.discounted {
  @apply text-green-600;
  position: relative;
}

.price.discounted::after {
  content: "SALE";
  @apply ml-2 text-xs bg-red-500 text-white px-1 rounded;
}

/* Custom media query for mobile-specific styling */
@media (max-width: 640px) {
  .tee-time-slot {
    @apply p-3;
  }
  
  .book-btn {
    @apply w-full mt-2;
  }
}`,
    cssLabel: 'Vue Class Binding + Tailwind',
    concepts: [
      'Dynamic class binding with computed properties',
      'Conditional styling based on component state',
      'Combining Tailwind classes with custom CSS',
      'Using pseudo-elements for badges and labels'
    ],
    tags: ['Vue Class Binding', 'Dynamic Styling', 'Computed Properties']
  },
  {
    id: '3',
    title: 'CSS Custom Properties with Tailwind',
    category: 'Tailwind Utilities',
    difficulty: 'Advanced',
    description: 'Combine CSS custom properties with Tailwind for theme customization and dynamic styling.',
    vueCode: '// CSS Custom Properties Theme Component\n' +
      'export default {\n' +
      '  name: "GolfCourseTheme",\n' +
      '  props: ["course"],\n' +
      '  data() {\n' +
      '    return {\n' +
      '      currentTheme: { name: "Default", primary: "#059669", secondary: "#10b981", accent: "#fbbf24" },\n' +
      '      availableThemes: [\n' +
      '        { name: "Default", primary: "#059669", secondary: "#10b981", accent: "#fbbf24" },\n' +
      '        { name: "Ocean", primary: "#0284c7", secondary: "#0ea5e9", accent: "#38bdf8" },\n' +
      '        { name: "Sunset", primary: "#dc2626", secondary: "#f97316", accent: "#fbbf24" }\n' +
      '      ]\n' +
      '    }\n' +
      '  },\n' +
      '  computed: {\n' +
      '    themeVariables() {\n' +
      '      return {\n' +
      '        "--course-primary": this.currentTheme.primary,\n' +
      '        "--course-secondary": this.currentTheme.secondary,\n' +
      '        "--course-accent": this.currentTheme.accent\n' +
      '      }\n' +
      '    }\n' +
      '  },\n' +
      '  methods: {\n' +
      '    setTheme(theme) {\n' +
      '      this.currentTheme = theme\n' +
      '    }\n' +
      '  }\n' +
      '}',
    cssCode: `:root {
  --course-primary: #059669;
  --course-secondary: #10b981;
  --course-accent: #fbbf24;
  --course-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.golf-course-theme {
  @apply p-6 rounded-xl shadow-lg;
  background: linear-gradient(135deg, var(--course-primary), var(--course-secondary));
  box-shadow: var(--course-shadow);
}

.course-title {
  @apply text-3xl font-bold text-white mb-4;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.difficulty-badge {
  @apply px-3 py-1 rounded-full text-sm font-semibold;
  background-color: var(--course-accent);
  color: var(--course-primary);
}

.difficulty-badge[data-difficulty="Easy"] {
  --course-accent: #22c55e;
}

.difficulty-badge[data-difficulty="Hard"] {
  --course-accent: #ef4444;
}

.stat-card {
  @apply bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.stat-card:hover {
  @apply transform scale-105;
  background-color: rgba(255, 255, 255, 0.3);
}

.theme-btn {
  @apply px-4 py-2 rounded-md text-sm font-medium transition-all;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.theme-btn.active {
  background-color: var(--course-accent);
  color: var(--course-primary);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .golf-course-theme {
    @apply p-4;
  }
  
  .course-stats {
    @apply grid-cols-2 gap-3;
  }
  
  .stat-card {
    @apply p-3;
  }
}`,
    cssLabel: 'CSS Custom Properties + Tailwind',
    concepts: [
      'CSS custom properties (variables) for theming',
      'Dynamic style binding in Vue',
      'Combining custom properties with Tailwind utilities',
      'Creating reusable theme systems'
    ],
    tags: ['CSS Variables', 'Theming', 'Dynamic Styling', 'Custom Properties']
  }
]

const filteredScenarios = computed(() => {
  if (activeCategory.value === 'All') {
    return scenarios
  }
  return scenarios.filter(scenario => scenario.category === activeCategory.value)
})

const toggleCode = (scenarioId: string) => {
  const index = expandedCode.value.indexOf(scenarioId)
  if (index > -1) {
    expandedCode.value.splice(index, 1)
  } else {
    expandedCode.value.push(scenarioId)
  }
}

const updateViewportInfo = () => {
  currentViewport.value = `${window.innerWidth}x${window.innerHeight}`
  
  // Test if custom media query matches
  if (customMediaQuery.value.includes('@media')) {
    try {
      const mediaQueryRegex = /@media\s*\(([^)]+)\)/
      const match = customMediaQuery.value.match(mediaQueryRegex)
      if (match) {
        const query = match[1]
        mediaQueryMatches.value = window.matchMedia(`(${query})`).matches
      }
    } catch (error) {
      mediaQueryMatches.value = false
    }
  }
}

onMounted(() => {
  updateViewportInfo()
  window.addEventListener('resize', updateViewportInfo)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateViewportInfo)
})
</script>