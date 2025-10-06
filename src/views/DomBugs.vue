<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-gray-900 mb-4">
          DOM Manipulation Gotchas
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          12 critical DOM bugs and pitfalls you'll encounter in vanilla JavaScript interviews.
          Master these before relying on frameworks - they're the foundation of web development.
        </p>
      </div>

      <!-- Bug Cards -->
      <div class="space-y-8">
        <!-- Bug 1: NodeList vs Array -->
        <div class="bg-white rounded-lg shadow-lg p-8 border-l-4 border-purple-500">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                Bug #1: NodeList/HTMLCollection Isn't an Array 🔴
              </h2>
              <p class="text-gray-600">Array methods don't work on DOM collections</p>
            </div>
            <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
              Classic
            </span>
          </div>

          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>TypeError: elements.map is not a function</li>
                <li>forEach works but map/filter/reduce don't</li>
                <li>Spread operator needed for array methods</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// ❌ querySelectorAll returns NodeList, not Array
const buttons = document.querySelectorAll('button');

// This works
buttons.forEach(btn => console.log(btn));

// These fail!
const texts = buttons.map(btn => btn.textContent);
// TypeError: buttons.map is not a function

const filtered = buttons.filter(btn => btn.disabled);
// TypeError: buttons.filter is not a function

// ❌ getElementsByClassName returns HTMLCollection
const divs = document.getElementsByClassName('box');
divs.forEach(div => console.log(div));
// TypeError: divs.forEach is not a function</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  NodeList and HTMLCollection are array-like but not real arrays. Convert them using
                  Array.from() or spread operator [...] to use array methods.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution 1: Convert to array with Array.from()
const buttons = Array.from(document.querySelectorAll('button'));
const texts = buttons.map(btn => btn.textContent);

// Solution 2: Spread operator
const divs = [...document.getElementsByClassName('box')];
const filtered = divs.filter(div => div.classList.contains('active'));

// Solution 3: Use forEach (available on NodeList)
const items = document.querySelectorAll('.item');
items.forEach(item => {
  // Works on NodeList
});

// Know the differences:
// querySelectorAll → NodeList (static, has forEach)
// getElementsByClassName → HTMLCollection (live, no forEach)
// children property → HTMLCollection (live)
// childNodes → NodeList (live)</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Convert NodeList/HTMLCollection to Array for full array methods. Know the difference between live and static collections.
                </p>
              </div>
            </details>
          </div>
        </div>

        <!-- Bug 2: Event Delegation -->
        <div class="bg-white rounded-lg shadow-lg p-8 border-l-4 border-indigo-500">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                Bug #2: Events on Dynamically Added Elements 🔴
              </h2>
              <p class="text-gray-600">Event listeners don't work on elements added after page load</p>
            </div>
            <span class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
              Common
            </span>
          </div>

          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Click handlers don't fire on new elements</li>
                <li>Events work on initial elements only</li>
                <li>Need to re-attach listeners after DOM updates</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// ❌ Listeners only attached to initial buttons
document.querySelectorAll('.delete-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    console.log('Delete clicked');
  });
});

// Later, add new button
const newBtn = document.createElement('button');
newBtn.className = 'delete-btn';
newBtn.textContent = 'Delete';
document.body.appendChild(newBtn);

// Click on newBtn does nothing! Listener not attached</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  Use event delegation: attach listener to parent element that exists on page load,
                  then check event.target to see if it matches your selector.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution: Event delegation
document.body.addEventListener('click', (e) => {
  // Check if clicked element matches selector
  if (e.target.matches('.delete-btn')) {
    console.log('Delete clicked');
    // Or use closest for nested elements
  }
});

// Works for dynamically added elements!
const newBtn = document.createElement('button');
newBtn.className = 'delete-btn';
document.body.appendChild(newBtn);
// Click works immediately

// For complex selectors, use closest()
document.body.addEventListener('click', (e) => {
  const deleteBtn = e.target.closest('.delete-btn');
  if (deleteBtn) {
    console.log('Delete button or its child clicked');
  }
});

// jQuery-style helper function
function delegate(parent, selector, event, handler) {
  parent.addEventListener(event, (e) => {
    if (e.target.matches(selector)) {
      handler.call(e.target, e);
    }
  });
}

// Usage
delegate(document.body, '.delete-btn', 'click', function(e) {
  console.log('Clicked:', this);
});</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Use event delegation for dynamic content. Attach to parent, check event.target.
                </p>
              </div>
            </details>
          </div>
        </div>

        <!-- Bug 3: Live vs Static Collections -->
        <div class="bg-white rounded-lg shadow-lg p-8 border-l-4 border-blue-500">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                Bug #3: Live Collection Infinite Loop 🔴
              </h2>
              <p class="text-gray-600">Loop never ends because collection updates while iterating</p>
            </div>
            <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              Tricky
            </span>
          </div>

          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Browser freezes or becomes unresponsive</li>
                <li>Loop iterates forever</li>
                <li>getElementsByClassName causing unexpected behavior</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// ❌ Live HTMLCollection updates during loop!
const items = document.getElementsByClassName('item');

for (let i = 0; i &lt; items.length; i++) {
  const newItem = document.createElement('div');
  newItem.className = 'item';
  document.body.appendChild(newItem);
  // items.length keeps growing! Infinite loop!
}

// ❌ Removing items in loop
const buttons = document.getElementsByTagName('button');
for (let i = 0; i &lt; buttons.length; i++) {
  buttons[i].remove(); // Collection shrinks, skips elements!
}</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  HTMLCollection is LIVE - it updates when DOM changes. Convert to array or use
                  querySelectorAll (static) instead. When removing, iterate backwards.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution 1: Convert to array (snapshot)
const items = [...document.getElementsByClassName('item')];
for (let i = 0; i &lt; items.length; i++) {
  const newItem = document.createElement('div');
  newItem.className = 'item';
  document.body.appendChild(newItem);
  // Loop runs exactly items.length times
}

// Solution 2: Use querySelectorAll (static)
const buttons = document.querySelectorAll('button');
buttons.forEach(btn => btn.remove()); // Works fine

// Solution 3: Iterate backwards when removing
const divs = document.getElementsByTagName('div');
for (let i = divs.length - 1; i >= 0; i--) {
  divs[i].remove(); // Safe - no skipping
}

// Know which are live vs static:
// LIVE (updates automatically):
// - getElementsByClassName
// - getElementsByTagName
// - element.children
// - element.childNodes (if it changes)

// STATIC (snapshot):
// - querySelectorAll
// - Array.from(liveCollection)</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Live collections update during iteration. Convert to array or use static querySelectorAll.
                </p>
              </div>
            </details>
          </div>
        </div>

        <!-- Bug 4: innerHTML Security -->
        <div class="bg-white rounded-lg shadow-lg p-8 border-l-4 border-red-500">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                Bug #4: XSS with innerHTML 🔴
              </h2>
              <p class="text-gray-600">User input injected as HTML creates security vulnerability</p>
            </div>
            <span class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
              Critical
            </span>
          </div>

          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Scripts execute from user input</li>
                <li>XSS (Cross-Site Scripting) vulnerability</li>
                <li>Event handlers fire from injected HTML</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// ❌ DANGEROUS! Never use innerHTML with user input
const userInput = getUserInput(); // Could be malicious

// XSS vulnerability!
element.innerHTML = `&lt;div&gt;${userInput}&lt;/div&gt;`;

// If user enters: &lt;img src=x onerror="alert('XSS')"&gt;
// Script executes!

// ❌ Also dangerous
element.insertAdjacentHTML('beforeend', userInput);
element.outerHTML = userInput;</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  Use textContent instead of innerHTML for user input. It treats everything as text,
                  not HTML. Or properly sanitize with DOMPurify library.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution 1: Use textContent (treats as text)
const userInput = getUserInput();
element.textContent = userInput; // Safe - no HTML parsing

// Solution 2: Create elements programmatically
const div = document.createElement('div');
div.textContent = userInput; // Safe
element.appendChild(div);

// Solution 3: Sanitize with DOMPurify
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);

// Solution 4: Escape HTML manually
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

element.innerHTML = `&lt;div&gt;${escapeHtml(userInput)}&lt;/div&gt;`;

// Safe alternatives:
// textContent - for plain text
// setAttribute - for attributes
// createElement + textContent - for structured content
// DOMPurify.sanitize - when you need HTML</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> NEVER use innerHTML with user input. Use textContent or sanitize properly.
                </p>
              </div>
            </details>
          </div>
        </div>

        <!-- Bug 5: Event Bubbling/Capturing -->
        <div class="bg-white rounded-lg shadow-lg p-8 border-l-4 border-green-500">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                Bug #5: Event Propagation Confusion 🔴
              </h2>
              <p class="text-gray-600">Events fire multiple times or in wrong order</p>
            </div>
            <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
              Common
            </span>
          </div>

          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Click handler fires multiple times</li>
                <li>Parent and child handlers both execute</li>
                <li>Event.target vs event.currentTarget confusion</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// ❌ Both handlers fire when clicking button
&lt;div id="parent"&gt;
  &lt;button id="child"&gt;Click&lt;/button&gt;
&lt;/div&gt;

parent.addEventListener('click', () => {
  console.log('Parent clicked');
});

child.addEventListener('click', () => {
  console.log('Child clicked');
});

// Click button logs:
// "Child clicked"
// "Parent clicked" (bubbles up!)

// ❌ Wrong target
parent.addEventListener('click', (e) => {
  console.log(e.target); // The actual clicked element (button)
  console.log(e.currentTarget); // The element with listener (parent)
});</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  Events bubble up by default. Use stopPropagation() to prevent bubbling,
                  or check event.target to handle only specific elements.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution 1: Stop propagation
child.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevents bubbling to parent
  console.log('Only child logs');
});

// Solution 2: Check target
parent.addEventListener('click', (e) => {
  if (e.target === parent) {
    // Only if parent itself clicked, not children
    console.log('Parent directly clicked');
  }
});

// Solution 3: Use event.currentTarget
parent.addEventListener('click', (e) => {
  console.log(e.currentTarget); // Always parent
  console.log(e.target); // Actual clicked element
});

// Understanding event flow:
// 1. Capture phase (top → target)
// 2. Target phase
// 3. Bubble phase (target → top)

// Capture phase listener
parent.addEventListener('click', () => {
  console.log('Runs before child');
}, { capture: true }); // or just 'true'

// Modern: use once option
button.addEventListener('click', handler, { once: true });</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Events bubble by default. Use stopPropagation() or check event.target/currentTarget.
                </p>
              </div>
            </details>
          </div>
        </div>

        <!-- Bug 6: classList Gotchas -->
        <div class="bg-white rounded-lg shadow-lg p-8 border-l-4 border-yellow-500">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                Bug #6: className vs classList 🔴
              </h2>
              <p class="text-gray-600">String replacement loses existing classes</p>
            </div>
            <span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
              Common
            </span>
          </div>

          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Classes disappear unexpectedly</li>
                <li>Styles break when adding/removing classes</li>
                <li>Multiple classes not handled correctly</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// ❌ className overwrites all classes
&lt;div class="btn btn-primary active"&gt;Button&lt;/div&gt;

const btn = document.querySelector('.btn');

// This removes ALL classes!
btn.className = 'btn-large';
// Now only has 'btn-large', lost 'btn', 'btn-primary', 'active'

// ❌ String manipulation is fragile
btn.className += ' new-class'; // Extra space can cause issues
btn.className = btn.className.replace('active', ''); // Leaves space</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  Always use classList methods (add, remove, toggle, contains) instead of className.
                  They handle multiple classes safely.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution: Use classList
const btn = document.querySelector('.btn');

// Add class
btn.classList.add('btn-large');
// Now has: btn btn-primary active btn-large

// Remove class
btn.classList.remove('active');
// Now has: btn btn-primary btn-large

// Toggle class
btn.classList.toggle('hidden'); // Add if missing, remove if present

// Check if has class
if (btn.classList.contains('btn-primary')) {
  // Do something
}

// Add multiple classes
btn.classList.add('class1', 'class2', 'class3');

// Remove multiple
btn.classList.remove('class1', 'class2');

// Replace class
btn.classList.replace('btn-primary', 'btn-secondary');

// Only use className when replacing ALL classes intentionally
btn.className = 'completely-new-class-list';</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Use classList methods, not className string manipulation.
                </p>
              </div>
            </details>
          </div>
        </div>

        <!-- Bug 7: Reflow/Repaint Performance -->
        <div class="bg-white rounded-lg shadow-lg p-8 border-l-4 border-orange-500">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                Bug #7: Layout Thrashing 🔴
              </h2>
              <p class="text-gray-600">Reading layout causes forced reflow on every iteration</p>
            </div>
            <span class="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
              Performance
            </span>
          </div>

          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Extremely slow DOM updates</li>
                <li>Page freezes during manipulation</li>
                <li>Forced synchronous layout warnings</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// ❌ Reading + writing in loop causes layout thrashing
const boxes = document.querySelectorAll('.box');

boxes.forEach(box => {
  // Reading layout property
  const height = box.offsetHeight;

  // Writing causes reflow
  box.style.width = height + 'px';

  // Read again - forces ANOTHER reflow!
  const width = box.offsetWidth;

  // Write again - ANOTHER reflow!
  box.style.height = width + 'px';

  // N boxes = N*4 reflows! Extremely slow!
});</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  Batch reads together, then batch writes. Don't interleave read/write operations.
                  Reading layout properties (offsetHeight, etc.) triggers reflow if DOM was modified.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution: Batch reads, then batch writes
const boxes = document.querySelectorAll('.box');

// Phase 1: Read all values
const dimensions = Array.from(boxes).map(box => ({
  element: box,
  height: box.offsetHeight,
  width: box.offsetWidth
}));

// Phase 2: Write all values
dimensions.forEach(({ element, height, width }) => {
  element.style.width = height + 'px';
  element.style.height = width + 'px';
});

// Now only 2 reflows total instead of N*4!

// Use requestAnimationFrame for animations
function updateLayout() {
  // Batch DOM writes here
  element.style.transform = `translateX(${x}px)`;

  requestAnimationFrame(updateLayout);
}

// Or use FastDOM library
fastdom.measure(() => {
  const height = element.offsetHeight;

  fastdom.mutate(() => {
    element.style.width = height + 'px';
  });
});</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Batch DOM reads together, then writes. Don't interleave - causes layout thrashing.
                </p>
              </div>
            </details>
          </div>
        </div>

        <!-- Bug 8: DocumentFragment -->
        <div class="bg-white rounded-lg shadow-lg p-8 border-l-4 border-pink-500">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                Bug #8: Multiple Reflows from Sequential Appends 🔴
              </h2>
              <p class="text-gray-600">Appending elements one-by-one causes multiple reflows</p>
            </div>
            <span class="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-semibold">
              Performance
            </span>
          </div>

          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Slow rendering with many elements</li>
                <li>Visible flickering during updates</li>
                <li>Multiple reflows for single operation</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// ❌ Each append causes reflow
const list = document.querySelector('#list');

for (let i = 0; i &lt; 1000; i++) {
  const item = document.createElement('li');
  item.textContent = `Item ${i}`;
  list.appendChild(item); // Reflow on EACH append! 1000 reflows!
}

// ❌ Building HTML string is fragile
let html = '';
for (let i = 0; i &lt; 1000; i++) {
  html += `&lt;li&gt;Item ${i}&lt;/li&gt;`; // String concatenation slow
}
list.innerHTML = html; // XSS risk if data includes user input</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  Use DocumentFragment to build DOM structure in memory, then append once.
                  Only one reflow happens when fragment is inserted into live DOM.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution 1: DocumentFragment
const list = document.querySelector('#list');
const fragment = document.createDocumentFragment();

for (let i = 0; i &lt; 1000; i++) {
  const item = document.createElement('li');
  item.textContent = `Item ${i}`;
  fragment.appendChild(item); // Append to fragment (no reflow)
}

list.appendChild(fragment); // Single reflow!

// Solution 2: Build array and join
const items = [];
for (let i = 0; i &lt; 1000; i++) {
  items.push(`&lt;li&gt;Item ${i}&lt;/li&gt;`);
}
list.innerHTML = items.join(''); // Faster than concatenation

// Solution 3: Clone and replace
const newList = list.cloneNode(false); // Clone without children
for (let i = 0; i &lt; 1000; i++) {
  const item = document.createElement('li');
  item.textContent = `Item ${i}`;
  newList.appendChild(item);
}
list.parentNode.replaceChild(newList, list);</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Use DocumentFragment for bulk DOM operations. Single append = single reflow.
                </p>
              </div>
            </details>
          </div>
        </div>

      </div>

      <!-- Quick Reference -->
      <div class="mt-12 bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">DOM Quick Reference</h2>

        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Problem</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Solution</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr>
                <td class="px-6 py-4 text-sm text-gray-900">NodeList isn't an Array</td>
                <td class="px-6 py-4 text-sm font-mono text-gray-600">Array.from() or [...nodeList]</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-900">Events on dynamic elements</td>
                <td class="px-6 py-4 text-sm font-mono text-gray-600">Event delegation on parent</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-900">Live collection loop issues</td>
                <td class="px-6 py-4 text-sm font-mono text-gray-600">Convert to array or querySelectorAll</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-900">XSS with user input</td>
                <td class="px-6 py-4 text-sm font-mono text-gray-600">Use textContent, not innerHTML</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-900">Event bubbling problems</td>
                <td class="px-6 py-4 text-sm font-mono text-gray-600">e.stopPropagation() or check target</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-900">Class manipulation bugs</td>
                <td class="px-6 py-4 text-sm font-mono text-gray-600">Use classList methods</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-900">Layout thrashing</td>
                <td class="px-6 py-4 text-sm font-mono text-gray-600">Batch reads, then batch writes</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-900">Multiple reflows</td>
                <td class="px-6 py-4 text-sm font-mono text-gray-600">DocumentFragment or build offline</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Navigation -->
      <div class="mt-8 text-center">
        <router-link
          to="/"
          class="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
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
