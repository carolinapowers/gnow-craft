# Vue Reactivity Guide: ref, reactive, computed, and watch

## Quick Overview

- **`ref`** → For primitive values or when you need to reassign whole objects
- **`reactive`** → For objects you'll mutate (change properties)
- **`computed`** → For derived values that depend on other reactive state
- **`watch`** → For side effects when reactive state changes
- **`watchEffect`** → For side effects with automatic dependency tracking

## `ref` - Reactive Reference

Think of it as a "box" that holds a value:

```javascript
import { ref } from 'vue'

// Primitives
const count = ref(0)
const name = ref('John')
const isActive = ref(true)

// Access/modify with .value in script
count.value++
console.log(count.value) // 1

// But in template, no .value needed!
// <template>{{ count }}</template>
```

**Can also hold objects (but there's a catch):**
```javascript
const user = ref({ name: 'John', age: 30 })

// Reassigning whole object - ✅ triggers updates
user.value = { name: 'Jane', age: 25 }

// Modifying properties - ✅ also works (Vue makes it reactive)
user.value.name = 'Jane'
```

## `reactive` - Reactive Object

Makes an object deeply reactive (all nested properties):

```javascript
import { reactive } from 'vue'

const state = reactive({
  user: {
    name: 'John',
    settings: {
      theme: 'dark'
    }
  },
  posts: []
})

// Direct property access (no .value!)
state.user.name = 'Jane' // ✅ triggers updates
state.user.settings.theme = 'light' // ✅ deep reactivity

// BUT you can't reassign the whole object
state = { new: 'object' } // ❌ Won't work, breaks reactivity
```

## `computed` - Derived State

Automatically calculates based on other reactive values:

```javascript
import { ref, computed } from 'vue'

const price = ref(100)
const quantity = ref(2)
const taxRate = ref(0.08)

// Automatically updates when dependencies change
const total = computed(() => {
  const subtotal = price.value * quantity.value
  const tax = subtotal * taxRate.value
  return subtotal + tax
})

console.log(total.value) // 216

price.value = 150
console.log(total.value) // 324 - automatically recalculated!
```

## `watch` - Reacting to Changes

Performs side effects when reactive values change:

```javascript
import { ref, watch } from 'vue'

const searchQuery = ref('')
const results = ref([])

// Basic watch
watch(searchQuery, async (newValue, oldValue) => {
  console.log(`Search changed from ${oldValue} to ${newValue}`)
  results.value = await searchAPI(newValue)
})

// Watch multiple sources
watch(
  [firstName, lastName],
  ([newFirst, newLast], [oldFirst, oldLast]) => {
    console.log('Name changed')
  }
)

// Watch with options
watch(
  source,
  callback,
  {
    immediate: true,  // Run immediately on setup
    deep: true,       // Deep watch objects
    flush: 'post'     // Timing of the watcher
  }
)
```

### Common Watch Patterns

```javascript
// 1. Watch a getter function (for reactive objects)
const state = reactive({ count: 0 })
watch(
  () => state.count,  // Getter function
  (newCount) => console.log(`Count is ${newCount}`)
)

// 2. Watch with immediate execution
watch(
  userId,
  async (id) => {
    userData.value = await fetchUser(id)
  },
  { immediate: true }  // Fetch on mount
)

// 3. Stopping a watcher
const stop = watch(source, callback)
// Later...
stop() // Stop watching

// 4. Watch with cleanup
watch(searchQuery, async (query, oldQuery, onCleanup) => {
  const controller = new AbortController()
  
  onCleanup(() => {
    controller.abort() // Cancel previous request
  })
  
  const results = await fetch(`/search?q=${query}`, {
    signal: controller.signal
  })
})
```

## `watchEffect` - Automatic Dependency Tracking

Runs immediately and re-runs whenever dependencies change:

```javascript
import { ref, watchEffect } from 'vue'

const count = ref(0)
const doubled = ref(0)

// Automatically tracks dependencies used inside
watchEffect(() => {
  // This will re-run whenever count changes
  doubled.value = count.value * 2
  console.log(`Count is ${count.value}`)
})

// vs computed - watchEffect is for side effects, not derived values
const doubledComputed = computed(() => count.value * 2) // Better for this case
```

### watchEffect vs watch

```javascript
const firstName = ref('John')
const lastName = ref('Doe')

// watchEffect - Automatic, runs immediately
watchEffect(() => {
  // Tracks whatever reactive values are used
  console.log(`Name: ${firstName.value} ${lastName.value}`)
})

// watch - Explicit, more control
watch(
  [firstName, lastName],
  ([first, last]) => {
    console.log(`Name: ${first} ${last}`)
  }
)
```

## Key Differences Table

| Feature | `ref` | `reactive` | `computed` | `watch` | `watchEffect` |
|---------|-------|------------|------------|---------|---------------|
| **Use for** | Primitives or full reassignment | Objects you'll mutate | Derived values | Side effects with explicit deps | Side effects with auto deps |
| **Returns** | Reactive value | Reactive object | Read-only value* | Stop function | Stop function |
| **Access in script** | `.value` | Direct | `.value` | N/A | N/A |
| **Lazy** | No | No | Yes (on access) | Yes (not immediate) | No (runs immediately) |
| **Can trigger side effects** | No | No | No** | Yes | Yes |

*Computed can be writable with get/set, but rarely used
**Computed should be pure, no side effects

## Common Patterns & When to Use Each

### Use `ref` when:
```javascript
// 1. Working with primitives
const isLoading = ref(false)
const errorMessage = ref('')

// 2. Need to reassign entire objects/arrays
const userData = ref(null)
// Later...
userData.value = await fetchUser() // Full replacement

// 3. Working with form inputs
const email = ref('')
// <input v-model="email">

// 4. Arrays you'll replace entirely
const items = ref([])
items.value = await fetchItems() // New array
```

### Use `reactive` when:
```javascript
// 1. Complex state objects with multiple properties
const form = reactive({
  name: '',
  email: '',
  address: {
    street: '',
    city: ''
  }
})
form.address.city = 'New York' // Natural mutation

// 2. State that's always an object (never null)
const appConfig = reactive({
  theme: 'light',
  language: 'en',
  features: {
    darkMode: true,
    notifications: true
  }
})

// 3. When you prefer no .value syntax
const state = reactive({
  count: 0
})
state.count++ // vs count.value++ with ref
```

### Use `watch` when:
```javascript
// 1. Making API calls based on reactive data
const userId = ref(123)
watch(userId, async (id) => {
  const user = await fetchUser(id)
  // Do something with user data
})

// 2. Syncing with external systems
watch(theme, (newTheme) => {
  localStorage.setItem('theme', newTheme)
  document.body.className = newTheme
})

// 3. Expensive operations that shouldn't run on every render
watch(searchQuery, debounce(async (query) => {
  results.value = await search(query)
}, 500))

// 4. Triggering animations or DOM updates
watch(isVisible, (visible) => {
  if (visible) {
    startAnimation()
  }
})
```

### Use `watchEffect` when:
```javascript
// 1. You want to track dependencies automatically
watchEffect(() => {
  // Will re-run if any of these change
  console.log(user.value.name, settings.value.theme, count.value)
})

// 2. Setting up subscriptions
watchEffect((onCleanup) => {
  const subscription = someStore.subscribe(data => {
    // Handle data
  })
  
  onCleanup(() => {
    subscription.unsubscribe()
  })
})

// 3. Initial setup that depends on reactive state
watchEffect(() => {
  chart.update({
    data: chartData.value,
    options: chartOptions.value
  })
})
```

## watch vs computed vs methods

```javascript
const price = ref(100)
const quantity = ref(2)

// ❌ Wrong: Don't use watch for derived values
watch([price, quantity], ([p, q]) => {
  total.value = p * q  // Should use computed instead
})

// ✅ Correct: Use computed for derived values
const total = computed(() => price.value * quantity.value)

// ✅ Correct: Use watch for side effects
watch(total, (newTotal) => {
  if (newTotal > 1000) {
    showDiscountBanner()  // Side effect
  }
})

// ✅ Correct: Use methods for event handlers
const addToCart = () => {
  cart.add({ price: price.value, quantity: quantity.value })
}
```

## Common Gotchas & Tips

### 1. Don't destructure `reactive`
```javascript
const state = reactive({ count: 0 })

// ❌ Loses reactivity
const { count } = state

// ✅ Use toRefs if you need to destructure
const { count } = toRefs(state)
```

### 2. `ref` unwrapping in reactive
```javascript
const count = ref(0)
const state = reactive({
  count // ref is automatically unwrapped
})

console.log(state.count) // 0 (no .value needed!)
state.count++ // Works!
```

### 3. Choosing between `ref` and `reactive`
```javascript
// Team A prefers ref for consistency
const user = ref({ name: 'John' })
const posts = ref([])
const isLoading = ref(false)
// Always use .value in script

// Team B uses both based on type
const isLoading = ref(false) // primitive
const user = reactive({ name: 'John' }) // object
// Mixed .value usage
```

### 4. `computed` is cached
```javascript
const expensive = computed(() => {
  console.log('Computing...')
  return someExpensiveOperation()
})

// First access - runs computation
console.log(expensive.value) // "Computing..."

// Second access - returns cached value
console.log(expensive.value) // No "Computing..." log!
```

### 5. Watch reactive objects carefully
```javascript
const obj = reactive({ nested: { count: 0 } })

// ❌ Won't trigger - watching reactive object directly
watch(obj, () => console.log('changed'))

// ✅ Use deep option
watch(obj, () => console.log('changed'), { deep: true })

// ✅ Or watch a specific property
watch(() => obj.nested.count, () => console.log('count changed'))
```

### 6. Watch vs watchEffect cleanup
```javascript
// watchEffect - cleanup function as parameter
watchEffect((onCleanup) => {
  const timer = setInterval(() => {}, 1000)
  onCleanup(() => clearInterval(timer))
})

// watch - cleanup in third parameter
watch(source, async (newVal, oldVal, onCleanup) => {
  const controller = new AbortController()
  onCleanup(() => controller.abort())
  
  await fetch(url, { signal: controller.signal })
})
```

## Real-World Example

```javascript
// E-commerce cart combining all reactivity features
import { ref, reactive, computed, watch, watchEffect } from 'vue'

// State
const cartItems = ref([]) // ref: might reassign from API
const userPreferences = reactive({ // reactive: always an object
  currency: 'USD',
  includesTax: true
})
const promoCode = ref('')

// Computed - derived values
const subtotal = computed(() => 
  cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

const tax = computed(() => 
  userPreferences.includesTax ? subtotal.value * 0.08 : 0
)

const discount = computed(() => {
  if (promoCode.value === 'SAVE20') return subtotal.value * 0.2
  return 0
})

const total = computed(() => subtotal.value + tax.value - discount.value)

// Watch - side effects
watch(total, (newTotal) => {
  // Update UI elements outside Vue
  if (newTotal > 100) {
    showFreeShippingBanner()
  }
})

// Watch with immediate for initial load
watch(
  promoCode,
  async (code) => {
    if (code) {
      const valid = await validatePromoCode(code)
      if (!valid) {
        promoCode.value = ''
        showError('Invalid promo code')
      }
    }
  },
  { immediate: true }
)

// WatchEffect for auto-tracking
watchEffect(() => {
  // Automatically saves whenever these change
  localStorage.setItem('cart', JSON.stringify({
    items: cartItems.value,
    promo: promoCode.value
  }))
})

// Debounced validation
const debouncedCode = ref('')
let timeout
watch(promoCode, (code) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    debouncedCode.value = code
  }, 500)
})

watch(debouncedCode, async (code) => {
  // Expensive validation only after user stops typing
  await validatePromoOnServer(code)
})
```

## Why Pinia When Vue Has Built-in Reactivity?

### The Problem with "Just Reactive State"

As apps grow, simple reactive state becomes messy:

```javascript
// store.js - starts simple
export const user = ref(null)
export const cart = reactive({ items: [] })
export const products = ref([])
export const filters = reactive({ category: '', price: null })
export const isLoading = ref(false)
export const error = ref(null)

// Becomes spaghetti as it grows...
export function addToCart(product) {
  cart.items.push(product)
  // Where do we put derived state?
  // How do we handle async?
  // Where do analytics events go?
}
```

### What Pinia Provides

1. **Organization & Structure**
2. **DevTools Integration**
3. **Built-in TypeScript Support**
4. **Plugins & Middleware**
5. **Store Composition**

```javascript
// stores/cart.js - Pinia store
export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref([])
  const coupon = ref(null)
  
  // Getters (computed)
  const total = computed(() => 
    items.value.reduce((sum, item) => sum + item.price, 0)
  )
  
  // Actions
  async function addItem(product) {
    items.value.push(product)
    await api.trackEvent('item_added', product)
  }
  
  return { items, total, addItem }
})
```

### When to Use What?

**Use Raw Reactive State for:**
- Small apps/prototypes
- Shared utilities (theme, config)
- Simple state (notifications, modals)

**Use Pinia for:**
- Production applications
- Team projects (enforces patterns)
- Complex state relationships
- When you need DevTools
- Server-side rendering (SSR)

## Decision Tree: Which API to Use?

```
Need to store a value?
├─ Is it a primitive OR needs full reassignment?
│  └─ Use ref
├─ Is it always an object with nested properties?
│  └─ Use reactive
│
Need to derive a value from other reactive values?
└─ Use computed

Need to perform side effects when values change?
├─ Do you know exactly what to watch?
│  └─ Use watch
└─ Want automatic dependency tracking?
   └─ Use watchEffect
```

## Comparison with React

| Vue | React | Purpose |
|-----|-------|---------|
| `ref` / `reactive` | `useState` | Store reactive state |
| `computed` | `useMemo` | Cached derived values |
| `watch` | `useEffect` with deps | Side effects with explicit dependencies |
| `watchEffect` | `useEffect` with deps | Side effects (Vue auto-tracks deps) |
| Built-in reactivity | Manual setState | Update triggers |
| `.value` in script | Direct access | Value access pattern |

## TL;DR

- **`ref`** = Box for any value (needs `.value` in script)
- **`reactive`** = Make an object reactive (no `.value`, can't reassign)
- **`computed`** = Excel formula cell (auto-updates based on dependencies, cached)
- **`watch`** = "When X changes, do Y" (explicit dependencies)
- **`watchEffect`** = "Run this and re-run when its dependencies change" (auto-tracked)

Most Vue 3 developers lean toward:
- **`ref` for everything** for consistency
- **`computed` for derived values** (never watch for this!)
- **`watch` for API calls and side effects**
- **`watchEffect` sparingly** (when auto-tracking is genuinely helpful)

Pinia comes in when you need structure and DevTools at scale - not because Vue can't share state, but because organization matters in larger apps.