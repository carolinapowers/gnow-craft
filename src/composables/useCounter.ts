/**
 * useCounter Composable
 * Example composable for demonstrating Vue's testing recommendations
 */

import { ref, computed } from 'vue'

export interface UseCounterOptions {
  initialValue?: number
  min?: number
  max?: number
  step?: number
}

export function useCounter(options: UseCounterOptions = {}) {
  const {
    initialValue = 0,
    min = Number.NEGATIVE_INFINITY,
    max = Number.POSITIVE_INFINITY,
    step = 1
  } = options

  // State
  const count = ref(initialValue)

  // Computed
  const isMin = computed(() => count.value <= min)
  const isMax = computed(() => count.value >= max)
  const isEven = computed(() => count.value % 2 === 0)
  const isOdd = computed(() => !isEven.value)
  const isPositive = computed(() => count.value > 0)
  const isNegative = computed(() => count.value < 0)
  const isZero = computed(() => count.value === 0)

  // Methods
  const increment = () => {
    const newValue = count.value + step
    if (newValue <= max) {
      count.value = newValue
    }
  }

  const decrement = () => {
    const newValue = count.value - step
    if (newValue >= min) {
      count.value = newValue
    }
  }

  const reset = () => {
    count.value = initialValue
  }

  const set = (value: number) => {
    if (value >= min && value <= max) {
      count.value = value
    }
  }

  const double = () => {
    const newValue = count.value * 2
    if (newValue <= max) {
      count.value = newValue
    }
  }

  const halve = () => {
    const newValue = Math.floor(count.value / 2)
    if (newValue >= min) {
      count.value = newValue
    }
  }

  return {
    // State
    count,
    
    // Computed
    isMin,
    isMax,
    isEven,
    isOdd,
    isPositive,
    isNegative,
    isZero,
    
    // Methods
    increment,
    decrement,
    reset,
    set,
    double,
    halve
  }
}
