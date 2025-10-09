# Vue vs React: A Developer's Side-by-Side Comparison Guide

*A practical guide for developers transitioning between frameworks or choosing the right tool for their next project.*

## A Personal Journey Back to Vue

My relationship with Vue has come full circle. During my frontend development bootcamp, in the Angular.js era, I got my first taste of Vue alongside the more dominant Angular.js ecosystem. While Angular.js was my primary framework in bootcamp and early career, I remember appreciating Vue's simpler, more approachable syntax even then.

Years later, mid-career at Pluralsight, I got to work with Vue 2 in production on the Projects Content Tooling codebase. That familiar, intuitive syntax I'd enjoyed early on was a welcome reunion, this time with the experience to appreciate Vue's pragmatic design choices in an enterprise environment.

Then came 8 years deep in the React ecosystem: hooks, Context, Redux, the whole journey. Now, revisiting Vue for a new project, I'm discovering Vue 3's Composition API with the perspective of someone who's been immersed in React's patterns. It's fascinating how much has changed, and how many concepts now feel like conversations between old friends who've grown up in parallel.

What excites me most about returning to Vue is how it addresses some pain points I've seen firsthand in recent React projects: unnecessary re-renders that required careful optimization, state management that grew into overcomplicated abstractions, and the paradox of too much freedom leading to spaghetti code without clear patterns. Sometimes a framework's opinions are exactly what a team needs.

Coming from years of React hooks, useState, and useEffect, I found myself constantly asking "What's the Vue equivalent of...?" So I decided to create this comprehensive mapping to make sense of it all. If you're transitioning between these frameworks or trying to understand how concepts translate, hopefully this guide saves you some time.

## Introduction

Both React and Vue have evolved significantly over the years. React's shift to hooks and Vue's introduction of the Composition API have actually brought them closer together conceptually, even as they maintain their distinct philosophies. This guide provides a side-by-side comparison from the perspective of someone who's lived in both worlds.

## Core Concepts Mapping

### State Management

| Concept | React | Vue | Notes |
|---------|-------|-----|-------|
| Component State | `useState` | `ref` / `reactive` | Vue's ref requires `.value` access in script |
| Derived State | `useMemo` | `computed` | Vue auto-tracks dependencies |
| Function Memoization | `useCallback` | Usually not needed* | Vue's render functions are cached, only re-run when reactive deps change |
| Side Effects | `useEffect` | `watch` / `watchEffect` | Vue separates immediate vs. deferred effects |
| Context/Provide | `useContext` | `provide` / `inject` | Similar pattern, different syntax |
| Reducer Pattern | `useReducer` | Custom composable | Vue doesn't have built-in reducer |

*Note: Vue can still benefit from techniques like `shallowRef` or `markRaw` for optimization in complex scenarios

### Quick Example: Basic State

**React:**
```javascript
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}
```

**Vue:**
```html
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div>
    <p>{{ count }}</p>
    <button @click="count++">
      Increment
    </button>
  </div>
</template>
```

## Component Syntax

### Component Definition

**React (Function Component):**
```javascript
export default function UserCard({ name, email, onUpdate }) {
  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>{email}</p>
      <button onClick={() => onUpdate(name)}>
        Update
      </button>
    </div>
  )
}
```

**Vue (Composition API):**
```html
<script setup>
const props = defineProps(['name', 'email'])
const emit = defineEmits(['update'])
</script>

<template>
  <div class="user-card">
    <h2>{{ name }}</h2>
    <p>{{ email }}</p>
    <button @click="emit('update', name)">
      Update
    </button>
  </div>
</template>
```

## Reactivity System

### Key Differences

**React:** 
- Immutable updates
- Manual dependency arrays
- Component-level re-renders (unless optimized)
- Explicit optimization (memo, useCallback)

**Vue:** 
- Mutable updates with proxies
- Automatic dependency tracking at property level
- Granular reactive updates
- Compiler optimizations + reactive system (though still requires understanding refs vs reactive, shallow vs deep)

### Computed/Derived Values

**React with useMemo:**
```javascript
function PriceCalculator() {
  const [price, setPrice] = useState(100)
  const [quantity, setQuantity] = useState(2)
  const [taxRate] = useState(0.08)
  
  const total = useMemo(() => {
    const subtotal = price * quantity
    const tax = subtotal * taxRate
    return subtotal + tax
  }, [price, quantity, taxRate]) // Manual deps
  
  return <div>Total: ${total.toFixed(2)}</div>
}
```

**Vue with computed:**
```html
<script setup>
import { ref, computed } from 'vue'

const price = ref(100)
const quantity = ref(2)
const taxRate = ref(0.08)

const total = computed(() => {
  const subtotal = price.value * quantity.value
  const tax = subtotal * taxRate.value
  return subtotal + tax
}) // Auto-tracks dependencies
</script>

<template>
  <div>Total: ${{ total.toFixed(2) }}</div>
</template>
```

## Lifecycle & Effects

### Lifecycle Hooks Comparison

| React | Vue 3 | Purpose |
|-------|-------|---------|
| `useEffect(() => {}, [])` | `onMounted()` | Component mounted |
| `useEffect` return | `onUnmounted()` | Cleanup |
| `useEffect` | `watchEffect` | Run on reactive changes |
| `useLayoutEffect` | `onUpdated()` | Post-DOM update (closest equivalent*) |
| No direct equivalent | `onBeforeMount()` | Before mounting |
| No direct equivalent | `onBeforeUpdate()` | Before update |

*Note: `useLayoutEffect` fires synchronously after DOM mutations but before paint, while `onUpdated` runs after the component updates and DOM is patched - similar but not identical timing

### Side Effects Example

**React:**
```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    let cancelled = false
    
    fetchUser(userId).then(data => {
      if (!cancelled) setUser(data)
    })
    
    return () => { cancelled = true }
  }, [userId])
  
  return user ? <div>{user.name}</div> : <div>Loading...</div>
}
```

**Vue:**
```html
<script setup>
import { ref, watch } from 'vue'

const props = defineProps(['userId'])
const user = ref(null)

watch(() => props.userId, async (newUserId) => {
  user.value = await fetchUser(newUserId)
}, { immediate: true })
</script>

<template>
  <div v-if="user">{{ user.name }}</div>
  <div v-else>Loading...</div>
</template>
```

## Custom Hooks vs Composables

Both frameworks support extracting reusable logic:

### React Custom Hook:
```javascript
// useCounter.js
export function useCounter(initial = 0) {
  const [count, setCount] = useState(initial)
  
  const increment = useCallback(() => {
    setCount(c => c + 1)
  }, [])
  
  const decrement = useCallback(() => {
    setCount(c => c - 1)
  }, [])
  
  return { count, increment, decrement }
}

// Usage
function App() {
  const { count, increment, decrement } = useCounter(10)
  // ...
}
```

### Vue Composable:
```javascript
// useCounter.js
import { ref } from 'vue'

export function useCounter(initial = 0) {
  const count = ref(initial)
  
  const increment = () => {
    count.value++
  }
  
  const decrement = () => {
    count.value--
  }
  
  return { count, increment, decrement }
}

// Usage in component
const { count, increment, decrement } = useCounter(10)
```

## Conditional Rendering

**React:**
```javascript
return (
  <>
    {isLoading && <Spinner />}
    {error && <Error message={error} />}
    {data && <DataDisplay data={data} />}
    {items.map(item => (
      <Item key={item.id} {...item} />
    ))}
  </>
)
```

**Vue:**
```html
<template>
  <Spinner v-if="isLoading" />
  <Error v-if="error" :message="error" />
  <DataDisplay v-if="data" :data="data" />
  <Item 
    v-for="item in items" 
    :key="item.id"
    v-bind="item"
  />
</template>
```

## Event Handling

**React:**
```javascript
<button onClick={handleClick}>Click</button>
<input onChange={(e) => setValue(e.target.value)} />
<form onSubmit={(e) => {
  e.preventDefault()
  handleSubmit()
}}>
```

**Vue:**
```html
<button @click="handleClick">Click</button>
<input @input="setValue($event.target.value)" />
<!-- or with v-model -->
<input v-model="value" />
<form @submit.prevent="handleSubmit">
```

## Two-Way Binding

**React (manual):**
```javascript
const [value, setValue] = useState('')

return (
  <input 
    value={value}
    onChange={(e) => setValue(e.target.value)}
  />
)
```

**Vue (v-model):**
```html
<script setup>
const value = ref('')
</script>

<template>
  <input v-model="value" />
</template>
```

## Performance Optimization

### React Optimization Tools:
- `React.memo()` - Prevent re-renders
- `useMemo()` - Memoize expensive calculations
- `useCallback()` - Memoize functions
- `React.lazy()` - Code splitting
- Virtual DOM diffing

### Vue Optimization Tools:
- `v-memo` - Memoize template fragments (Vue 3.2+, for advanced cases)
- `computed()` - Cached reactive values
- `shallowRef()` / `shallowReactive()` - Shallow reactivity for performance
- `markRaw()` - Prevent reactivity conversion
- `defineAsyncComponent()` - Code splitting
- Compiler optimizations + property-level reactivity tracking

## State Management Libraries

| React | Vue | Purpose |
|-------|-----|---------|
| Redux / Zustand | Vuex / Pinia | Global state management |
| React Query / SWR | TanStack Query* | Server state |
| Jotai / Recoil | Pinia | Atomic/fine-grained state |
| Context API | Provide/Inject | Dependency injection |

*Note: TanStack Query (formerly React Query) now supports both React and Vue

## Routing

**React Router:**
```javascript
import { BrowserRouter, Route, Link } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Link to="/about">About</Link>
      <Routes>
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}
```

**Vue Router:**
```html
<template>
  <router-link to="/about">About</router-link>
  <router-view />
</template>

<script setup>
// Routes defined in router config file
</script>
```

## TypeScript Support

Both frameworks have excellent TypeScript support:

**React:**
```typescript
interface Props {
  name: string
  age?: number
}

const User: React.FC<Props> = ({ name, age = 0 }) => {
  const [count, setCount] = useState<number>(0)
  return <div>{name}: {age}</div>
}
```

**Vue:**
```html
<script setup lang="ts">
interface Props {
  name: string
  age?: number
}

const props = withDefaults(defineProps<Props>(), {
  age: 0
})

const count = ref<number>(0)
</script>
```

## Key Philosophical Differences

### React Philosophy:
- **Explicit over implicit** - You control optimizations
- **JavaScript-centric** - Everything is JavaScript
- **Functional paradigm** - Immutability, pure functions
- **Unopinionated** - Many ways to solve problems
- **Manual optimization** - You decide when to optimize

### Vue Philosophy:
- **Progressive framework** - Adoptable incrementally
- **Template-based** - Separation of concerns
- **Reactive by design** - Automatic tracking
- **Opinionated** - Recommended patterns
- **Automatic optimization** - Framework handles efficiency

## When to Choose Which?

### Choose React if:
- Your team prefers JavaScript-centric development
- You need maximum flexibility and control
- You're building complex applications with specific requirements
- You have experience with functional programming
- You need the largest ecosystem and community

### Choose Vue if:
- You prefer clear separation between template/logic/style
- You want automatic performance optimizations
- You're building traditional web applications
- You appreciate more opinionated, guided solutions
- You want easier onboarding for new developers

## Migration Tips

### React → Vue:
1. Remember `.value` for refs in script
2. Embrace mutable updates
3. Trust automatic dependency tracking
4. Use computed instead of useMemo
5. Templates use different directives (v-if, v-for)

### Vue → React:
1. Always use immutable updates
2. Specify dependency arrays explicitly
3. Use useCallback for stable function references
4. JSX instead of templates
5. More manual performance optimization

## Ecosystem Comparison

| Category | React | Vue |
|----------|-------|-----|
| **Build Tools** | Create React App, Vite, Next.js | Vite, Nuxt, Vue CLI |
| **State Management** | Redux, MobX, Zustand, Recoil | Vuex, Pinia |
| **Forms** | React Hook Form, Formik | VeeValidate, FormKit |
| **UI Libraries** | Material-UI, Ant Design, Chakra | Vuetify, Element Plus, Quasar |
| **Mobile** | React Native | NativeScript-Vue, Quasar |
| **SSR/SSG** | Next.js, Gatsby, Remix | Nuxt, VitePress, Astro* |
| **Testing** | Jest, React Testing Library | Vue Test Utils, Vitest |

*Note: Astro is framework-agnostic and supports multiple frameworks including Vue

## Conclusion

Both React and Vue are excellent frameworks with strong communities and ecosystems. React offers more flexibility and control with its JavaScript-centric approach, while Vue provides a more guided experience with automatic optimizations and clear conventions.

Having worked extensively with React for nearly a decade and now rediscovering Vue 3, I'm impressed by how both frameworks have evolved. Vue's Composition API feels natural coming from React hooks, yet it maintains Vue's pragmatic approach to reactivity. The automatic dependency tracking and mutable updates that once felt foreign now feel like welcome conveniences after years of manual dependency arrays, useCallback wrapping, and debugging why a component re-rendered 47 times.

There's something refreshing about a framework that has opinions. After seeing teams struggle with analysis paralysis from too many state management options, or junior developers creating accidental performance problems that required senior intervention to fix, Vue's guardrails feel less like constraints and more like helpful guidance.

The best choice depends on your team's preferences, project requirements, and development philosophy. Many concepts translate between the two, making it valuable to understand both frameworks. My experience moving between them has only reinforced that the core patterns of modern frontend development transcend any single framework.

Remember: The framework is just a tool. What matters most is solving problems effectively and delivering value to users. Both React and Vue are more than capable of helping you achieve that goal.

---

*Found this comparison helpful? Share it with your team or save it for reference. I'd love to hear about your experiences transitioning between frameworks or if you spot any Vue 3 patterns I might have missed!*

#React #Vue #JavaScript #WebDevelopment #Frontend #Programming #VueJS #ReactJS #CompositionAPI