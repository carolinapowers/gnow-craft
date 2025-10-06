import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  const update = (event: MouseEvent) => {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}

export function useCounter(initialValue = 0) {
  const counter = ref(initialValue)
  
  const increment = () => {
    counter.value++
  }
  
  const decrement = () => {
    counter.value--
  }
  
  return {
    counter,
    increment,
    decrement
  }
}