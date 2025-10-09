/**
 * useCounter Composable Tests
 * Following Vue.js testing recommendations for composables
 * https://vuejs.org/guide/scaling-up/testing#testing-composables
 */

import { describe, it, expect } from 'vitest'
import { useCounter } from './useCounter'
import { withSetup, testReactiveComposable } from '@/test/helpers/composables-testing'

describe('useCounter Composable', () => {
  describe('Initialization', () => {
    it('should initialize with default value of 0', () => {
      const [{ count }] = withSetup(() => useCounter())
      expect(count.value).toBe(0)
    })

    it('should initialize with custom initial value', () => {
      const [{ count }] = withSetup(() => useCounter({ initialValue: 10 }))
      expect(count.value).toBe(10)
    })

    it('should respect min and max boundaries', () => {
      const [counter] = withSetup(() => 
        useCounter({ initialValue: 5, min: 0, max: 10 })
      )
      
      // Try to exceed max
      counter.set(15)
      expect(counter.count.value).toBe(5) // Should not change
      
      // Try to go below min
      counter.set(-5)
      expect(counter.count.value).toBe(5) // Should not change
      
      // Valid value
      counter.set(7)
      expect(counter.count.value).toBe(7)
    })
  })

  describe('Increment and Decrement', () => {
    it('should increment count by default step', () => {
      const [counter] = withSetup(() => useCounter())
      
      counter.increment()
      expect(counter.count.value).toBe(1)
      
      counter.increment()
      expect(counter.count.value).toBe(2)
    })

    it('should decrement count by default step', () => {
      const [counter] = withSetup(() => useCounter({ initialValue: 5 }))
      
      counter.decrement()
      expect(counter.count.value).toBe(4)
      
      counter.decrement()
      expect(counter.count.value).toBe(3)
    })

    it('should use custom step value', () => {
      const [counter] = withSetup(() => 
        useCounter({ initialValue: 10, step: 5 })
      )
      
      counter.increment()
      expect(counter.count.value).toBe(15)
      
      counter.decrement()
      expect(counter.count.value).toBe(10)
    })

    it('should not exceed max when incrementing', () => {
      const [counter] = withSetup(() => 
        useCounter({ initialValue: 9, max: 10 })
      )
      
      counter.increment()
      expect(counter.count.value).toBe(10)
      
      counter.increment() // Should not go beyond max
      expect(counter.count.value).toBe(10)
    })

    it('should not go below min when decrementing', () => {
      const [counter] = withSetup(() => 
        useCounter({ initialValue: 1, min: 0 })
      )
      
      counter.decrement()
      expect(counter.count.value).toBe(0)
      
      counter.decrement() // Should not go below min
      expect(counter.count.value).toBe(0)
    })
  })

  describe('Computed Properties', () => {
    it('should correctly compute even/odd state', () => {
      const [counter] = withSetup(() => useCounter())
      
      expect(counter.isEven.value).toBe(true)
      expect(counter.isOdd.value).toBe(false)
      
      counter.increment()
      expect(counter.isEven.value).toBe(false)
      expect(counter.isOdd.value).toBe(true)
    })

    it('should correctly compute positive/negative/zero state', () => {
      const [counter] = withSetup(() => useCounter({ initialValue: 0 }))
      
      expect(counter.isZero.value).toBe(true)
      expect(counter.isPositive.value).toBe(false)
      expect(counter.isNegative.value).toBe(false)
      
      counter.increment()
      expect(counter.isZero.value).toBe(false)
      expect(counter.isPositive.value).toBe(true)
      expect(counter.isNegative.value).toBe(false)
      
      counter.set(-5)
      expect(counter.isZero.value).toBe(false)
      expect(counter.isPositive.value).toBe(false)
      expect(counter.isNegative.value).toBe(true)
    })

    it('should correctly compute min/max state', () => {
      const [counter] = withSetup(() => 
        useCounter({ initialValue: 5, min: 0, max: 10 })
      )
      
      expect(counter.isMin.value).toBe(false)
      expect(counter.isMax.value).toBe(false)
      
      counter.set(0)
      expect(counter.isMin.value).toBe(true)
      expect(counter.isMax.value).toBe(false)
      
      counter.set(10)
      expect(counter.isMin.value).toBe(false)
      expect(counter.isMax.value).toBe(true)
    })
  })

  describe('Utility Methods', () => {
    it('should reset to initial value', () => {
      const [counter] = withSetup(() => useCounter({ initialValue: 5 }))
      
      counter.increment()
      counter.increment()
      expect(counter.count.value).toBe(7)
      
      counter.reset()
      expect(counter.count.value).toBe(5)
    })

    it('should double the count', () => {
      const [counter] = withSetup(() => useCounter({ initialValue: 3 }))
      
      counter.double()
      expect(counter.count.value).toBe(6)
      
      counter.double()
      expect(counter.count.value).toBe(12)
    })

    it('should not double beyond max', () => {
      const [counter] = withSetup(() => 
        useCounter({ initialValue: 6, max: 10 })
      )
      
      counter.double() // Would be 12, but max is 10
      expect(counter.count.value).toBe(6) // Should not change
    })

    it('should halve the count', () => {
      const [counter] = withSetup(() => useCounter({ initialValue: 10 }))
      
      counter.halve()
      expect(counter.count.value).toBe(5)
      
      counter.halve()
      expect(counter.count.value).toBe(2) // Floor of 2.5
    })

    it('should not halve below min', () => {
      const [counter] = withSetup(() => 
        useCounter({ initialValue: 3, min: 5 })
      )
      
      counter.halve() // Would be 1, but min is 5
      expect(counter.count.value).toBe(3) // Should not change
    })
  })

  describe('Reactivity', () => {
    it('should maintain reactivity across mutations', async () => {
      await testReactiveComposable(
        () => useCounter({ initialValue: 0 }),
        [
          {
            mutate: (counter) => counter.increment(),
            expect: (counter) => {
              expect(counter.count.value).toBe(1)
              expect(counter.isOdd.value).toBe(true)
              expect(counter.isPositive.value).toBe(true)
            }
          },
          {
            mutate: (counter) => counter.double(),
            expect: (counter) => {
              expect(counter.count.value).toBe(2)
              expect(counter.isEven.value).toBe(true)
            }
          },
          {
            mutate: (counter) => counter.reset(),
            expect: (counter) => {
              expect(counter.count.value).toBe(0)
              expect(counter.isZero.value).toBe(true)
            }
          }
        ]
      )
    })
  })

  describe('Edge Cases', () => {
    it('should handle very large numbers', () => {
      const [counter] = withSetup(() => 
        useCounter({ initialValue: Number.MAX_SAFE_INTEGER - 1 })
      )
      
      counter.increment()
      expect(counter.count.value).toBe(Number.MAX_SAFE_INTEGER)
    })

    it('should handle negative numbers', () => {
      const [counter] = withSetup(() => 
        useCounter({ initialValue: -10 })
      )
      
      expect(counter.isNegative.value).toBe(true)
      counter.increment()
      expect(counter.count.value).toBe(-9)
    })

    it('should handle decimal step values', () => {
      const [counter] = withSetup(() => 
        useCounter({ initialValue: 0, step: 0.5 })
      )
      
      counter.increment()
      expect(counter.count.value).toBe(0.5)
      
      counter.increment()
      expect(counter.count.value).toBe(1)
    })
  })
})
