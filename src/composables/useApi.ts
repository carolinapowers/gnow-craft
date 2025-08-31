import { ref, Ref } from 'vue';

interface UseApiReturn<T> {
  data: Ref<T | null>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  execute: () => Promise<void>;
}

/**
 * Reusable composable for API calls with loading and error states
 * This pattern is common in production Vue applications
 */
export function useApi<T>(
  url: string,
  options: RequestInit = {}
): UseApiReturn<T> {
  const data = ref<T | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const execute = async (retries = 3) => {
    loading.value = true;
    error.value = null;
    
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        data.value = await response.json();
        break;
      } catch (e) {
        if (i === retries - 1) {
          error.value = e as Error;
          console.error('API call failed after retries:', e);
        } else {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
          console.log(`Retrying API call... Attempt ${i + 2}/${retries}`);
        }
      }
    }
    
    loading.value = false;
  };

  return { 
    data, 
    loading, 
    error, 
    execute 
  };
}

// Example usage:
// const { data, loading, error, execute } = useApi<Course[]>('/api/courses');
// onMounted(() => execute());