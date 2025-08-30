<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4 py-3">
        <router-link to="/" class="text-emerald-600 hover:text-emerald-700 flex items-center gap-2">
          <span>←</span> Back to Home
        </router-link>
      </div>
    </nav>

    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Component Communication Patterns</h1>
      
      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Props Demo -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Props (Parent → Child)</h2>
          <div class="mb-4 p-4 bg-emerald-50 rounded">
            <h3 class="font-medium mb-2">Parent Component</h3>
            <div class="space-y-2">
              <input
                v-model="parentMessage"
                placeholder="Type a message..."
                class="w-full px-3 py-2 border rounded"
              />
              <div class="text-sm text-gray-600">
                Sending: <code class="bg-gray-100 px-1">{{ parentMessage }}</code>
              </div>
            </div>
          </div>
          
          <ChildComponent :message="parentMessage" />
          
          <div class="mt-4 p-3 bg-gray-100 rounded text-sm">
            <code>&lt;ChildComponent :message="parentMessage" /&gt;</code>
          </div>
        </div>
        
        <!-- Emit Demo -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Emit (Child → Parent)</h2>
          <div class="mb-4 p-4 bg-emerald-50 rounded">
            <h3 class="font-medium mb-2">Parent receives:</h3>
            <div class="text-sm text-gray-600">
              Last event: <code class="bg-gray-100 px-1">{{ lastEmittedValue || 'None' }}</code>
            </div>
          </div>
          
          <EmitChild @custom-event="handleChildEvent" />
          
          <div class="mt-4 p-3 bg-gray-100 rounded text-sm">
            <code>&lt;EmitChild @custom-event="handleChildEvent" /&gt;</code>
          </div>
        </div>
        
        <!-- v-model Demo -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">v-model (Two-way Binding)</h2>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Parent Value:</label>
            <input
              v-model="modelValue"
              class="w-full px-3 py-2 border rounded"
            />
          </div>
          
          <ModelChild v-model="modelValue" />
          
          <div class="mt-4 p-3 bg-gray-100 rounded text-sm">
            <code>&lt;ModelChild v-model="modelValue" /&gt;</code>
          </div>
        </div>
        
        <!-- Provide/Inject Demo -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Provide/Inject</h2>
          <div class="mb-4 p-4 bg-emerald-50 rounded">
            <h3 class="font-medium mb-2">Provider (Ancestor)</h3>
            <input
              v-model="providedValue"
              placeholder="Provided value..."
              class="w-full px-3 py-2 border rounded"
            />
          </div>
          
          <InjectorChild />
          
          <div class="mt-4 p-3 bg-gray-100 rounded text-sm">
            <pre>provide('sharedValue', providedValue)</pre>
          </div>
        </div>
      </div>
      
      <!-- Slots Demo -->
      <div class="mt-6 bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Slots (Content Distribution)</h2>
        <div class="grid lg:grid-cols-3 gap-4">
          <SlotExample>
            <template #header>
              <h3 class="font-bold text-emerald-600">Custom Header</h3>
            </template>
            <p>This is the default slot content</p>
            <template #footer>
              <p class="text-sm text-gray-500">Custom Footer</p>
            </template>
          </SlotExample>
          
          <SlotExample>
            <p>Different content in default slot</p>
          </SlotExample>
          
          <SlotExample />
        </div>
        
        <div class="mt-4 p-3 bg-gray-100 rounded text-sm">
          <pre>&lt;SlotExample&gt;
  &lt;template #header&gt;...&lt;/template&gt;
  &lt;p&gt;Default slot&lt;/p&gt;
  &lt;template #footer&gt;...&lt;/template&gt;
&lt;/SlotExample&gt;</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'
import ChildComponent from '../components/communication/ChildComponent.vue'
import EmitChild from '../components/communication/EmitChild.vue'
import ModelChild from '../components/communication/ModelChild.vue'
import InjectorChild from '../components/communication/InjectorChild.vue'
import SlotExample from '../components/communication/SlotExample.vue'

const parentMessage = ref('Hello from parent!')
const lastEmittedValue = ref('')
const modelValue = ref('Two-way bound value')
const providedValue = ref('Shared across components')

provide('sharedValue', providedValue)

const handleChildEvent = (value: string) => {
  lastEmittedValue.value = value
}
</script>