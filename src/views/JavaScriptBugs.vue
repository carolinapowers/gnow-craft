<template>
  <div class="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 py-12 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-gray-900 mb-4">
          JavaScript Core Debugging Scenarios
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          15 fundamental JavaScript bugs that appear in all frameworks. Master these patterns
          and you'll debug React, Vue, or any JS application with confidence.
        </p>
      </div>

      <!-- Quick Reference -->
      <div class="mb-12 bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Quick Reference: Common Fixes</h2>
        <div class="grid md:grid-cols-2 gap-4">
          <a
            v-for="(fix, index) in quickFixes"
            :key="index"
            :href="`#bug-${index + 1}`"
            @click="scrollToBug(index + 1, $event)"
            class="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer"
          >
            <span class="text-yellow-600 font-bold text-sm">{{ index + 1 }}</span>
            <div class="flex-1">
              <div class="font-semibold text-gray-800 text-sm">{{ fix.problem }}</div>
              <div class="text-xs text-gray-600 mt-1">{{ fix.solution }}</div>
            </div>
          </a>
        </div>
      </div>

      <!-- Bug Cards -->
      <div class="space-y-8">
        <!-- Bug 1: Scope and Closure -->
        <CollapsibleBugCard
          id="bug-1"
          title="Bug #1: Closure Variable Capture 🔴"
          description="Loop variable captured incorrectly in closure"
          badge="Classic"
          border-color="yellow"
        >
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>All event handlers log the same value</li>
                <li>Loop variable always shows the final value</li>
                <li>Closures capture reference, not value</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// ❌ Classic closure bug
for (var i = 0; i &lt; 5; i++) {
  setTimeout(() => {
    console.log(i); // Always logs 5!
  }, i * 1000);
}

// ❌ Event handlers with var
const buttons = document.querySelectorAll('button');
for (var i = 0; i &lt; buttons.length; i++) {
  buttons[i].addEventListener('click', () => {
    alert('Button ' + i); // Always shows last index!
  });
}</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  The var keyword creates function-scoped variables. By the time the callback runs,
                  the loop has finished and i has its final value. Use let (block-scoped) or IIFE.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution 1: Use let (block scope)
for (let i = 0; i &lt; 5; i++) {
  setTimeout(() => {
    console.log(i); // Logs 0, 1, 2, 3, 4
  }, i * 1000);
}

// Solution 2: IIFE to create closure
for (var i = 0; i &lt; 5; i++) {
  (function(index) {
    setTimeout(() => {
      console.log(index);
    }, index * 1000);
  })(i);
}

// Solution 3: Pass parameter to setTimeout
for (var i = 0; i &lt; 5; i++) {
  setTimeout((index) => {
    console.log(index);
  }, i * 1000, i);
}</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Always use let/const in modern JavaScript. Understand var creates function scope.
                </p>
              </div>
            </details>
          </div>
        </CollapsibleBugCard>

        <!-- Bug 2: This Binding -->
        <CollapsibleBugCard
          id="bug-2"
          title="Bug #2: Lost 'this' Context 🔴"
          description="Method loses 'this' binding when passed as callback"
          badge="Classic"
          border-color="yellow"
        >
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>TypeError: Cannot read property of undefined</li>
                <li>'this' is undefined or window object</li>
                <li>Class methods don't work as callbacks</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>class Counter {
  constructor() {
    this.count = 0;
  }

  increment() {
    this.count++;
    console.log(this.count);
  }
}

const counter = new Counter();
const button = document.querySelector('button');

// ❌ Lost 'this' context!
button.addEventListener('click', counter.increment);
// Error: Cannot read property 'count' of undefined</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  When you pass a method as a callback, it loses its 'this' binding.
                  Use arrow functions, bind(), or wrap in a function that preserves context.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution 1: Arrow function in callback
button.addEventListener('click', () => counter.increment());

// Solution 2: Bind in constructor
class Counter {
  constructor() {
    this.count = 0;
    this.increment = this.increment.bind(this);
  }

  increment() {
    this.count++;
  }
}

// Solution 3: Class field arrow function
class Counter {
  count = 0;

  increment = () => {
    this.count++;
  }
}

// Solution 4: Bind when passing
button.addEventListener('click', counter.increment.bind(counter));</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Arrow functions don't have their own 'this'. Use them for callbacks.
                </p>
              </div>
            </details>
          </div>
        </CollapsibleBugCard>

        <!-- Bug 3: Async/Await Error Handling -->
        <CollapsibleBugCard
          id="bug-3"
          title="Bug #3: Promise Chain Breaking 🔴"
          description="Error in promise chain stops execution"
          badge="Common"
          border-color="yellow"
        >
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Unhandled promise rejection</li>
                <li>Subsequent .then() blocks don't execute</li>
                <li>Silent failures in promise chains</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// ❌ No error handling
fetch('/api/users')
  .then(res => res.json())
  .then(users => {
    users.forEach(user => {
      // If this throws, chain breaks!
      processUser(user);
    });
  })
  .then(() => {
    console.log('Done'); // Never runs if error above
  });

// ❌ Async/await without try/catch
async function loadData() {
  const response = await fetch('/api/data');
  const data = await response.json(); // Could fail!
  return data;
}</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  Always add .catch() to promise chains or wrap async/await in try/catch.
                  One error breaks the entire chain unless handled.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution 1: Add .catch() to chain
fetch('/api/users')
  .then(res => res.json())
  .then(users => {
    users.forEach(user => processUser(user));
  })
  .then(() => console.log('Done'))
  .catch(error => {
    console.error('Failed:', error);
  });

// Solution 2: Try/catch with async/await
async function loadData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Load failed:', error);
    throw error; // Re-throw or return default
  }
}

// Solution 3: Promise.allSettled for multiple
const results = await Promise.allSettled([
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/comments')
]);

results.forEach((result, i) => {
  if (result.status === 'rejected') {
    console.error(`Request ${i} failed:`, result.reason);
  }
});</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Never leave promises unhandled. Always catch errors.
                </p>
              </div>
            </details>
          </div>
        </CollapsibleBugCard>

        <!-- Bug 4: Array/Object Reference -->
        <CollapsibleBugCard
          id="bug-4"
          title="Bug #4: Unexpected Object Mutation 🔴"
          description="Object/array reference shared instead of copied"
          badge="Common"
          border-color="yellow"
        >
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Changes to copy affect original</li>
                <li>Objects unexpectedly share data</li>
                <li>Array operations modify wrong data</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// ❌ Shallow copy still shares nested objects
const user = {
  name: 'John',
  address: { city: 'NYC' }
};

const copy = { ...user };
copy.address.city = 'LA';
console.log(user.address.city); // 'LA' - Original changed!

// ❌ Array reference shared
const original = [1, 2, 3];
const reference = original;
reference.push(4);
console.log(original); // [1, 2, 3, 4] - Original changed!</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  Spread operator and Object.assign() create shallow copies.
                  Nested objects/arrays are still references. Use deep clone for nested data.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution 1: Deep clone with JSON (simple objects)
const deepCopy = JSON.parse(JSON.stringify(user));
deepCopy.address.city = 'LA';
console.log(user.address.city); // Still 'NYC'

// Solution 2: structuredClone (modern browsers)
const deepCopy2 = structuredClone(user);

// Solution 3: Manual deep clone for arrays
const original = [{ id: 1 }, { id: 2 }];
const copy = original.map(item => ({ ...item }));

// Solution 4: Immutable updates
const updated = {
  ...user,
  address: {
    ...user.address,
    city: 'LA'
  }
};

// For arrays - use non-mutating methods
const newArray = [...original, 4]; // Don't modify original
const filtered = original.filter(x => x > 1); // Returns new array</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Objects are passed by reference. Always create proper copies for mutations.
                </p>
              </div>
            </details>
          </div>
        </CollapsibleBugCard>

        <!-- Bug 5: == vs === -->
        <CollapsibleBugCard
          id="bug-5"
          title="Bug #5: Type Coercion Gotchas 🔴"
          description="Loose equality causes unexpected comparisons"
          badge="Classic"
          border-color="yellow"
        >
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Unexpected truthy/falsy behavior</li>
                <li>String '0' equals number 0</li>
                <li>null == undefined but null !== undefined</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// ❌ Type coercion surprises
console.log(0 == '0');        // true
console.log(0 == []);         // true
console.log('0' == []);       // false

if ([] == false) {            // true!
  console.log('What?');
}

// ❌ Truthy/falsy confusion
const arr = [];
if (arr) {
  console.log('Empty array is truthy!');
}

if (arr.length) { // Better check
  console.log('This won\'t run');
}</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  Always use === and !== for comparisons. The == operator performs type coercion
                  with confusing rules. Know your falsy values: false, 0, '', null, undefined, NaN.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution: Always use strict equality
console.log(0 === '0');       // false
console.log(0 === []);        // false
console.log(null === undefined); // false

// Explicit checks for what you mean
const arr = [];
if (arr.length > 0) {
  // Check length, not truthiness
}

// Nullish coalescing for defaults
const value = userInput ?? 'default'; // Only null/undefined
const value2 = userInput || 'default'; // Any falsy

// Explicit type checking
if (typeof value === 'string') { }
if (Array.isArray(value)) { }
if (value !== null && value !== undefined) { }

// Common falsy values to remember
const falsyValues = [
  false,      // boolean false
  0,          // number zero
  '',         // empty string
  null,       // null
  undefined,  // undefined
  NaN         // not a number
];</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Use === and be explicit about type checks. Know the 6 falsy values.
                </p>
              </div>
            </details>
          </div>
        </CollapsibleBugCard>

        <!-- Bug 6: Hoisting -->
        <CollapsibleBugCard
          id="bug-6"
          title="Bug #6: Temporal Dead Zone 🔴"
          description="Accessing let/const before declaration"
          badge="Tricky"
          border-color="yellow"
        >
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>ReferenceError: Cannot access before initialization</li>
                <li>Function works with var but fails with let</li>
                <li>Hoisting confusion between var, let, const</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// ❌ Temporal Dead Zone with let/const
function example() {
  console.log(myVar);  // undefined (hoisted)
  console.log(myLet);  // ReferenceError!

  var myVar = 'var';
  let myLet = 'let';
}

// ❌ Function hoisting confusion
sayHello(); // Works!
sayGoodbye(); // TypeError: not a function

function sayHello() {
  console.log('Hello');
}

var sayGoodbye = function() {
  console.log('Goodbye');
};</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  var declarations are hoisted and initialized to undefined. let/const are hoisted
                  but not initialized (Temporal Dead Zone). Function declarations are fully hoisted.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution: Declare before use, prefer const/let
function example() {
  const myConst = 'const';
  let myLet = 'let';

  console.log(myConst); // Works fine
  console.log(myLet);   // Works fine
}

// Function expressions - declare before use
const sayGoodbye = function() {
  console.log('Goodbye');
};

sayGoodbye(); // Works now

// Arrow functions - also must be declared first
const greet = () => console.log('Hi');

// Understanding hoisting:
// This code:
function hoisting() {
  console.log(x); // undefined
  var x = 5;
}

// Is interpreted as:
function hoisting() {
  var x;          // Declaration hoisted
  console.log(x); // undefined
  x = 5;          // Assignment stays
}</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Always declare variables before use. Prefer const/let over var.
                </p>
              </div>
            </details>
          </div>
        </CollapsibleBugCard>

        <!-- Bug 7: Event Loop & Timing -->
        <CollapsibleBugCard
          id="bug-7"
          title="Bug #7: Event Loop Misunderstanding 🔴"
          description="Unexpected execution order with setTimeout"
          badge="Important"
          border-color="yellow"
        >
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>setTimeout(fn, 0) doesn't run immediately</li>
                <li>Promises execute before setTimeout</li>
                <li>Unexpected async execution order</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// ❌ Misunderstanding execution order
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => console.log('3'));

console.log('4');

// Actual output: 1, 4, 3, 2
// Expected: 1, 2, 3, 4</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  Event loop priority: Synchronous code → Microtasks (Promises) → Macrotasks (setTimeout).
                  setTimeout(fn, 0) doesn't mean "run immediately", it means "run after current stack clears".
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Understanding the event loop
// 1. Synchronous code runs first
console.log('Sync 1');

// 2. Microtasks (Promises) run next
Promise.resolve().then(() => console.log('Microtask'));

// 3. Macrotasks (setTimeout) run last
setTimeout(() => console.log('Macrotask'), 0);

console.log('Sync 2');

// Output: Sync 1, Sync 2, Microtask, Macrotask

// If you need to defer to next tick
queueMicrotask(() => {
  // Runs after current code, before setTimeout
});

// For actual immediate execution
const runNow = () => {
  // Just call it directly!
};
runNow();</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Know the event loop: sync → microtasks → macrotasks.
                </p>
              </div>
            </details>
          </div>
        </CollapsibleBugCard>

        <!-- Bug 8: Destructuring Defaults -->
        <CollapsibleBugCard
          id="bug-8"
          title="Bug #8: Destructuring Pitfalls 🔴"
          description="Defaults don't work as expected with null/undefined"
          badge="Subtle"
          border-color="yellow"
        >
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Default values ignored for null</li>
                <li>Cannot destructure null/undefined</li>
                <li>Unexpected TypeError in destructuring</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// ❌ Defaults only work for undefined, not null
const { name = 'Unknown' } = { name: null };
console.log(name); // null, not 'Unknown'!

// ❌ Cannot destructure null/undefined
const user = null;
const { id } = user; // TypeError!

// ❌ Nested destructuring fails
const data = { user: null };
const { user: { name } } = data; // TypeError!</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  Destructuring defaults only apply to undefined, not null.
                  Use nullish coalescing (??) or optional chaining (?.) for safer destructuring.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution 1: Nullish coalescing before destructure
const obj = { name: null };
const { name } = obj ?? {};
const safeName = name ?? 'Unknown';

// Solution 2: Default the whole object
const { id, name = 'Unknown' } = user || {};

// Solution 3: Optional chaining with destructuring
const data = { user: null };
const name = data?.user?.name ?? 'Unknown';

// Solution 4: Safe nested destructuring
const {
  user: {
    name = 'Unknown'
  } = {}
} = data;

// For function parameters
function greet({ name = 'Guest' } = {}) {
  console.log(`Hello, ${name}`);
}

greet();           // Hello, Guest
greet({});         // Hello, Guest
greet({ name: 'John' }); // Hello, John</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Destructuring defaults work for undefined only. Use ?? and ?. for null safety.
                </p>
              </div>
            </details>
          </div>
        </CollapsibleBugCard>

        <!-- Bug 9: Array Mutation Methods -->
        <CollapsibleBugCard
          id="bug-9"
          title="Bug #9: Array Mutation Methods 🔴"
          description="Using mutating methods unexpectedly changes original array"
          badge="Common"
          border-color="yellow"
        >
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Original array modified when you expected a copy</li>
                <li>Unexpected side effects in other parts of code</li>
                <li>Hard to debug state changes</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// ❌ Mutating methods modify original
const numbers = [3, 1, 4, 1, 5];
const sorted = numbers.sort();
console.log(numbers); // [1, 1, 3, 4, 5] - Original changed!

// ❌ push/pop/shift/unshift mutate
const items = [1, 2, 3];
const newLength = items.push(4);
console.log(items); // [1, 2, 3, 4] - Original modified

// ❌ splice mutates
const fruits = ['apple', 'banana', 'orange'];
const removed = fruits.splice(1, 1);
console.log(fruits); // ['apple', 'orange'] - Original changed!</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  Mutating methods: push, pop, shift, unshift, splice, sort, reverse, fill.
                  Non-mutating methods: map, filter, concat, slice, spread operator.
                  Use toSorted, toReversed (ES2023) for immutable operations.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution 1: Use spread operator before mutating
const numbers = [3, 1, 4, 1, 5];
const sorted = [...numbers].sort();
console.log(numbers); // [3, 1, 4, 1, 5] - Original unchanged

// Solution 2: Use non-mutating alternatives
const items = [1, 2, 3];
const withNew = [...items, 4]; // Instead of push
const withoutLast = items.slice(0, -1); // Instead of pop

// Solution 3: Use toSorted/toReversed (ES2023)
const numbers = [3, 1, 4, 1, 5];
const sorted = numbers.toSorted();
const reversed = numbers.toReversed();

// Solution 4: Use concat instead of push
const combined = items.concat(4, 5, 6);

// Solution 5: Use filter instead of splice
const fruits = ['apple', 'banana', 'orange'];
const withoutBanana = fruits.filter(f => f !== 'banana');

// Immutable array operations reference
const original = [1, 2, 3];
const added = [...original, 4];        // Instead of push
const removed = original.slice(1);     // Instead of shift
const filtered = original.filter(x => x > 1); // Instead of splice
const mapped = original.map(x => x * 2);      // Transform
const sorted = [...original].sort();   // Instead of sort</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Know which array methods mutate. Use spread or non-mutating alternatives.
                </p>
              </div>
            </details>
          </div>
        </CollapsibleBugCard>

        <!-- Bug 10: Falsy Value Confusion -->
        <CollapsibleBugCard
          id="bug-10"
          title="Bug #10: Falsy Value Confusion 🔴"
          description="Conditional logic fails with 0, empty string, or false"
          badge="Tricky"
          border-color="yellow"
        >
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>0 is treated as "no value" when it's valid</li>
                <li>Empty strings fail checks incorrectly</li>
                <li>false boolean values trigger fallbacks</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// ❌ || treats 0 as falsy
function setScore(score) {
  const finalScore = score || 100;
  return finalScore;
}
console.log(setScore(0)); // 100 - Wrong! 0 is valid

// ❌ Empty string is falsy
const name = '';
const displayName = name || 'Guest';
console.log(displayName); // 'Guest' - What if empty is valid?

// ❌ false boolean ignored
const settings = {
  notifications: false
};
const notify = settings.notifications || true;
console.log(notify); // true - Ignores explicit false!</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  The || operator uses ANY falsy value (0, '', false, null, undefined, NaN).
                  The ?? operator only checks for null and undefined.
                  Use ?? when 0, '', or false are valid values.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution: Use nullish coalescing (??)
function setScore(score) {
  const finalScore = score ?? 100;
  return finalScore;
}
console.log(setScore(0)); // 0 - Correct!
console.log(setScore(null)); // 100 - Uses default
console.log(setScore(undefined)); // 100 - Uses default

// For empty strings that are valid
const name = '';
const displayName = name ?? 'Guest';
console.log(displayName); // '' - Empty string preserved

// For boolean values
const settings = {
  notifications: false
};
const notify = settings.notifications ?? true;
console.log(notify); // false - Preserves explicit false

// Comparison chart
const value = 0;
console.log(value || 'default');  // 'default' - 0 is falsy
console.log(value ?? 'default');  // 0 - Only null/undefined

const empty = '';
console.log(empty || 'default');  // 'default' - '' is falsy
console.log(empty ?? 'default');  // '' - Only null/undefined

// When to use each
const config = {
  timeout: userInput || 5000,     // ❌ Breaks if userInput is 0
  timeout: userInput ?? 5000,     // ✅ 0 is valid

  message: userMsg || 'Hello',    // ❌ Breaks if userMsg is ''
  message: userMsg ?? 'Hello',    // ✅ '' is valid
};</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Use ?? for defaults when 0, '', or false are valid values.
                </p>
              </div>
            </details>
          </div>
        </CollapsibleBugCard>

        <!-- Bug 11: Floating Point Precision -->
        <CollapsibleBugCard
          id="bug-11"
          title="Bug #11: Floating Point Precision 🔴"
          description="Decimal math produces unexpected results"
          badge="Classic"
          border-color="yellow"
        >
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>0.1 + 0.2 !== 0.3 (equals 0.30000000000000004)</li>
                <li>Money calculations show wrong values</li>
                <li>Rounding errors accumulate over time</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// ❌ Classic floating point issue
console.log(0.1 + 0.2); // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // false!

// ❌ Money calculation bug
const price = 0.1;
const tax = 0.2;
const total = price + tax;
console.log(total); // 0.30000000000000004

// ❌ Rounding doesn't fix comparison
const a = 0.1 + 0.2;
const b = 0.3;
console.log(a === b); // false</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  JavaScript uses IEEE 754 floating point, which can't represent some decimals precisely.
                  For money, work in cents (integers). For comparisons, use epsilon tolerance.
                  For precision math, use libraries like decimal.js or big.js.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution 1: Use toFixed for display
const result = 0.1 + 0.2;
console.log(result.toFixed(2)); // "0.30" (string)
console.log(Number(result.toFixed(2))); // 0.3 (number)

// Solution 2: Work with cents for money
const priceInCents = 10; // $0.10
const taxInCents = 20;   // $0.20
const totalInCents = priceInCents + taxInCents;
const totalDollars = totalInCents / 100;
console.log(totalDollars); // 0.3 - Correct!

// Solution 3: Epsilon comparison
function areEqual(a, b, epsilon = 0.0001) {
  return Math.abs(a - b) < epsilon;
}
console.log(areEqual(0.1 + 0.2, 0.3)); // true

// Solution 4: Math.round for precision
const a = 0.1 + 0.2;
const rounded = Math.round(a * 100) / 100;
console.log(rounded); // 0.3

// Solution 5: Use Decimal library for precision
// npm install decimal.js
import Decimal from 'decimal.js';

const price = new Decimal(0.1);
const tax = new Decimal(0.2);
const total = price.plus(tax);
console.log(total.toString()); // "0.3"

// Best practice for money
class Money {
  constructor(cents) {
    this.cents = Math.round(cents);
  }

  add(other) {
    return new Money(this.cents + other.cents);
  }

  toDollars() {
    return this.cents / 100;
  }
}

const price = new Money(10);  // $0.10
const tax = new Money(20);    // $0.20
const total = price.add(tax);
console.log(total.toDollars()); // 0.3</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Never use === with floats. Work in integers for money or use Decimal libraries.
                </p>
              </div>
            </details>
          </div>
        </CollapsibleBugCard>

        <!-- Bug 12: String to Number Comparison -->
        <CollapsibleBugCard
          id="bug-12"
          title="Bug #12: String to Number Comparison 🔴"
          description="Comparing strings and numbers gives unexpected results"
          badge="Common"
          border-color="yellow"
        >
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>"10" > "9" returns false (lexicographic comparison)</li>
                <li>String sorting fails with numbers</li>
                <li>Type coercion produces wrong results</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// ❌ String comparison uses lexicographic order
console.log("10" > "9"); // false! (compares "1" vs "9")
console.log("2" > "10"); // true! (compares "2" vs "1")

// ❌ Sorting strings of numbers
const numbers = ["10", "5", "40", "25", "1000", "1"];
numbers.sort();
console.log(numbers); // ["1", "10", "1000", "25", "40", "5"]

// ❌ Mixed type comparisons
console.log("10" > 5);  // true (coerces "10" to 10)
console.log("10" > "5"); // false (string comparison)</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  String comparison is lexicographic (like dictionary order).
                  Always convert to numbers explicitly with Number(), parseInt(), or + operator.
                  Use a comparison function for array.sort() with numbers.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution 1: Convert to numbers explicitly
console.log(Number("10") > Number("9")); // true
console.log(parseInt("10") > parseInt("9")); // true
console.log(+"10" > +"9"); // true (unary + converts)

// Solution 2: Sort with comparison function
const numbers = ["10", "5", "40", "25", "1000", "1"];
numbers.sort((a, b) => Number(a) - Number(b));
console.log(numbers); // ["1", "5", "10", "25", "40", "1000"]

// Or convert to numbers first
const nums = numbers.map(Number);
nums.sort((a, b) => a - b);

// Solution 3: Validate types before comparing
function compareValues(a, b) {
  const numA = typeof a === 'string' ? Number(a) : a;
  const numB = typeof b === 'string' ? Number(b) : b;
  return numA > numB;
}

// Solution 4: Use parseInt with radix
const str = "10";
const num = parseInt(str, 10); // Always specify radix
console.log(num > 5); // true

// Common patterns
const userInput = "42";

// Convert before comparison
if (Number(userInput) > 40) { }
if (+userInput > 40) { }
if (parseInt(userInput, 10) > 40) { }

// Array sorting
const scores = ["100", "20", "3"];
scores.sort(); // ❌ ["100", "20", "3"]
scores.sort((a, b) => a - b); // ✅ ["3", "20", "100"]</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Always convert strings to numbers explicitly before numeric operations.
                </p>
              </div>
            </details>
          </div>
        </CollapsibleBugCard>

        <!-- Bug 13: NaN Comparison -->
        <CollapsibleBugCard
          id="bug-13"
          title="Bug #13: NaN Comparison 🔴"
          description="NaN === NaN returns false"
          badge="Classic"
          border-color="yellow"
        >
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>NaN === NaN is always false</li>
                <li>isNaN() coerces to number (unexpected behavior)</li>
                <li>Validation checks fail for NaN values</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// ❌ NaN never equals itself
const result = 0 / 0;
console.log(result === NaN); // false
console.log(NaN === NaN);    // false

// ❌ isNaN coerces to number
console.log(isNaN("hello"));  // true (coerces "hello" to NaN)
console.log(isNaN("123"));    // false (coerces "123" to 123)
console.log(isNaN(undefined)); // true (coerces to NaN)
console.log(isNaN({}));       // true (coerces to NaN)

// ❌ Can't filter out NaN easily
const numbers = [1, 2, NaN, 4, NaN, 6];
const clean = numbers.filter(n => n !== NaN);
console.log(clean); // Still has NaN values!</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  NaN is the only value in JavaScript that doesn't equal itself.
                  Use Number.isNaN() instead of isNaN() - it doesn't coerce.
                  Or use Object.is(value, NaN) for comparison.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution 1: Use Number.isNaN() (no coercion)
const result = 0 / 0;
console.log(Number.isNaN(result)); // true
console.log(Number.isNaN("hello")); // false - doesn't coerce!

// Solution 2: Use Object.is()
console.log(Object.is(result, NaN)); // true

// Solution 3: Self-comparison check
function isActuallyNaN(value) {
  return value !== value; // Only NaN fails this
}

// Comparison of methods
const value = NaN;
console.log(isNaN(value));        // true
console.log(Number.isNaN(value)); // true

const str = "hello";
console.log(isNaN(str));          // true ❌ (coerces to NaN)
console.log(Number.isNaN(str));   // false ✅ (no coercion)

// Filter out NaN from array
const numbers = [1, 2, NaN, 4, NaN, 6];
const clean = numbers.filter(n => !Number.isNaN(n));
console.log(clean); // [1, 2, 4, 6]

// Or use filter with self-comparison
const clean2 = numbers.filter(n => n === n);
console.log(clean2); // [1, 2, 4, 6]

// Validate numeric input
function parseNumber(input) {
  const num = Number(input);
  if (Number.isNaN(num)) {
    throw new Error('Invalid number');
  }
  return num;
}

// Safe math operations
function safeDivide(a, b) {
  const result = a / b;
  return Number.isNaN(result) ? 0 : result;
}

// Checking for actual numbers
function isValidNumber(value) {
  return typeof value === 'number' && !Number.isNaN(value);
}</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Always use Number.isNaN() not isNaN(). Never compare with ===.
                </p>
              </div>
            </details>
          </div>
        </CollapsibleBugCard>

        <!-- Bug 14: Prototype Pollution -->
        <CollapsibleBugCard
          id="bug-14"
          title="Bug #14: Prototype Pollution 🔴"
          description="Object properties inherited from prototype cause issues"
          badge="Advanced"
          border-color="yellow"
        >
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>hasOwnProperty needed to check real properties</li>
                <li>for...in loops include unexpected properties</li>
                <li>__proto__ manipulation affects all objects</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// ❌ for...in includes inherited properties
const obj = { name: 'John' };
Object.prototype.age = 30; // DON'T DO THIS!

for (let key in obj) {
  console.log(key); // 'name', 'age' - age is from prototype!
}

// ❌ in operator checks prototype chain
console.log('toString' in obj); // true - from Object.prototype

// ❌ Prototype pollution vulnerability
function merge(target, source) {
  for (let key in source) {
    target[key] = source[key]; // Dangerous!
  }
  return target;
}

const malicious = JSON.parse('{"__proto__": {"isAdmin": true}}');
merge({}, malicious);
console.log({}.isAdmin); // true - All objects polluted!</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  Objects inherit from Object.prototype. Use Object.create(null) for clean objects.
                  Use Object.keys(), Object.entries() instead of for...in.
                  Use Map for key-value storage to avoid prototype issues.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution 1: Use Object.keys() instead of for...in
const obj = { name: 'John' };
Object.keys(obj).forEach(key => {
  console.log(key); // Only 'name' - no inherited properties
});

// Solution 2: Check hasOwnProperty
for (let key in obj) {
  if (obj.hasOwnProperty(key)) {
    console.log(key); // Only own properties
  }
}

// Better: Use Object.hasOwn (ES2022)
for (let key in obj) {
  if (Object.hasOwn(obj, key)) {
    console.log(key);
  }
}

// Solution 3: Create null-prototype objects
const cleanObj = Object.create(null);
cleanObj.name = 'John';
console.log('toString' in cleanObj); // false - no prototype!

// Solution 4: Use Map instead
const map = new Map();
map.set('name', 'John');
map.set('toString', 'custom'); // No conflict with methods
console.log(map.get('name')); // 'John'

// Solution 5: Safe merge function
function safeMerge(target, source) {
  const blocked = ['__proto__', 'constructor', 'prototype'];

  for (let key in source) {
    if (Object.hasOwn(source, key) && !blocked.includes(key)) {
      target[key] = source[key];
    }
  }
  return target;
}

// Or use Object.assign (safer)
const merged = Object.assign({}, obj1, obj2);

// Or spread operator
const merged2 = { ...obj1, ...obj2 };

// Preventing prototype pollution
function isValidKey(key) {
  return key !== '__proto__' &&
         key !== 'constructor' &&
         key !== 'prototype';
}

// When to use each
const config = {};              // ❌ Has prototype
const config = Object.create(null); // ✅ No prototype
const config = new Map();       // ✅ Best for dynamic keys</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Use Object.keys() or Map. Never modify Object.prototype. Validate keys in merges.
                </p>
              </div>
            </details>
          </div>
        </CollapsibleBugCard>

        <!-- Bug 15: Event Listener Memory Leaks -->
        <CollapsibleBugCard
          id="bug-15"
          title="Bug #15: Event Listener Memory Leaks 🔴"
          description="Event listeners not removed cause memory leaks"
          badge="Important"
          border-color="yellow"
        >
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Memory usage grows over time</li>
                <li>Multiple event handlers fire for same event</li>
                <li>Performance degrades with prolonged use</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// ❌ Adding listeners without cleanup
function setupComponent() {
  const button = document.getElementById('myButton');
  button.addEventListener('click', () => {
    console.log('Clicked!');
  });
  // Never removed - memory leak!
}

// Called multiple times = multiple listeners
setupComponent();
setupComponent();
setupComponent();

// ❌ Anonymous function can't be removed
element.addEventListener('click', () => {
  doSomething();
});
// Can't remove it later!

// ❌ Not removing in SPA navigation
class Component {
  constructor() {
    window.addEventListener('resize', this.handleResize);
  }
  // No cleanup when component unmounts!
  handleResize() {
    console.log('Resized');
  }
}</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  Always remove event listeners when done. Store function references to remove later.
                  Use AbortController for easy cleanup. In frameworks (React/Vue), clean up in unmount lifecycle.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution 1: Store reference and remove
function setupComponent() {
  const button = document.getElementById('myButton');

  const handleClick = () => {
    console.log('Clicked!');
  };

  button.addEventListener('click', handleClick);

  // Return cleanup function
  return () => {
    button.removeEventListener('click', handleClick);
  };
}

const cleanup = setupComponent();
// Later...
cleanup();

// Solution 2: Use AbortController (modern)
const controller = new AbortController();
const { signal } = controller;

button.addEventListener('click', handleClick, { signal });
window.addEventListener('resize', handleResize, { signal });
document.addEventListener('scroll', handleScroll, { signal });

// Remove all at once!
controller.abort();

// Solution 3: Class with cleanup
class Component {
  constructor() {
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  handleResize() {
    console.log('Resized');
  }

  destroy() {
    window.removeEventListener('resize', this.handleResize);
  }
}

const comp = new Component();
// Later...
comp.destroy();

// Solution 4: React cleanup pattern
import { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    const handleClick = () => console.log('Clicked');

    button.addEventListener('click', handleClick);

    // Cleanup on unmount
    return () => {
      button.removeEventListener('click', handleClick);
    };
  }, []);
}

// Solution 5: Vue cleanup pattern
import { onMounted, onUnmounted } from 'vue';

export default {
  setup() {
    const handleClick = () => console.log('Clicked');

    onMounted(() => {
      button.addEventListener('click', handleClick);
    });

    onUnmounted(() => {
      button.removeEventListener('click', handleClick);
    });
  }
}

// Solution 6: Once option for one-time events
button.addEventListener('click', handleClick, { once: true });
// Automatically removed after first trigger

// Best practices
const listeners = new Map();

function addListener(element, event, handler) {
  element.addEventListener(event, handler);
  listeners.set(handler, { element, event });
}

function removeListener(handler) {
  const { element, event } = listeners.get(handler);
  element.removeEventListener(event, handler);
  listeners.delete(handler);
}

function removeAll() {
  listeners.forEach(({ element, event }, handler) => {
    element.removeEventListener(event, handler);
  });
  listeners.clear();
}</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Always clean up event listeners. Use AbortController or return cleanup functions.
                </p>
              </div>
            </details>
          </div>
        </CollapsibleBugCard>

      </div>

      <!-- Navigation -->
      <div class="mt-8 text-center">
        <router-link
          to="/"
          class="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition"
        >
          ← Back to Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CollapsibleBugCard from '@/components/CollapsibleBugCard.vue';

const scrollToBug = (bugNumber: number, event: Event) => {
  event.preventDefault();
  const element = document.getElementById(`bug-${bugNumber}`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Open the details element after scrolling
    setTimeout(() => {
      if (element instanceof HTMLDetailsElement && !element.open) {
        element.open = true;
      }
    }, 500);
  }
};

const quickFixes = [
  { problem: 'Closure variable capture', solution: 'Use let/const or IIFE' },
  { problem: 'Lost this context', solution: 'Use arrow functions or .bind()' },
  { problem: 'Promise chain breaking', solution: 'Always add .catch() or try/catch' },
  { problem: 'Unexpected object mutation', solution: 'Use spread or Object.assign()' },
  { problem: 'Type coercion gotchas', solution: 'Use === instead of ==' },
  { problem: 'Temporal dead zone', solution: 'Declare before use with let/const' },
  { problem: 'Event loop misunderstanding', solution: 'Understand async execution order' },
  { problem: 'Destructuring pitfalls', solution: 'Use ?? for null/undefined defaults' },
  { problem: 'Array mutation bugs', solution: 'Use non-mutating methods like map/filter' },
  { problem: 'Falsy value confusion', solution: 'Use ?? for null/undefined checks' },
  { problem: 'Floating point precision', solution: 'Round or use decimal libraries' },
  { problem: 'String/number comparison', solution: 'Convert types explicitly with Number()' },
  { problem: 'NaN comparison fails', solution: 'Use Number.isNaN() not ===' },
  { problem: 'Prototype pollution', solution: 'Use Object.create(null) or Map' },
  { problem: 'Event listener leaks', solution: 'Always removeEventListener on cleanup' }
];
</script>
