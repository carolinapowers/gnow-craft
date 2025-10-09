# React State Management Patterns: useReducer and Beyond

## Table of Contents
1. [useReducer Fundamentals](#usereducer-fundamentals)
2. [useReducer vs Redux](#usereducer-vs-redux)
3. [Custom Hooks with useReducer](#custom-hooks-with-usereducer)
4. [Shared State Without Providers](#shared-state-without-providers)
5. [The forceUpdate Pattern](#the-forceupdate-pattern)
6. [Comparison with Vue Patterns](#comparison-with-vue-patterns)

## useReducer Fundamentals

`useReducer` is React's built-in hook for managing complex state with the reducer pattern:

```javascript
const [state, dispatch] = useReducer(reducer, initialState)
```

### Basic Example

```javascript
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    case 'reset':
      return { count: 0 }
    default:
      return state
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 })
  
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </>
  )
}
```

## useReducer vs Redux

Both use the same core pattern: `(state, action) => newState`

### Comparison Table

| Aspect | useReducer | Redux |
|--------|------------|-------|
| **Scope** | Component/local state | Global app state |
| **DevTools** | No built-in tools | Time-travel debugging |
| **Middleware** | None | Thunks, Sagas, etc. |
| **State Access** | Pass via props/context | useSelector anywhere |
| **Async Actions** | Handle manually | Middleware support |
| **State Persistence** | Manual | Libraries available |
| **Setup Complexity** | Minimal | Requires store setup |
| **Bundle Size** | 0 (built-in) | ~10kb + toolkit |

### Side-by-Side Code Comparison

**useReducer:**
```javascript
// All in one component file
function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, action.payload]
    case 'TOGGLE_TODO':
      return state.map(todo =>
        todo.id === action.id 
          ? { ...todo, done: !todo.done }
          : todo
      )
    default:
      return state
  }
}

function TodoList() {
  const [todos, dispatch] = useReducer(todoReducer, [])
  
  const addTodo = (text) => {
    dispatch({ type: 'ADD_TODO', payload: { id: Date.now(), text, done: false } })
  }
  
  return (
    // Component JSX
  )
}
```

**Redux (with Toolkit):**
```javascript
// store/todosSlice.js
const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      state.push(action.payload) // Immer handles immutability
    },
    toggleTodo: (state, action) => {
      const todo = state.find(t => t.id === action.payload)
      if (todo) todo.done = !todo.done
    }
  }
})

// Component
function TodoList() {
  const todos = useSelector(state => state.todos)
  const dispatch = useDispatch()
  
  const addTodo = (text) => {
    dispatch(todosSlice.actions.addTodo({ id: Date.now(), text, done: false }))
  }
  
  return (
    // Component JSX
  )
}
```

## Custom Hooks with useReducer

### Pattern 1: useReducer + Context for Scoped State

```javascript
// useSharedForm.js - Scoped shared state
const FormContext = createContext()

// Custom hook that provides the context
export function useFormState() {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useFormState must be used within FormProvider')
  }
  return context
}

// Provider component
export function FormProvider({ children }) {
  const [state, dispatch] = useReducer(formReducer, initialFormState)
  
  // Add helper methods
  const helpers = {
    updateField: (name, value) => 
      dispatch({ type: 'UPDATE_FIELD', name, value }),
    resetForm: () => 
      dispatch({ type: 'RESET' }),
    submitForm: async () => {
      dispatch({ type: 'SUBMIT_START' })
      // ... handle submission
    }
  }
  
  return (
    <FormContext.Provider value={{ state, dispatch, ...helpers }}>
      {children}
    </FormContext.Provider>
  )
}
```

**Usage:**
```javascript
// Parent component - wrap only what needs access
function CheckoutPage() {
  return (
    <div>
      <Header /> {/* No form access */}
      
      <FormProvider> {/* Scoped boundary */}
        <ShippingSection />
        <PaymentSection />
        <OrderSummary />
      </FormProvider>
      
      <Footer /> {/* No form access */}
    </div>
  )
}

// Child components - no prop drilling!
function ShippingSection() {
  const { state, updateField } = useFormState()
  
  return (
    <input 
      value={state.shipping.address}
      onChange={(e) => updateField('shipping.address', e.target.value)}
    />
  )
}
```

### Pattern 2: Factory Function for Reusable Patterns

```javascript
// createSharedState.js
export function createSharedState(reducer, initialState) {
  const Context = createContext()
  
  function Provider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
      <Context.Provider value={{ state, dispatch }}>
        {children}
      </Context.Provider>
    )
  }
  
  function useSharedState() {
    const context = useContext(Context)
    if (!context) throw new Error('Must be used within Provider')
    return context
  }
  
  return { Provider, useSharedState }
}

// Create different scoped states
const { Provider: CartProvider, useSharedState: useCart } = 
  createSharedState(cartReducer, { items: [] })

const { Provider: FilterProvider, useSharedState: useFilters } = 
  createSharedState(filterReducer, { search: '', category: 'all' })
```

## Shared State Without Providers

### Module-Level State Pattern

```javascript
// useSharedCounter.js
let listeners = []
let state = { count: 0 }

// Module-level setter that notifies all listeners
function setState(newState) {
  state = { ...state, ...newState }
  listeners.forEach(listener => listener(state))
}

// The custom hook
export function useSharedCounter() {
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  
  useEffect(() => {
    // Subscribe this component to updates
    listeners.push(forceUpdate)
    
    // Cleanup: unsubscribe on unmount
    return () => {
      listeners = listeners.filter(l => l !== forceUpdate)
    }
  }, [])
  
  // Methods that modify shared state
  const increment = () => setState({ count: state.count + 1 })
  const decrement = () => setState({ count: state.count - 1 })
  const reset = () => setState({ count: 0 })
  
  return {
    count: state.count,
    increment,
    decrement,
    reset
  }
}
```

**Usage - No Provider Needed:**
```javascript
// ComponentA.jsx - anywhere in the tree
function ComponentA() {
  const { count, increment } = useSharedCounter()
  
  return <button onClick={increment}>Count: {count}</button>
}

// ComponentB.jsx - anywhere else, not nested!
function ComponentB() {
  const { count, reset } = useSharedCounter()
  
  return (
    <div>
      <p>Current count: {count}</p>
      <button onClick={reset}>Reset</button>
    </div>
  )
}

// App.jsx - No provider wrapper needed!
function App() {
  return (
    <div>
      <ComponentA />
      <SomeOtherStuff />
      <DeeplyNested>
        <ComponentB />
      </DeeplyNested>
    </div>
  )
}
```

## The forceUpdate Pattern

### Understanding the Syntax

```javascript
const [, forceUpdate] = useReducer(x => x + 1, 0)
```

Let's break this down:

```javascript
const [, forceUpdate] = useReducer(x => x + 1, 0)
//    ↑                            ↑         ↑
//    |                            |         |
//    |                            |         initial value: 0
//    |                            reducer function: increment by 1
//    array destructuring (skipping first element)
```

### How It Works

1. **Normal useReducer returns two things:**
```javascript
const [state, dispatch] = useReducer(reducer, initialValue)
//      ↑        ↑
//    value   function to trigger updates
```

2. **We only need the update function:**
```javascript
const [, forceUpdate] = useReducer(x => x + 1, 0)
//     ↑
//   empty! (skipping the state value)
```

3. **Why it forces a re-render:**
- Calling `forceUpdate()` runs the reducer: `0 => 1`
- State changes from `0` to `1`
- React sees state changed → triggers re-render
- Each call increments: 0 → 1 → 2 → 3...

### Visual Flow

```javascript
// Step by step when external state changes:

1. External state changes: { count: 5 } → { count: 6 }
2. Notify all listeners: listeners.forEach(fn => fn())
3. Our listener is `forceUpdate`
4. forceUpdate() executes: internal state 0 → 1
5. React detects state change
6. Component re-renders
7. During re-render: `return state` now returns { count: 6 }
8. UI updates with new value!
```

### Alternative Approaches

```javascript
// Option 1: Boolean toggle (less reliable)
const [, forceUpdate] = useReducer(x => !x, false)
// Problem: React might batch and dedupe if called twice quickly

// Option 2: Object creation (always new reference)
const [, forceUpdate] = useReducer(() => ({}), {})
// Works but creates new objects unnecessarily

// Option 3: Using useState (more verbose)
const [, setTrigger] = useState(0)
const forceUpdate = () => setTrigger(prev => prev + 1)

// Option 4: Most explicit naming
const [ignored, forceUpdate] = useReducer(x => x + 1, 0)
console.log(ignored) // 0, 1, 2, 3... (but we never use it)
```

## Comparison with Vue Patterns

### React's Manual Subscription vs Vue's Automatic Reactivity

**React (Custom Hook with Manual Subscriptions):**
```javascript
// We manually manage subscriptions
let listeners = []
let state = { count: 0 }

function setState(newState) {
  state = newState
  listeners.forEach(l => l())  // Manual notification
}

function useSharedState() {
  const [, forceUpdate] = useReducer(x => x + 1, 0)
  
  useEffect(() => {
    listeners.push(forceUpdate)  // Manual subscription
    return () => { /* cleanup */ }
  }, [])
  
  return state
}
```

**Vue (Built-in Reactivity):**
```javascript
// Vue handles ALL of this automatically!
import { reactive } from 'vue'

export const state = reactive({ count: 0 })

// That's it! No subscriptions, no forceUpdate, it just works!
// Vue's reactivity system tracks who uses this state and updates them
```

### Comparison Table

| Aspect | React Custom Hook | Vue Composable |
|--------|------------------|----------------|
| **Shared State** | Manual subscription system | Automatic reactivity |
| **Re-renders** | `forceUpdate` trick | Automatic tracking |
| **Module-level state** | Plain JavaScript object | `reactive()`/`ref()` |
| **Subscription** | `useEffect` + cleanup | Not needed! |
| **Mental model** | Pub/sub pattern | Proxy-based reactivity |
| **Boilerplate** | Medium | Minimal |
| **DevTools** | Limited | Full support |

### The Key Insight

**React**: "I need to build a subscription system to share state without Context"

**Vue**: "Just put `reactive()` on it and share it. We'll handle the rest."

What requires a clever hack in React (`forceUpdate` + manual subscriptions) is just **the default behavior** in Vue.

## State Management Evolution

The typical journey for React developers:

```
1. useState → Simple component state
2. useReducer → Complex local state  
3. useReducer + Context → Shared state with providers
4. Redux → When you need the ecosystem
5. Zustand/Valtio → When tired of Redux boilerplate
6. Custom hooks with module state → For simple global state
```

## Best Practices

### When to Use Each Pattern

**useState:**
- Simple, independent values
- Form inputs
- UI state (modals, toggles)

**useReducer:**
- Related state that changes together
- Complex state transitions
- When you need an audit trail of changes

**useReducer + Context:**
- Feature-specific shared state
- Avoiding prop drilling
- Multiple instances needed

**Redux:**
- Large applications
- Complex async flows
- Time-travel debugging needed
- Team needs enforced patterns

**Module-level state (Zustand pattern):**
- Global singletons
- Cross-cutting concerns
- Simple shared state
- No need for providers

## Comparison: useReducer vs Redux vs Zustand

```javascript
// useReducer - Local/Component State
function Component() {
  const [state, dispatch] = useReducer(reducer, initial)
  // State scoped to this component
}

// Redux - Global State with Boilerplate
const slice = createSlice({...})
const store = configureStore({...})
// Wrap app with <Provider store={store}>
// Use with useSelector/useDispatch

// Zustand - Global State, Minimal Boilerplate
const useStore = create((set) => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 }))
}))
// Use anywhere, no provider needed

// Custom Hook with Module State - DIY Global State
let state = { count: 0 }
let listeners = []
export function useSharedState() {
  // Manual subscription logic
}
```

## Key Takeaways

1. **useReducer** is Redux's pattern without the global store
2. **useReducer + Context** gives you Redux-like functionality for feature state
3. **Module-level state** with custom hooks eliminates providers but requires manual subscriptions
4. **The forceUpdate pattern** (`useReducer(x => x + 1, 0)`) is a React idiom for forcing re-renders
5. **Vue's reactivity** does automatically what React requires manual setup for
6. Choose the pattern based on scope, complexity, and team preferences

## Resources

- [React Docs - useReducer](https://react.dev/reference/react/useReducer)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Valtio](https://github.com/pmndrs/valtio)
- [Vue Reactivity](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)