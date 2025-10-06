# Vue Reactivity Guide: ref vs reactive vs computed

## Quick Overview

- **`ref`** → For primitive values or when you need to reassign whole objects
- **`reactive`** → For objects you'll mutate (change properties)
- **`computed`** → For derived values that depend on other reactive state

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

## Key Differences Table

| Feature | `ref` | `reactive` | `computed` |
|---------|-------|------------|------------|
| **Use for** | Primitives or full reassignment | Objects you'll mutate | Derived values |
| **Access in script** | `.value` | Direct | `.value` |
| **Access in template** | Direct | Direct | Direct |
| **Can reassign?** | ✅ Yes | ❌ No | ❌ Read-only* |
| **Deep reactivity?** | ✅ Yes (for objects) | ✅ Yes | N/A |
| **Performance** | Good | Good | Cached/optimized |

*Computed can be writable with get/set, but rarely used

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

### Use `computed` when:
```javascript
// 1. Calculating derived values
const cart = ref([
  { name: 'Shirt', price: 20 },
  { name: 'Pants', price: 40 }
])

const total = computed(() => 
  cart.value.reduce((sum, item) => sum + item.price, 0)
)

// 2. Filtering/transforming lists
const todos = ref([...])
const completedTodos = computed(() => 
  todos.value.filter(todo => todo.done)
)

// 3. Complex conditionals
const user = ref({ role: 'admin', isActive: true })
const canEdit = computed(() => 
  user.value.role === 'admin' && user.value.isActive
)
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

## Real-World Example

```javascript
// E-commerce cart combining all three
const cartItems = ref([]) // ref: might reassign from API
const userPreferences = reactive({ // reactive: always an object
  currency: 'USD',
  includesTax: true
})

// computed: derived values
const subtotal = computed(() => 
  cartItems.value.reduce((sum, item) => sum + item.price, 0)
)

const tax = computed(() => 
  userPreferences.includesTax ? subtotal.value * 0.08 : 0
)

const total = computed(() => subtotal.value + tax.value)

const formattedTotal = computed(() => 
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: userPreferences.currency
  }).format(total.value)
)
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

## TL;DR

- **`ref`** = Box for any value (needs `.value` in script)
- **`reactive`** = Make an object reactive (no `.value`, can't reassign)
- **`computed`** = Excel formula cell (auto-updates based on dependencies)

Most Vue 3 developers lean toward **`ref` for everything** for consistency, unless working with complex nested objects where `reactive` feels more natural. `computed` is universally loved for derived state!

Pinia comes in when you need structure and DevTools at scale - not because Vue can't share state, but because organization matters in larger apps.