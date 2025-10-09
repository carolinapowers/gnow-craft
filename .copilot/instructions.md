# GitHub Copilot Instructions for TDD

## Project Context
This is a Vue 3 + TypeScript + Tailwind CSS application following Vue.js official testing recommendations.
We use Test-Driven Development (TDD) with tests living alongside source files.

## Vue.js Testing Best Practices
Based on https://vuejs.org/guide/scaling-up/testing:

### Core Principles
- **Test behavior, not implementation details**
- **Focus on inputs and outputs**
- **Use data-test attributes for element selection**
- **Prefer integration over isolation**
- **Tests live alongside components**

## Testing Guidelines
- **Frameworks**: Vitest with both @vue/test-utils and @testing-library/vue
- **Pattern**: AAA (Arrange, Act, Assert)
- **Element Selection Priority** (Testing Library approach):
  1. `getByRole` - Most accessible (e.g., `getByRole('button', { name: /submit/i })`)
  2. `getByLabelText` - For form inputs (e.g., `getByLabelText(/email address/i)`)
  3. `getByPlaceholderText` - If no label available
  4. `getByText` - For non-interactive elements
  5. `getByTestId` - Last resort using data-test attributes
- **User Interactions**: Use `userEvent` for realistic interactions
- **Mocking**: Use vi.mock() for external dependencies
- **Coverage Target**: Minimum 80% for all metrics

## Vue 3 Best Practices
- Use Composition API with `<script setup>`
- TypeScript for all components
- Props with `defineProps` and TypeScript interfaces
- Events with `defineEmits`
- Tailwind CSS for styling

## Test Generation Patterns

### Component Tests Template
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import ComponentName from './ComponentName.vue'

describe('ComponentName', () => {
  let wrapper: VueWrapper
  
  beforeEach(() => {
    wrapper = mount(ComponentName, {
      props: {
        // default props
      }
    })
  })
  
  // Test structure
  it('should [expected behavior]', async () => {
    // Arrange
    // Act
    // Assert
  })
})
```

### Common Test Scenarios
1. **Props validation**: Test all prop combinations
2. **Event emissions**: Verify events are emitted with correct payloads
3. **User interactions**: Click, input, form submissions
4. **Computed properties**: Test reactive computations
5. **Watchers**: Test side effects from data changes
6. **API calls**: Mock and test async operations
7. **Error handling**: Test error states and fallbacks
8. **Accessibility**: Test ARIA attributes and keyboard navigation

## TDD Workflow
1. Read GitHub issue requirements
2. Write failing tests first
3. Implement minimal code to pass tests
4. Refactor while keeping tests green
5. Add edge cases and error handling

## Code Examples from This Project
Refer to existing patterns in:
- `src/components/__tests__/`
- `src/views/__tests__/`
- `src/composables/__tests__/`

## Mocking Patterns

### API Mocking
```typescript
vi.mock('@/api/teeTimesApi', () => ({
  fetchTeeTimes: vi.fn().mockResolvedValue([
    { id: 1, course: 'Pine Valley', time: '8:00 AM' }
  ])
}))
```

### Vue Router Mocking
```typescript
import { useRouter } from 'vue-router'
vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn()
  }))
}))
```

## Data Test IDs Convention
- Buttons: `data-testid="btn-{action}"`
- Inputs: `data-testid="input-{field}"`
- Lists: `data-testid="list-{name}"`
- Items: `data-testid="item-{type}-{index}"`
- Messages: `data-testid="msg-{type}"`

## Common Assertions

### Element Visibility
```typescript
expect(wrapper.find('[data-testid="element"]').exists()).toBe(true)
expect(wrapper.find('[data-testid="element"]').isVisible()).toBe(true)
```

### Text Content
```typescript
expect(wrapper.text()).toContain('expected text')
expect(wrapper.find('[data-testid="element"]').text()).toBe('exact text')
```

### Props and Attributes
```typescript
expect(wrapper.props('propName')).toBe(expectedValue)
expect(wrapper.attributes('aria-label')).toBe('expected label')
```

### Events
```typescript
await wrapper.find('[data-testid="button"]').trigger('click')
expect(wrapper.emitted('event-name')).toBeTruthy()
expect(wrapper.emitted('event-name')?.[0]).toEqual([expectedPayload])
```

### Async Operations
```typescript
await wrapper.vm.$nextTick()
await vi.waitFor(() => {
  expect(wrapper.find('[data-testid="element"]').exists()).toBe(true)
})
```

## Performance Considerations
- Use `shallowMount` when testing component logic without children
- Mock heavy dependencies
- Use `vi.useFakeTimers()` for time-based tests
- Clean up after each test with `afterEach` hooks
