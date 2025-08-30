import * as Vue from 'vue'

export interface CompilationResult {
  component: any
  error: string | null
}

export function compileVueComponent(
  code: string,
  onConsoleLog?: (type: string, message: string) => void
): CompilationResult {
  try {
    // Parse template and script sections
    const templateMatch = code.match(/<template>([\s\S]*?)<\/template>/)
    const scriptMatch = code.match(/<script\s+setup>([\s\S]*?)<\/script>/)
    
    if (!templateMatch) {
      return { component: null, error: 'Template section is required' }
    }
    
    const template = templateMatch[1].trim()
    const scriptSetup = scriptMatch ? scriptMatch[1].trim() : ''
    
    // Create a wrapper for console
    const wrappedConsole = {
      log: (...args: any[]) => {
        if (onConsoleLog) {
          onConsoleLog('info', args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' '))
        }
        console.log(...args)
      },
      error: (...args: any[]) => {
        if (onConsoleLog) {
          onConsoleLog('error', args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' '))
        }
        console.error(...args)
      },
      warn: (...args: any[]) => {
        if (onConsoleLog) {
          onConsoleLog('warn', args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' '))
        }
        console.warn(...args)
      }
    }
    
    // Create the setup function that executes the script setup code
    const setupFunction = (props: any, { emit }: any) => {
      // Make Vue APIs available
      const { ref, reactive, computed, onMounted, onUnmounted, watch, watchEffect, nextTick, defineProps, defineEmits } = Vue
      
      // Create a new function that will execute the user's script setup code
      const userSetupCode = `
        ${scriptSetup}
        
        // Return all the variables and functions for the template
        return {
          ${extractVariableNames(scriptSetup).join(',\n          ')}
        }
      `
      
      try {
        const setupExecutor = new Function(
          'ref', 'reactive', 'computed', 'onMounted', 'onUnmounted', 
          'watch', 'watchEffect', 'nextTick', 'defineProps', 'defineEmits', 'console',
          'props', 'emit',
          userSetupCode
        )
        
        return setupExecutor(
          ref, reactive, computed, onMounted, onUnmounted,
          watch, watchEffect, nextTick, defineProps, defineEmits, wrappedConsole,
          props, emit
        )
      } catch (error: any) {
        if (onConsoleLog) {
          onConsoleLog('error', `Setup execution error: ${error.message}`)
        }
        throw error
      }
    }
    
    // Create the component
    const component = Vue.defineComponent({
      setup: setupFunction,
      template: template
    })
    
    return { component, error: null }
    
  } catch (error: any) {
    return { 
      component: null, 
      error: error.message || 'Unknown compilation error'
    }
  }
}

function extractVariableNames(scriptSetup: string): string[] {
  const names: string[] = []
  
  // Extract const/let/var declarations
  const varMatches = scriptSetup.matchAll(/(?:const|let|var)\s+(\w+)/g)
  for (const match of varMatches) {
    names.push(match[1])
  }
  
  // Extract function declarations
  const funcMatches = scriptSetup.matchAll(/function\s+(\w+)/g)
  for (const match of funcMatches) {
    names.push(match[1])
  }
  
  return names
}