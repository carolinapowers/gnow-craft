<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-4xl font-bold text-blue-900 mb-2">
              TypeScript Gotchas & Cheat Sheet
            </h1>
            <p class="text-lg text-blue-700">
              Common TypeScript pitfalls and interview scenarios with solutions
            </p>
          </div>
          <div class="text-6xl">📘</div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div class="bg-blue-50 rounded-lg p-4 text-center">
            <div class="text-3xl font-bold text-blue-600">12</div>
            <div class="text-sm text-blue-700">Common Gotchas</div>
          </div>
          <div class="bg-indigo-50 rounded-lg p-4 text-center">
            <div class="text-3xl font-bold text-indigo-600">8</div>
            <div class="text-sm text-indigo-700">Type Patterns</div>
          </div>
          <div class="bg-purple-50 rounded-lg p-4 text-center">
            <div class="text-3xl font-bold text-purple-600">6</div>
            <div class="text-sm text-purple-700">Utility Types</div>
          </div>
          <div class="bg-violet-50 rounded-lg p-4 text-center">
            <div class="text-3xl font-bold text-violet-600">10</div>
            <div class="text-sm text-violet-700">Best Practices</div>
          </div>
        </div>
      </div>

      <!-- Quick Reference -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Quick Reference: Common Fixes</h2>
        <div class="grid md:grid-cols-2 gap-4">
          <a
            v-for="(fix, index) in quickFixes"
            :key="index"
            :href="`#gotcha-${index}`"
            @click="scrollToGotcha(index, $event)"
            class="flex items-start gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
          >
            <span class="text-blue-600 font-bold text-sm">{{ index + 1 }}</span>
            <div class="flex-1">
              <div class="font-semibold text-gray-800 text-sm">{{ fix.problem }}</div>
              <div class="text-xs text-gray-600 mt-1">{{ fix.solution }}</div>
            </div>
          </a>
        </div>
      </div>

      <!-- Gotchas -->
      <div class="space-y-6">
        <div
          v-for="(gotcha, index) in gotchas"
          :key="index"
          :id="`gotcha-${index}`"
          class="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 scroll-mt-4"
          :class="gotcha.borderClass"
        >
          <div class="p-6">
            <!-- Header -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-2xl">{{ gotcha.icon }}</span>
                  <h3 class="text-2xl font-bold text-gray-800">
                    {{ index + 1 }}. {{ gotcha.title }}
                  </h3>
                </div>
                <div class="flex flex-wrap gap-2 mb-3">
                  <span
                    v-for="tag in gotcha.tags"
                    :key="tag"
                    class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Symptoms -->
            <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <div class="font-semibold text-red-800 mb-2">⚠️ Symptoms:</div>
              <ul class="list-disc list-inside text-red-700 text-sm space-y-1">
                <li v-for="(symptom, i) in gotcha.symptoms" :key="i">{{ symptom }}</li>
              </ul>
            </div>

            <!-- Buggy Code -->
            <div class="mb-4">
              <div class="flex items-center justify-between mb-2">
                <span class="font-semibold text-gray-700">❌ Buggy Code:</span>
              </div>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm"><code>{{ gotcha.buggyCode }}</code></pre>
            </div>

            <!-- Hints -->
            <details class="mb-4" :ref="el => detailsRefs[index] = el">
              <summary class="cursor-pointer font-semibold text-blue-600 hover:text-blue-800 mb-2">
                💡 Hints (click to expand)
              </summary>
              <div class="bg-blue-50 p-4 rounded-lg ml-4">
                <ol class="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li v-for="(hint, i) in gotcha.hints" :key="i">{{ hint }}</li>
                </ol>
              </div>
            </details>

            <!-- Solution -->
            <details class="mb-4">
              <summary class="cursor-pointer font-semibold text-green-600 hover:text-green-800 mb-2">
                ✅ Solution (click to expand)
              </summary>
              <div class="ml-4">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm mb-3"><code>{{ gotcha.solution }}</code></pre>
                <div class="bg-green-50 p-4 rounded-lg">
                  <div class="font-semibold text-green-800 mb-2">Key Lessons:</div>
                  <ul class="list-disc list-inside text-green-700 text-sm space-y-1">
                    <li v-for="(lesson, i) in gotcha.lessons" :key="i">{{ lesson }}</li>
                  </ul>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>

      <!-- Utility Types Reference -->
      <div class="bg-white rounded-xl shadow-lg p-6 mt-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Essential Utility Types</h2>
        <div class="grid md:grid-cols-2 gap-4">
          <div v-for="util in utilityTypes" :key="util.name" class="border border-blue-200 rounded-lg p-4">
            <div class="font-bold text-blue-700 mb-2">{{ util.name }}</div>
            <div class="text-sm text-gray-600 mb-3">{{ util.description }}</div>
            <pre class="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto"><code>{{ util.example }}</code></pre>
          </div>
        </div>
      </div>

      <!-- Best Practices -->
      <div class="bg-white rounded-xl shadow-lg p-6 mt-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Interview Best Practices</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div v-for="practice in bestPractices" :key="practice.category">
            <h3 class="font-bold text-blue-700 mb-3">{{ practice.category }}</h3>
            <ul class="space-y-2">
              <li v-for="(tip, i) in practice.tips" :key="i" class="flex items-start gap-2">
                <span class="text-blue-500 mt-1">✓</span>
                <span class="text-sm text-gray-700">{{ tip }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const detailsRefs = ref<(HTMLDetailsElement | null)[]>([]);

const scrollToGotcha = (index: number, event: Event) => {
  event.preventDefault();

  const element = document.getElementById(`gotcha-${index}`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Open the details element after scrolling
    setTimeout(() => {
      const details = detailsRefs.value[index];
      if (details && !details.open) {
        details.open = true;
      }
    }, 500);
  }
};

const quickFixes = [
  { problem: 'Type assertion fails', solution: 'Use "as const" for literal types or type guards' },
  { problem: 'Array methods lose type', solution: 'Explicitly type array or use generics' },
  { problem: 'Optional chaining gives any', solution: 'Use non-null assertion (!) or type guards' },
  { problem: 'Async function type mismatch', solution: 'Return Promise<Type> explicitly' },
  { problem: 'Enum reverse mapping', solution: 'Use const enum or string literals' },
  { problem: 'Index signature errors', solution: 'Use Record<K, V> or mapped types' },
  { problem: 'Generic constraints fail', solution: 'Use extends keyword properly' },
  { problem: 'Union type narrowing', solution: 'Use type guards or discriminated unions' },
  { problem: 'Readonly vs const', solution: 'Use readonly for properties, const for variables' },
  { problem: 'Type vs Interface', solution: 'Use interface for objects, type for unions/primitives' },
  { problem: 'never type confusion', solution: 'Understand exhaustive checks and unreachable code' },
  { problem: 'any vs unknown', solution: 'Prefer unknown and add type guards' }
];

const gotchas = [
  {
    title: 'Array.prototype methods losing types',
    icon: '🔢',
    tags: ['Arrays', 'Generics', 'Type Inference'],
    borderClass: 'border-red-500',
    symptoms: [
      'TypeScript shows "any" for array method results',
      'Lost type safety after map/filter/reduce',
      'IDE autocomplete stops working'
    ],
    buggyCode: `const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

// Type is inferred as any[]
const names = users.map(u => u.name);

// This doesn't error even though price doesn't exist!
const prices = users.map(u => u.price);`,
    hints: [
      'Explicitly type the array or use generics',
      'TypeScript can\'t always infer complex transformations',
      'Consider using "as const" for literal arrays'
    ],
    solution: `interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

// Option 1: Explicit return type
const names: string[] = users.map(u => u.name);

// Option 2: Inline type annotation
const ids = users.map((u: User): number => u.id);

// Option 3: Generic type parameter
const mapToNames = <T extends { name: string }>(items: T[]): string[] =>
  items.map(item => item.name);`,
    lessons: [
      'Always type your arrays explicitly, especially when using complex transformations',
      'Use generics for reusable type-safe functions',
      'Enable strict mode to catch these issues early'
    ]
  },
  {
    title: 'Enum reverse mapping gotcha',
    icon: '🔄',
    tags: ['Enums', 'Reverse Mapping', 'String Literals'],
    borderClass: 'border-orange-500',
    symptoms: [
      'Enum has unexpected extra properties',
      'Object.keys() returns twice as many keys',
      'Reverse lookup causes confusion'
    ],
    buggyCode: `enum Status {
  Pending = 0,
  Active = 1,
  Completed = 2
}

// This returns 6 entries! ['Pending', 'Active', 'Completed', '0', '1', '2']
console.log(Object.keys(Status));

// Both work, but creates confusion
console.log(Status.Active); // 1
console.log(Status[1]); // 'Active'`,
    hints: [
      'Numeric enums create reverse mappings automatically',
      'Use const enum to eliminate reverse mapping',
      'Consider using string literal unions instead'
    ],
    solution: `// Option 1: const enum (no reverse mapping)
const enum Status {
  Pending = 0,
  Active = 1,
  Completed = 2
}

// Option 2: String enum (no numeric reverse mapping)
enum StatusStr {
  Pending = 'PENDING',
  Active = 'ACTIVE',
  Completed = 'COMPLETED'
}

// Option 3: String literal union (preferred in many cases)
type Status = 'pending' | 'active' | 'completed';

const STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed'
} as const;

type StatusType = typeof STATUS[keyof typeof STATUS];`,
    lessons: [
      'Numeric enums create bidirectional mappings (value ↔ name)',
      'const enum prevents reverse mapping and inlines values',
      'String literal unions are often clearer and safer'
    ]
  },
  {
    title: 'Type assertion vs Type guard',
    icon: '🛡️',
    tags: ['Type Guards', 'Type Safety', 'Runtime'],
    borderClass: 'border-yellow-500',
    symptoms: [
      'Runtime errors despite TypeScript passing',
      'Type assertions bypass safety checks',
      'No runtime validation'
    ],
    buggyCode: `interface User {
  id: number;
  email: string;
}

// Type assertion - NO runtime check!
const data = fetchData() as User;
data.email.toLowerCase(); // Runtime error if data is null!

// This compiles but crashes
function getUser(id: number): User {
  const result = apiCall(id);
  return result as User; // Dangerous!
}`,
    hints: [
      'Type assertions (as) don\'t validate at runtime',
      'Use type guards (is) for runtime safety',
      'Validate external data with runtime checks'
    ],
    solution: `interface User {
  id: number;
  email: string;
}

// Option 1: Type guard function
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof (value as User).id === 'number' &&
    'email' in value &&
    typeof (value as User).email === 'string'
  );
}

// Safe usage
const data = fetchData();
if (isUser(data)) {
  data.email.toLowerCase(); // Safe!
}

// Option 2: Runtime validation library
import { z } from 'zod';

const UserSchema = z.object({
  id: z.number(),
  email: z.string().email()
});

function getUser(id: number): User {
  const result = apiCall(id);
  return UserSchema.parse(result); // Throws if invalid
}`,
    lessons: [
      'Type assertions bypass TypeScript safety - use sparingly',
      'Type guards provide runtime validation',
      'Always validate external data (APIs, localStorage, etc.)'
    ]
  },
  {
    title: 'Optional chaining returning any',
    icon: '🔗',
    tags: ['Optional Chaining', 'Type Inference', 'Nullability'],
    borderClass: 'border-green-500',
    symptoms: [
      'Type becomes "any" after optional chaining',
      'Lost autocomplete on nested properties',
      'Unexpected behavior with undefined'
    ],
    buggyCode: `interface User {
  profile?: {
    address?: {
      city: string;
    };
  };
}

const user: User = {};

// Type is inferred as "any" in some TS versions
const city = user.profile?.address?.city;

// This doesn't error!
city.toUpperCase(); // Runtime error if undefined`,
    hints: [
      'Optional chaining can lose type information',
      'Use nullish coalescing (??) for defaults',
      'Add explicit type annotations'
    ],
    solution: `interface User {
  profile?: {
    address?: {
      city: string;
    };
  };
}

const user: User = {};

// Option 1: Explicit type with default
const city: string = user.profile?.address?.city ?? 'Unknown';

// Option 2: Type guard
if (user.profile?.address?.city) {
  const city: string = user.profile.address.city;
  city.toUpperCase(); // Safe!
}

// Option 3: Non-null assertion (use carefully!)
const city = user.profile?.address?.city!;

// Option 4: Make required with utility type
type RequiredAddress = Required<NonNullable<User['profile']>>;`,
    lessons: [
      'Optional chaining returns "undefined" if any part is nullish',
      'Combine with nullish coalescing for safe defaults',
      'Use type guards for complex nested access'
    ]
  },
  {
    title: 'Generic constraints confusion',
    icon: '🎯',
    tags: ['Generics', 'Constraints', 'Type Parameters'],
    borderClass: 'border-blue-500',
    symptoms: [
      'Generic type "could be instantiated with different subtype"',
      'Constraints too loose or too strict',
      'Type parameter not used correctly'
    ],
    buggyCode: `// Too loose - T could be anything
function getProperty<T>(obj: T, key: string) {
  return obj[key]; // Error: Element implicitly has 'any' type
}

// Won't work with string keys
function getById<T>(items: T[], id: number) {
  return items.find(item => item.id === id); // Error: Property 'id' does not exist
}`,
    hints: [
      'Use "extends" to constrain generic types',
      'Combine generics with keyof for key access',
      'Use conditional types for complex constraints'
    ],
    solution: `// Option 1: Constrain with keyof
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: 'Alice' };
const name = getProperty(user, 'name'); // Type: string

// Option 2: Constrain with interface
interface HasId {
  id: number;
}

function getById<T extends HasId>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

// Option 3: Multiple constraints
function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

// Option 4: Conditional constraints
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function callAndLog<T extends (...args: any[]) => any>(
  fn: T
): GetReturnType<T> {
  const result = fn();
  console.log(result);
  return result;
}`,
    lessons: [
      'Always constrain generics with "extends" when accessing properties',
      'Use keyof for type-safe property access',
      'Combine multiple constraints with & (intersection types)'
    ]
  },
  {
    title: 'Index signatures losing specificity',
    icon: '🗝️',
    tags: ['Index Signatures', 'Record', 'Mapped Types'],
    borderClass: 'border-indigo-500',
    symptoms: [
      'Specific properties get overridden by index signature',
      'Type becomes too general',
      'Lost autocomplete for known keys'
    ],
    buggyCode: `// This doesn't work as expected
interface Config {
  apiUrl: string;
  timeout: number;
  [key: string]: string; // Error! timeout is number, not string
}

// Index signature prevents specific types
interface User {
  id: number;
  [key: string]: any; // Now id is also 'any'!
}`,
    hints: [
      'Index signatures must be compatible with all properties',
      'Use Record<K, V> for homogeneous objects',
      'Use mapped types for more flexibility'
    ],
    solution: `// Option 1: Separate known and unknown properties
interface Config {
  apiUrl: string;
  timeout: number;
}

type ConfigWithExtras = Config & {
  [key: string]: string | number;
};

// Option 2: Use Record for homogeneous objects
type StringMap = Record<string, string>;

// Option 3: Mapped types with unions
type ApiConfig = {
  apiUrl: string;
  timeout: number;
} & {
  [K in string]?: string | number;
};

// Option 4: Discriminated union for flexibility
type Setting =
  | { type: 'string'; value: string }
  | { type: 'number'; value: number }
  | { type: 'boolean'; value: boolean };

type Settings = Record<string, Setting>;`,
    lessons: [
      'Index signatures must match ALL properties (including specific ones)',
      'Use Record<K, V> for simple key-value maps',
      'Combine specific properties with index signatures carefully'
    ]
  },
  {
    title: 'Union type not narrowing',
    icon: '🔀',
    tags: ['Union Types', 'Type Narrowing', 'Discriminated Unions'],
    borderClass: 'border-purple-500',
    symptoms: [
      'TypeScript can\'t narrow union types',
      'Property access errors on unions',
      'Type guards not working'
    ],
    buggyCode: `type Success = { status: 'success'; data: string };
type Error = { status: 'error'; message: string };
type Result = Success | Error;

function handle(result: Result) {
  // This doesn't narrow the type!
  if (result.status) {
    console.log(result.data); // Error: Property 'data' does not exist on type 'Result'
  }
}

// Won't work with typeof
type StringOrNumber = string | number;
function process(value: StringOrNumber) {
  if (value) { // Doesn't narrow!
    return value.toUpperCase(); // Error
  }
}`,
    hints: [
      'Use discriminated unions with literal types',
      'Use proper type guards (typeof, instanceof, in)',
      'Check the discriminant property explicitly'
    ],
    solution: `type Success = { status: 'success'; data: string };
type Error = { status: 'error'; message: string };
type Result = Success | Error;

// Option 1: Check discriminant explicitly
function handle(result: Result) {
  if (result.status === 'success') {
    console.log(result.data); // ✓ TypeScript knows this is Success
  } else {
    console.log(result.message); // ✓ TypeScript knows this is Error
  }
}

// Option 2: Type guard for primitives
type StringOrNumber = string | number;

function process(value: StringOrNumber) {
  if (typeof value === 'string') {
    return value.toUpperCase(); // ✓ Narrowed to string
  } else {
    return value.toFixed(2); // ✓ Narrowed to number
  }
}

// Option 3: Custom type guard
function isSuccess(result: Result): result is Success {
  return result.status === 'success';
}

function handleWithGuard(result: Result) {
  if (isSuccess(result)) {
    console.log(result.data); // ✓ Type is Success
  }
}

// Option 4: "in" operator
type Dog = { bark: () => void };
type Cat = { meow: () => void };

function makeSound(animal: Dog | Cat) {
  if ('bark' in animal) {
    animal.bark(); // ✓ Narrowed to Dog
  } else {
    animal.meow(); // ✓ Narrowed to Cat
  }
}`,
    lessons: [
      'Use discriminated unions with literal types for best narrowing',
      'typeof, instanceof, and "in" operator narrow types',
      'Create custom type guards with "is" keyword'
    ]
  },
  {
    title: 'Async/await type inference',
    icon: '⏰',
    tags: ['Async', 'Promises', 'Type Inference'],
    borderClass: 'border-pink-500',
    symptoms: [
      'Promise<T> vs T confusion',
      'Type is Promise<any> instead of specific type',
      'await not unwrapping type correctly'
    ],
    buggyCode: `// Return type is implicit Promise<any>
async function fetchUser(id: number) {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json(); // Type: any
}

// This doesn't work as expected
async function getUsers() {
  return [1, 2, 3].map(async id => {
    return await fetchUser(id); // Type: Promise<any>[]
  });
}`,
    hints: [
      'Always explicitly type async function returns',
      'await unwraps Promise<T> to T',
      'Use Promise.all() for array of promises'
    ],
    solution: `interface User {
  id: number;
  name: string;
}

// Option 1: Explicit return type
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  const data = await response.json();
  return data as User; // Or validate with type guard
}

// Option 2: Generic async function
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json();
}

const user = await fetchData<User>('/api/users/1');

// Option 3: Promise.all for arrays
async function getUsers(): Promise<User[]> {
  const promises = [1, 2, 3].map(id => fetchUser(id));
  return Promise.all(promises); // Returns Promise<User[]>
}

// Option 4: Type from library
import type { AxiosResponse } from 'axios';

async function fetchUserAxios(id: number): Promise<User> {
  const response: AxiosResponse<User> = await axios.get(\`/api/users/\${id}\`);
  return response.data;
}`,
    lessons: [
      'Always explicitly type async functions that return data',
      'Use Promise.all() to resolve arrays of promises',
      'Validate or assert types when deserializing JSON'
    ]
  },
  {
    title: 'Readonly vs const confusion',
    icon: '🔒',
    tags: ['Readonly', 'Immutability', 'Const'],
    borderClass: 'border-teal-500',
    symptoms: [
      'Readonly doesn\'t prevent deep mutations',
      'const allows object property changes',
      'Readonly is only compile-time'
    ],
    buggyCode: `interface User {
  readonly id: number;
  profile: {
    name: string;
  };
}

const user: User = {
  id: 1,
  profile: { name: 'Alice' }
};

user.id = 2; // Error: Cannot assign to 'id' because it is a read-only property

// But this works! Readonly is shallow
user.profile.name = 'Bob'; // ✓ No error

// const doesn't prevent mutations
const users = [1, 2, 3];
users.push(4); // ✓ No error`,
    hints: [
      'readonly is shallow - only the immediate property is readonly',
      'Use Readonly<T> utility type for shallow readonly',
      'Use DeepReadonly for deeply nested immutability'
    ],
    solution: `// Option 1: Deep readonly with recursive type
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K];
};

interface User {
  id: number;
  profile: {
    name: string;
    address: {
      city: string;
    };
  };
}

const user: DeepReadonly<User> = {
  id: 1,
  profile: {
    name: 'Alice',
    address: { city: 'NYC' }
  }
};

// All of these error now:
// user.id = 2;
// user.profile.name = 'Bob';
// user.profile.address.city = 'LA';

// Option 2: as const for literals
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
} as const;

// config.timeout = 3000; // Error

// Option 3: ReadonlyArray
const numbers: ReadonlyArray<number> = [1, 2, 3];
// numbers.push(4); // Error
// numbers[0] = 99; // Error

// Option 4: Readonly utility type
type ReadonlyUser = Readonly<User>;`,
    lessons: [
      'readonly is shallow - only prevents reassignment of the property itself',
      'Use "as const" for deeply readonly literal objects',
      'Create DeepReadonly type for recursive immutability'
    ]
  },
  {
    title: 'Type vs Interface gotcha',
    icon: '📐',
    tags: ['Type Alias', 'Interface', 'Declaration Merging'],
    borderClass: 'border-cyan-500',
    symptoms: [
      'Interface extends works differently than type intersection',
      'Declaration merging causes unexpected behavior',
      'Performance differences in large codebases'
    ],
    buggyCode: `// Can't do this with interface
type StringOrNumber = string | number;

// Can't merge types (only interfaces)
type User = {
  id: number;
};

// Error: Duplicate identifier 'User'
type User = {
  name: string;
};

// This works but may not be what you want
interface Config {
  apiUrl: string;
}

interface Config {
  timeout: number; // Merges with above!
}`,
    hints: [
      'Use type for unions, primitives, and tuples',
      'Use interface for object shapes that might be extended',
      'Interfaces support declaration merging'
    ],
    solution: `// Type: Use for unions, primitives, mapped types
type ID = string | number;
type Status = 'pending' | 'active' | 'completed';
type Point = [number, number];
type Nullable<T> = T | null;

// Interface: Use for object shapes
interface User {
  id: number;
  name: string;
}

// Interface extends (nominal)
interface Admin extends User {
  role: 'admin';
}

// Type intersection (structural)
type Admin = User & {
  role: 'admin';
};

// Declaration merging (only interfaces)
interface Window {
  myCustomProperty: string;
}

// This merges with lib.dom.d.ts Window interface
// window.myCustomProperty is now valid

// When to use what:
// ✓ Type for: unions, primitives, tuples, computed properties
type UserKeys = keyof User;
type ReadonlyUser = Readonly<User>;

// ✓ Interface for: object shapes, classes, extendable contracts
interface Repository<T> {
  getById(id: number): T;
  save(item: T): void;
}

class UserRepository implements Repository<User> {
  getById(id: number): User { /* ... */ }
  save(user: User): void { /* ... */ }
}`,
    lessons: [
      'Interfaces can be merged (declaration merging), types cannot',
      'Use type for unions, primitives, and complex types',
      'Use interface for object shapes and class contracts',
      'Both can be extended, but interfaces are slightly faster for TypeScript compiler'
    ]
  },
  {
    title: 'never type confusion',
    icon: '🚫',
    tags: ['Never', 'Exhaustive Checks', 'Unreachable Code'],
    borderClass: 'border-red-500',
    symptoms: [
      'Function returns never but code continues',
      'Switch statements not exhaustive',
      'Union becomes never unexpectedly'
    ],
    buggyCode: `type Status = 'pending' | 'active' | 'completed';

function getStatusColor(status: Status): string {
  switch (status) {
    case 'pending':
      return 'yellow';
    case 'active':
      return 'green';
    // Missing 'completed' case - no error!
  }
  // Returns undefined instead of erroring
}

// This returns never but no error at compile time
function processValue(value: string & number) {
  return value; // Type is never (impossible intersection)
}`,
    hints: [
      'Use never for exhaustive checks',
      'never means "this should never happen"',
      'Use it to catch missing cases at compile time'
    ],
    solution: `type Status = 'pending' | 'active' | 'completed';

// Option 1: Exhaustive check with never
function assertNever(value: never): never {
  throw new Error(\`Unexpected value: \${value}\`);
}

function getStatusColor(status: Status): string {
  switch (status) {
    case 'pending':
      return 'yellow';
    case 'active':
      return 'green';
    case 'completed':
      return 'blue';
    default:
      return assertNever(status); // Error if any case is missing!
  }
}

// Option 2: Never for impossible states
type LoadingState =
  | { status: 'loading'; data: never } // Can't have data while loading
  | { status: 'success'; data: string }
  | { status: 'error'; error: string; data: never };

// Option 3: Never in conditional types
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>; // string
type B = NonNullable<number | undefined>; // number

// Option 4: Never for unreachable code
function fail(message: string): never {
  throw new Error(message);
}

function processUser(user: User | null) {
  if (!user) {
    fail('User not found'); // TypeScript knows code after this is unreachable
  }

  // user is narrowed to User (not null) here
  console.log(user.name);
}`,
    lessons: [
      'never represents impossible types or unreachable code',
      'Use assertNever() for exhaustive switch/if checks',
      'never in unions gets eliminated: string | never = string',
      'Functions that always throw should return never'
    ]
  },
  {
    title: 'any vs unknown gotcha',
    icon: '❓',
    tags: ['Any', 'Unknown', 'Type Safety'],
    borderClass: 'border-gray-500',
    symptoms: [
      'any bypasses all type checking',
      'unknown requires type narrowing',
      'Implicit any from external sources'
    ],
    buggyCode: `// any: No type safety at all!
function processData(data: any) {
  data.foo.bar.baz(); // No error, crashes at runtime
  return data.nonexistent.property; // No error!
}

// unknown: Can't do anything without narrowing
function processUnknown(data: unknown) {
  return data.toUpperCase(); // Error: Object is of type 'unknown'
}

// Implicit any from JSON
const config = JSON.parse(localStorage.getItem('config')); // Type: any
config.anything.goes; // No error!`,
    hints: [
      'Prefer unknown over any - forces you to validate',
      'Use type guards to narrow unknown',
      'Enable noImplicitAny in tsconfig.json'
    ],
    solution: `// Option 1: Use unknown and type guards
function processData(data: unknown): string {
  if (typeof data === 'string') {
    return data.toUpperCase(); // Safe!
  }

  if (typeof data === 'object' && data !== null && 'name' in data) {
    return String((data as { name: string }).name);
  }

  throw new Error('Invalid data type');
}

// Option 2: Runtime validation with type guard
interface Config {
  apiUrl: string;
  timeout: number;
}

function isConfig(value: unknown): value is Config {
  return (
    typeof value === 'object' &&
    value !== null &&
    'apiUrl' in value &&
    typeof (value as Config).apiUrl === 'string' &&
    'timeout' in value &&
    typeof (value as Config).timeout === 'number'
  );
}

const rawConfig: unknown = JSON.parse(localStorage.getItem('config') ?? '{}');
if (isConfig(rawConfig)) {
  console.log(rawConfig.apiUrl); // Safe!
}

// Option 3: Use validation library
import { z } from 'zod';

const ConfigSchema = z.object({
  apiUrl: z.string().url(),
  timeout: z.number().positive()
});

type Config = z.infer<typeof ConfigSchema>;

function getConfig(): Config {
  const raw: unknown = JSON.parse(localStorage.getItem('config') ?? '{}');
  return ConfigSchema.parse(raw); // Throws if invalid
}

// Option 4: Generic type guard
function hasProperty<K extends string>(
  obj: unknown,
  key: K
): obj is Record<K, unknown> {
  return typeof obj === 'object' && obj !== null && key in obj;
}`,
    lessons: [
      'any disables ALL type checking - avoid unless absolutely necessary',
      'unknown is safer - requires type narrowing before use',
      'Always validate data from external sources (APIs, localStorage, user input)',
      'Use validation libraries (zod, yup, io-ts) for complex runtime validation'
    ]
  }
];

const utilityTypes = [
  {
    name: 'Partial<T>',
    description: 'Makes all properties optional',
    example: `interface User {
  id: number;
  name: string;
}

type PartialUser = Partial<User>;
// { id?: number; name?: string; }`
  },
  {
    name: 'Required<T>',
    description: 'Makes all properties required',
    example: `interface User {
  id?: number;
  name?: string;
}

type RequiredUser = Required<User>;
// { id: number; name: string; }`
  },
  {
    name: 'Pick<T, K>',
    description: 'Pick specific properties from type',
    example: `interface User {
  id: number;
  name: string;
  email: string;
}

type UserPreview = Pick<User, 'id' | 'name'>;
// { id: number; name: string; }`
  },
  {
    name: 'Omit<T, K>',
    description: 'Omit specific properties from type',
    example: `interface User {
  id: number;
  password: string;
  name: string;
}

type PublicUser = Omit<User, 'password'>;
// { id: number; name: string; }`
  },
  {
    name: 'Record<K, T>',
    description: 'Create object type with specific keys',
    example: `type Role = 'admin' | 'user' | 'guest';

type Permissions = Record<Role, string[]>;
// { admin: string[]; user: string[]; guest: string[]; }`
  },
  {
    name: 'Exclude<T, U>',
    description: 'Exclude types from union',
    example: `type Status = 'pending' | 'active' | 'deleted';

type ActiveStatus = Exclude<Status, 'deleted'>;
// 'pending' | 'active'`
  },
  {
    name: 'Extract<T, U>',
    description: 'Extract types from union',
    example: `type Status = 'pending' | 'active' | 'deleted';

type NonActiveStatus = Extract<Status, 'pending' | 'deleted'>;
// 'pending' | 'deleted'`
  },
  {
    name: 'ReturnType<T>',
    description: 'Get return type of function',
    example: `function getUser() {
  return { id: 1, name: 'Alice' };
}

type User = ReturnType<typeof getUser>;
// { id: number; name: string; }`
  },
  {
    name: 'Awaited<T>',
    description: 'Unwrap Promise type',
    example: `type UserPromise = Promise<{ id: number }>;

type User = Awaited<UserPromise>;
// { id: number; }`
  },
  {
    name: 'NonNullable<T>',
    description: 'Remove null and undefined from type',
    example: `type MaybeString = string | null | undefined;

type DefiniteString = NonNullable<MaybeString>;
// string`
  }
];

const bestPractices = [
  {
    category: 'Type Safety',
    tips: [
      'Enable strict mode in tsconfig.json',
      'Avoid "any" - use "unknown" and validate',
      'Use type guards for runtime validation',
      'Explicitly type function returns',
      'Validate external data (APIs, user input)'
    ]
  },
  {
    category: 'Performance',
    tips: [
      'Use interfaces for object shapes (faster compilation)',
      'Use const enums when you don\'t need reverse mapping',
      'Avoid complex conditional types in hot paths',
      'Use type aliases for reusable complex types'
    ]
  },
  {
    category: 'Maintainability',
    tips: [
      'Use discriminated unions for state machines',
      'Prefer readonly for immutability',
      'Use utility types instead of manual mapping',
      'Name types and interfaces clearly',
      'Document complex types with JSDoc comments'
    ]
  },
  {
    category: 'Generics',
    tips: [
      'Always constrain generics with "extends"',
      'Use keyof for type-safe property access',
      'Prefer generic functions over type assertions',
      'Use infer in conditional types for flexibility'
    ]
  },
  {
    category: 'Interview Tips',
    tips: [
      'Explain trade-offs between type and interface',
      'Demonstrate understanding of type narrowing',
      'Show knowledge of utility types',
      'Discuss runtime vs compile-time type safety',
      'Explain when to use unknown vs any'
    ]
  }
];
</script>
