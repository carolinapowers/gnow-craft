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

      <!-- Bug Cards -->
      <div class="space-y-8">
        <!-- Bug 1: Scope and Closure -->
        <div class="bg-white rounded-lg shadow-lg p-8 border-l-4 border-yellow-500">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                Bug #1: Closure Variable Capture 🔴
              </h2>
              <p class="text-gray-600">Loop variable captured incorrectly in closure</p>
            </div>
            <span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
              Classic
            </span>
          </div>

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
        </div>

        <!-- Bug 2: This Binding -->
        <div class="bg-white rounded-lg shadow-lg p-8 border-l-4 border-orange-500">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                Bug #2: Lost 'this' Context 🔴
              </h2>
              <p class="text-gray-600">Method loses 'this' binding when passed as callback</p>
            </div>
            <span class="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
              Classic
            </span>
          </div>

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
        </div>

        <!-- Bug 3: Async/Await Error Handling -->
        <div class="bg-white rounded-lg shadow-lg p-8 border-l-4 border-red-500">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                Bug #3: Promise Chain Breaking 🔴
              </h2>
              <p class="text-gray-600">Error in promise chain stops execution</p>
            </div>
            <span class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
              Common
            </span>
          </div>

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
        </div>

        <!-- Bug 4: Array/Object Reference -->
        <div class="bg-white rounded-lg shadow-lg p-8 border-l-4 border-purple-500">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                Bug #4: Unexpected Object Mutation 🔴
              </h2>
              <p class="text-gray-600">Object/array reference shared instead of copied</p>
            </div>
            <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
              Common
            </span>
          </div>

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
        </div>

        <!-- Bug 5: == vs === -->
        <div class="bg-white rounded-lg shadow-lg p-8 border-l-4 border-blue-500">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                Bug #5: Type Coercion Gotchas 🔴
              </h2>
              <p class="text-gray-600">Loose equality causes unexpected comparisons</p>
            </div>
            <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              Classic
            </span>
          </div>

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
        </div>

        <!-- Bug 6: Hoisting -->
        <div class="bg-white rounded-lg shadow-lg p-8 border-l-4 border-green-500">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                Bug #6: Temporal Dead Zone 🔴
              </h2>
              <p class="text-gray-600">Accessing let/const before declaration</p>
            </div>
            <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
              Tricky
            </span>
          </div>

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
        </div>

        <!-- More bugs continue... -->
        <!-- I'll add a few more key scenarios -->

        <!-- Bug 7: Event Loop & Timing -->
        <div class="bg-white rounded-lg shadow-lg p-8 border-l-4 border-indigo-500">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                Bug #7: Event Loop Misunderstanding 🔴
              </h2>
              <p class="text-gray-600">Unexpected execution order with setTimeout</p>
            </div>
            <span class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
              Important
            </span>
          </div>

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
        </div>

        <!-- Bug 8: Destructuring Defaults -->
        <div class="bg-white rounded-lg shadow-lg p-8 border-l-4 border-pink-500">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                Bug #8: Destructuring Pitfalls 🔴
              </h2>
              <p class="text-gray-600">Defaults don't work as expected with null/undefined</p>
            </div>
            <span class="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-semibold">
              Subtle
            </span>
          </div>

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
        </div>

      </div>

      <!-- Quick Reference -->
      <div class="mt-12 bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">JavaScript Quick Reference</h2>

        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-semibold text-lg mb-3">Common Pitfalls</h3>
            <ul class="space-y-2 text-sm">
              <li class="flex items-start">
                <span class="text-yellow-500 mr-2">⚠️</span>
                <span><code class="bg-gray-100 px-1">var</code> is function-scoped, use <code class="bg-gray-100 px-1">let/const</code></span>
              </li>
              <li class="flex items-start">
                <span class="text-yellow-500 mr-2">⚠️</span>
                <span>Use <code class="bg-gray-100 px-1">===</code> not <code class="bg-gray-100 px-1">==</code></span>
              </li>
              <li class="flex items-start">
                <span class="text-yellow-500 mr-2">⚠️</span>
                <span>Objects are passed by reference</span>
              </li>
              <li class="flex items-start">
                <span class="text-yellow-500 mr-2">⚠️</span>
                <span>Arrow functions don't have <code class="bg-gray-100 px-1">this</code></span>
              </li>
              <li class="flex items-start">
                <span class="text-yellow-500 mr-2">⚠️</span>
                <span>Promises need <code class="bg-gray-100 px-1">.catch()</code></span>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="font-semibold text-lg mb-3">Best Practices</h3>
            <ul class="space-y-2 text-sm">
              <li class="flex items-start">
                <span class="text-green-500 mr-2">✅</span>
                <span>Always use <code class="bg-gray-100 px-1">const</code> by default</span>
              </li>
              <li class="flex items-start">
                <span class="text-green-500 mr-2">✅</span>
                <span>Handle all promise rejections</span>
              </li>
              <li class="flex items-start">
                <span class="text-green-500 mr-2">✅</span>
                <span>Use <code class="bg-gray-100 px-1">??</code> for null/undefined defaults</span>
              </li>
              <li class="flex items-start">
                <span class="text-green-500 mr-2">✅</span>
                <span>Bind methods or use arrow functions</span>
              </li>
              <li class="flex items-start">
                <span class="text-green-500 mr-2">✅</span>
                <span>Deep clone objects before mutation</span>
              </li>
            </ul>
          </div>
        </div>
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
// No additional logic needed for this view
</script>
