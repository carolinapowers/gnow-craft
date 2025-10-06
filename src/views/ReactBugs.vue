<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-gray-900 mb-4">
          React Interview Debugging Scenarios
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          20 common bugs (React-specific + universal patterns) you'll encounter in technical interviews.
          Each scenario includes buggy code, symptoms, hints, and complete solutions.
        </p>
      </div>

      <!-- Quick Reference -->
      <div class="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Quick Reference: Common Fixes</h2>
        <div class="grid md:grid-cols-2 gap-4">
          <a
            v-for="(fix, index) in quickFixes"
            :key="index"
            :href="`#bug-${index + 1}`"
            @click="scrollToBug(index + 1, $event)"
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

      <!-- Bug Cards -->
      <div class="space-y-8 mt-12">
        <!-- Bug 1: State Updates in Loop -->
        <CollapsibleBugCard
          id="bug-1"
          title="Bug #1: State Updates in Loop 🔴"
          description="Counter doesn't increment correctly when clicked multiple times rapidly"
          badge="Common"
          border-color="red"
        >
          <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Clicking "+3" button only increments by 1</li>
                <li>Multiple state updates don't batch correctly</li>
                <li>Final count is always off by 2</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>function Counter() {
  const [count, setCount] = useState(0);

  const incrementThree = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  return (
    &lt;div&gt;
      &lt;p&gt;Count: {count}&lt;/p&gt;
      &lt;button onClick={incrementThree}&gt;+3&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint #1
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  State updates in React may be batched and asynchronous. When you call <code class="bg-gray-200 px-1 rounded">setCount(count + 1)</code>
                  three times, all three calls use the same <code class="bg-gray-200 px-1 rounded">count</code> value from the current render.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint #2
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  Use the functional form of setState to access the most recent state value:
                  <code class="bg-gray-200 px-1 rounded">setCount(prevCount => prevCount + 1)</code>
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>function Counter() {
  const [count, setCount] = useState(0);

  const incrementThree = () => {
    // Use functional updates to get latest state
    setCount(prevCount => prevCount + 1);
    setCount(prevCount => prevCount + 1);
    setCount(prevCount => prevCount + 1);
  };

  return (
    &lt;div&gt;
      &lt;p&gt;Count: {count}&lt;/p&gt;
      &lt;button onClick={incrementThree}&gt;+3&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Always use functional updates when the new state depends on the previous state.
                </p>
              </div>
            </details>
        </CollapsibleBugCard>

        <!-- Bug 2: Infinite Loop in useEffect -->
        <CollapsibleBugCard
          id="bug-2"
          title="Bug #2: Infinite Loop in useEffect 🔴"
          description="Component re-renders infinitely and crashes the browser"
          badge="Critical"
          border-color="orange"
        >
          <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Browser tab freezes or becomes unresponsive</li>
                <li>Console shows thousands of renders</li>
                <li>"Maximum update depth exceeded" error</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => setUser(data));
  }); // ❌ Missing dependency array!

  return &lt;div&gt;{user?.name}&lt;/div&gt;;
}</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  Without a dependency array, useEffect runs after every render. Since setUser triggers a re-render,
                  this creates an infinite loop: render → effect → setUser → render → effect → ...
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]); // ✅ Only re-run when userId changes

  return &lt;div&gt;{user?.name}&lt;/div&gt;;
}</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Always include a dependency array in useEffect. Use empty array [] for mount-only effects,
                  or include dependencies to run when they change.
                </p>
              </div>
            </details>
        </CollapsibleBugCard>

        <!-- Bug 3: Stale Closure -->
        <CollapsibleBugCard
          id="bug-3"
          title="Bug #3: Stale Closure 🔴"
          description="Timer always shows 0 instead of incrementing count"
          badge="Tricky"
          border-color="purple"
        >
          <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Alert/console always shows initial value (0)</li>
                <li>Event handlers "remember" old state</li>
                <li>Timeout callbacks use stale values</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(\`Count is: \${count}\`); // Always logs 0!
      setCount(count + 1); // Always sets to 1!
    }, 1000);

    return () => clearInterval(interval);
  }, []); // Empty deps creates closure over initial count

  return &lt;div&gt;Count: {count}&lt;/div&gt;;
}</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  The interval callback closes over the initial <code class="bg-gray-200 px-1 rounded">count</code> value (0).
                  Even though count updates in the component, the callback always sees the old value.
                  Use functional setState or include count in dependencies.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution 1: Functional setState
function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prevCount => {
        console.log(\`Count is: \${prevCount}\`);
        return prevCount + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []); // Safe to use empty deps now

  return &lt;div&gt;Count: {count}&lt;/div&gt;;
}

// Solution 2: useRef for latest value
function Timer() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(\`Count is: \${countRef.current}\`);
      setCount(c => c + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return &lt;div&gt;Count: {count}&lt;/div&gt;;
}</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Use functional setState in closures, or use useRef to access latest values.
                </p>
              </div>
            </details>
        </CollapsibleBugCard>

        <!-- Bug 4: Incorrect List Keys -->
        <CollapsibleBugCard
          id="bug-4"
          title="Bug #4: Incorrect List Keys 🔴"
          description="List items lose state when reordered or items are deleted"
          badge="Common"
          border-color="blue"
        >
          <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Input values swap when list is reordered</li>
                <li>Component state gets confused</li>
                <li>Console warning: "Each child should have a unique key"</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>function TodoList() {
  const [todos, setTodos] = useState([
    { text: 'Learn React' },
    { text: 'Build app' }
  ]);

  return (
    &lt;ul&gt;
      {todos.map((todo, index) => (
        &lt;li key={index}&gt; {/* ❌ Using index as key */}
          &lt;input defaultValue={todo.text} /&gt;
        &lt;/li&gt;
      ))}
    &lt;/ul&gt;
  );
}</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  Using array index as key causes issues when the list order changes. React uses keys to track component identity.
                  When you reorder items, React thinks the components in those positions are the same, just with different props.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>function TodoList() {
  const [todos, setTodos] = useState([
    { id: '1', text: 'Learn React' },
    { id: '2', text: 'Build app' }
  ]);

  return (
    &lt;ul&gt;
      {todos.map(todo => (
        &lt;li key={todo.id}&gt; {/* ✅ Unique, stable ID */}
          &lt;input defaultValue={todo.text} /&gt;
        &lt;/li&gt;
      ))}
    &lt;/ul&gt;
  );
}

// If you don't have IDs, generate them:
const [todos, setTodos] = useState([
  { id: crypto.randomUUID(), text: 'Learn React' },
  { id: crypto.randomUUID(), text: 'Build app' }
]);</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Use stable, unique IDs as keys. Never use index for dynamic lists.
                </p>
              </div>
            </details>
        </CollapsibleBugCard>

        <!-- Bug 5: Mutating State Directly -->
        <CollapsibleBugCard
          id="bug-5"
          title="Bug #5: Mutating State Directly 🔴"
          description="Adding items to array doesn't trigger re-render"
          badge="Common"
          border-color="pink"
        >
          <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>UI doesn't update even though data changed</li>
                <li>Component doesn't re-render</li>
                <li>State looks correct in debugger but UI is stale</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>function ShoppingCart() {
  const [items, setItems] = useState([]);

  const addItem = (item) => {
    items.push(item); // ❌ Mutating state directly!
    setItems(items);  // React doesn't detect change
  };

  return (
    &lt;div&gt;
      &lt;p&gt;Items: {items.length}&lt;/p&gt;
      &lt;button onClick={() => addItem('Apple')}&gt;
        Add Item
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  React uses shallow comparison (===) to detect changes. When you mutate the array and pass the same reference,
                  React thinks nothing changed. Always create a new array/object when updating state.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>function ShoppingCart() {
  const [items, setItems] = useState([]);

  const addItem = (item) => {
    // Create new array with spread operator
    setItems([...items, item]);

    // Or use concat (also returns new array)
    setItems(items.concat(item));
  };

  // For objects, spread also works:
  const updateUser = () => {
    setUser({ ...user, name: 'New Name' });
  };

  return (
    &lt;div&gt;
      &lt;p&gt;Items: {items.length}&lt;/p&gt;
      &lt;button onClick={() => addItem('Apple')}&gt;
        Add Item
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Never mutate state directly. Always create new arrays/objects.
                  Use spread operator, concat, filter, map, or slice.
                </p>
              </div>
            </details>
        </CollapsibleBugCard>

        <!-- Bug 6: Memory Leak from Missing Cleanup -->
        <CollapsibleBugCard
          id="bug-6"
          title="Bug #6: Memory Leak from Missing Cleanup 🔴"
          description="Warning: Can't perform state update on unmounted component"
          badge="Important"
          border-color="green"
        >
          <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Console warning about setState on unmounted component</li>
                <li>Memory leaks from subscriptions/timers</li>
                <li>Event listeners pile up</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>function DataFetcher({ url }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => setData(data)); // ❌ No cleanup!

    // If component unmounts before fetch completes,
    // setData will be called on unmounted component
  }, [url]);

  return &lt;div&gt;{data?.title}&lt;/div&gt;;
}</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  Use cleanup functions for async operations, subscriptions, timers, and event listeners.
                  Return a function from useEffect that cleans up side effects.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution 1: Ignore flag
function DataFetcher({ url }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let ignore = false;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!ignore) setData(data);
      });

    return () => {
      ignore = true; // Cleanup
    };
  }, [url]);

  return &lt;div&gt;{data?.title}&lt;/div&gt;;
}

// Solution 2: AbortController
function DataFetcher({ url }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      });

    return () => controller.abort();
  }, [url]);

  return &lt;div&gt;{data?.title}&lt;/div&gt;;
}</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Always clean up side effects in useEffect. Return cleanup function for subscriptions,
                  timers, and async operations.
                </p>
              </div>
            </details>
        </CollapsibleBugCard>

        <!-- Bug 7: Incorrect Event Handler Syntax -->
        <CollapsibleBugCard
          id="bug-7"
          title="Bug #7: Incorrect Event Handler Syntax 🔴"
          description="Function executes on render instead of on click"
          badge="Common"
          border-color="red"
        >
          <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Function runs on every render</li>
                <li>Infinite loops if function updates state</li>
                <li>Action happens without user interaction</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>function AlertButton() {
  const handleClick = (message) => {
    alert(message);
  };

  return (
    &lt;div&gt;
      {/* ❌ Calls function immediately! */}
      &lt;button onClick={handleClick('Clicked!')}&gt;
        Click Me
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  onClick expects a function, not the result of calling a function. Use arrow function or bind.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>function AlertButton() {
  const handleClick = (message) => {
    alert(message);
  };

  return (
    &lt;div&gt;
      {/* Solution 1: Arrow function */}
      &lt;button onClick={() => handleClick('Clicked!')}&gt;
        Click Me
      &lt;/button&gt;

      {/* Solution 2: No parameters */}
      &lt;button onClick={handleClick}&gt;
        Click Me
      &lt;/button&gt;

      {/* Solution 3: Curry the function */}
      &lt;button onClick={handleClick.bind(null, 'Clicked!')}&gt;
        Click Me
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Pass a function reference to onClick, not a function call.
                  Use arrow functions to pass arguments.
                </p>
              </div>
            </details>
        </CollapsibleBugCard>

        <!-- Bug 8: Object Reference in Dependency Array -->
        <CollapsibleBugCard
          id="bug-8"
          title="Bug #8: Object Reference in Dependency Array 🔴"
          description="useEffect runs on every render even though object looks the same"
          badge="Tricky"
          border-color="yellow"
        >
          <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Effect runs on every render even though data looks the same</li>
                <li>Unnecessary API calls or expensive operations</li>
                <li>Performance degradation</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>function SearchResults(\{ query, filters }) {
  const [results, setResults] = useState([]);

  // ❌ filters is a new object every render!
  useEffect(() => {
    fetchResults(query, filters).then(setResults);
  }, [query, filters]);

  return &lt;ResultsList items={results} /&gt;;
}

// Parent creates new object every render
function App() {
  const [query, setQuery] = useState('');
  return &lt;SearchResults query={query} filters=\{\{ type: 'all' }} /&gt;;
}</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  Objects and arrays are compared by reference, not by value. A new object literal creates a new reference
                  every render. Use useMemo to stabilize object references or depend on primitive values.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution 1: useMemo in parent
function App() {
  const [query, setQuery] = useState('');
  const filters = useMemo(() => (\{ type: 'all' }), []);
  return &lt;SearchResults query={query} filters={filters} /&gt;;
}

// Solution 2: Depend on primitive values
function SearchResults(\{ query, filterType }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const filters = \{ type: filterType };
    fetchResults(query, filters).then(setResults);
  }, [query, filterType]); // Primitives are stable

  return &lt;ResultsList items={results} /&gt;;
}

// Solution 3: Use JSON stringify (careful!)
useEffect(() => {
  fetchResults(query, filters).then(setResults);
}, [query, JSON.stringify(filters)]);</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Objects/arrays in dependency arrays should be memoized or destructured to primitives.
                </p>
              </div>
            </details>
        </CollapsibleBugCard>

        <!-- Bug 9: Performance Issue from Inline Functions -->
        <CollapsibleBugCard
          id="bug-9"
          title="Bug #9: Performance Issue from Inline Functions 🔴"
          description="Child components re-render unnecessarily on every parent render"
          badge="Performance"
          border-color="orange"
        >
          <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Child components re-render even with React.memo</li>
                <li>Slow performance with large lists</li>
                <li>Profiler shows unnecessary renders</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>const ExpensiveChild = React.memo(({ onUpdate }) => {
  console.log('Child rendered');
  return &lt;button onClick={onUpdate}&gt;Update&lt;/button&gt;;
});

function Parent() {
  const [count, setCount] = useState(0);
  const [other, setOther] = useState(0);

  // ❌ New function created every render
  return (
    &lt;div&gt;
      &lt;ExpensiveChild onUpdate={() => setCount(c => c + 1)} /&gt;
      &lt;button onClick={() => setOther(o => o + 1)}&gt;
        Other: {other}
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  Inline arrow functions create a new reference every render, causing memo'd children to re-render.
                  Use useCallback to memoize function references when passing to optimized components.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>const ExpensiveChild = React.memo(({ onUpdate }) => {
  console.log('Child rendered');
  return &lt;button onClick={onUpdate}&gt;Update&lt;/button&gt;;
});

function Parent() {
  const [count, setCount] = useState(0);
  const [other, setOther] = useState(0);

  // ✅ Stable function reference
  const handleUpdate = useCallback(() => {
    setCount(c => c + 1);
  }, []); // No dependencies needed with functional update

  return (
    &lt;div&gt;
      &lt;ExpensiveChild onUpdate={handleUpdate} /&gt;
      &lt;button onClick={() => setOther(o => o + 1)}&gt;
        Other: {other}
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Use useCallback for functions passed to memoized components or effect dependencies.
                </p>
              </div>
            </details>
        </CollapsibleBugCard>

        <!-- Bug 10: Derived State Sync Issues -->
        <CollapsibleBugCard
          id="bug-10"
          title="Bug #10: Derived State Sync Issues 🔴"
          description="fullName doesn't update when props.firstName changes"
          badge="Common"
          border-color="purple"
        >
          <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Component shows stale data when props update</li>
                <li>Need to manually sync state with props</li>
                <li>Data inconsistencies between parent and child</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>function PriceDisplay(\{ basePrice, taxRate }) {
  // ❌ Derived state doesn't update when props change
  const [total, setTotal] = useState(basePrice * (1 + taxRate));

  // This works but is unnecessarily complex
  useEffect(() => {
    setTotal(basePrice * (1 + taxRate));
  }, [basePrice, taxRate]);

  return &lt;div&gt;Total: ${total}&lt;/div&gt;;
}</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  Don't use useState for values that can be calculated from props or other state.
                  Use useMemo for expensive calculations or just calculate directly in render.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution 1: Just calculate it (for cheap operations)
function PriceDisplay(\{ basePrice, taxRate }) {
  const total = basePrice * (1 + taxRate);
  return &lt;div&gt;Total: ${total}&lt;/div&gt;;
}

// Solution 2: useMemo for expensive calculations
function ComplexCalculation(\{ data, filters }) {
  const processedData = useMemo(() => {
    // Expensive operation
    return data
      .filter(filters.filterFn)
      .map(filters.mapFn)
      .sort(filters.sortFn);
  }, [data, filters]);

  return &lt;DataTable data={processedData} /&gt;;
}</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Prefer calculation over state synchronization. Use useMemo only when necessary.
                </p>
              </div>
            </details>
        </CollapsibleBugCard>

        <!-- Bug 11: Custom Hook Memory Leak -->
        <CollapsibleBugCard
          id="bug-11"
          title="Bug #11: Custom Hook Memory Leak 🔴"
          description="WebSocket connections aren't cleaned up when component unmounts"
          badge="Advanced"
          border-color="red"
        >
          <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Event listeners pile up with each component mount</li>
                <li>WebSocket connections stay open</li>
                <li>Performance degrades over time</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    // ❌ No cleanup! Listener stays attached
  }, []);

  return size;
}</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  Custom hooks follow the same rules as components. Always return cleanup functions from useEffect
                  to remove event listeners, cancel subscriptions, or abort pending requests.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);

    // ✅ Return cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return size;
}

// Usage is safe now
function MyComponent() {
  const { width, height } = useWindowSize();
  return &lt;div&gt;{width} x {height}&lt;/div&gt;;
}</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Custom hooks must clean up their side effects just like components.
                </p>
              </div>
            </details>
        </CollapsibleBugCard>

        <!-- Bug 12: Race Condition in Search -->
        <CollapsibleBugCard
          id="bug-12"
          title="Bug #12: Race Condition in Search 🔴"
          description="Search results show wrong data when typing quickly"
          badge="Tricky"
          border-color="yellow"
        >
          <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Typing fast shows wrong results</li>
                <li>Results don't match current search query</li>
                <li>Inconsistent behavior based on network speed</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;

    // ❌ No race condition handling!
    searchAPI(query).then(data => {
      setResults(data); // Might be stale if query changed
    });
  }, [query]);

  return (
    &lt;div&gt;
      &lt;input value={query} onChange={e => setQuery(e.target.value)} /&gt;
      &lt;Results items={results} /&gt;
    &lt;/div&gt;
  );
}</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  When the query changes before the previous request completes, you get a race condition.
                  Use an ignore flag or AbortController to cancel/ignore stale requests.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution 1: Ignore flag
function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;

    let ignore = false;

    searchAPI(query).then(data => {
      if (!ignore) {
        setResults(data);
      }
    });

    return () => {
      ignore = true; // Ignore results from previous query
    };
  }, [query]);

  return &lt;div&gt;...&lt;/div&gt;;
}

// Solution 2: AbortController (better for actual cancellation)
function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;

    const controller = new AbortController();

    fetch(\`/api/search?q=\${query}\`, {
      signal: controller.signal
    })
      .then(res => res.json())
      .then(data => setResults(data))
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      });

    return () => controller.abort();
  }, [query]);

  return &lt;div&gt;...&lt;/div&gt;;
}</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Always handle race conditions in async effects. Ignore or cancel stale requests.
                </p>
              </div>
            </details>
        </CollapsibleBugCard>

        <!-- Bug 13: Controlled/Uncontrolled Component Warning -->
        <CollapsibleBugCard
          id="bug-13"
          title="Bug #13: Controlled/Uncontrolled Component Warning 🔴"
          description="Console warning about switching from controlled to uncontrolled input"
          badge="Common"
          border-color="pink"
        >
          <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Console warning about controlled/uncontrolled</li>
                <li>Input behavior is unpredictable</li>
                <li>Value becomes undefined or null</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>function UserForm(\{ initialData }) {
  const [formData, setFormData] = useState(initialData);

  // ❌ If initialData is undefined, value is undefined
  // Later if formData becomes defined, React warns
  return (
    &lt;input
      value={formData?.name}
      onChange={e => setFormData(\{
        ...formData,
        name: e.target.value
      })}
    /&gt;
  );
}

// Parent might pass undefined initially
&lt;UserForm initialData={user} /&gt; // user might be null</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  A component is controlled when value is defined (even empty string). It's uncontrolled when value is
                  undefined. Never let value switch between undefined and defined. Use empty string as fallback.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution 1: Provide fallback value
function UserForm(\{ initialData }) {
  const [formData, setFormData] = useState(initialData || \{ name: '' });

  return (
    &lt;input
      value={formData.name} // Always defined
      onChange={e => setFormData(\{
        ...formData,
        name: e.target.value
      })}
    /&gt;
  );
}

// Solution 2: Ensure value is never undefined
function UserForm(\{ initialData }) {
  const [name, setName] = useState(initialData?.name ?? '');

  return (
    &lt;input
      value={name} // Always string, never undefined
      onChange={e => setName(e.target.value)}
    /&gt;
  );
}

// Solution 3: Use uncontrolled with defaultValue
function UserForm(\{ initialData }) {
  return (
    &lt;input
      defaultValue={initialData?.name}
      onChange={e => console.log(e.target.value)}
    /&gt;
  );
}</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Always provide a fallback value for controlled inputs. Never use undefined.
                </p>
              </div>
            </details>
        </CollapsibleBugCard>

        <!-- Bug 14: Conditional Rendering Without Keys -->
        <CollapsibleBugCard
          id="bug-14"
          title="Bug #14: Conditional Rendering Without Keys 🔴"
          description="Component state persists when switching between different views"
          badge="Subtle"
          border-color="purple"
        >
          <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Form inputs reset when switching views</li>
                <li>Component state disappears unexpectedly</li>
                <li>Animations restart when they shouldn't</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>function Dashboard(\{ view }) {
  // ❌ Same component type without key
  if (view === 'profile') {
    return &lt;UserForm title="Edit Profile" /&gt;;
  }

  if (view === 'settings') {
    return &lt;UserForm title="Settings" /&gt;;
  }

  return &lt;UserForm title="Account" /&gt;;
}

// React reuses the component, state persists incorrectly</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  React preserves component state when the component type and position in the tree stay the same.
                  Use the key prop to force React to create a new component instance.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>function Dashboard(\{ view }) {
  // ✅ Use key to force new component instance
  if (view === 'profile') {
    return &lt;UserForm key="profile" title="Edit Profile" /&gt;;
  }

  if (view === 'settings') {
    return &lt;UserForm key="settings" title="Settings" /&gt;;
  }

  return &lt;UserForm key="account" title="Account" /&gt;;
}

// Alternative: Use view as key
function Dashboard(\{ view }) {
  const titles = \{
    profile: 'Edit Profile',
    settings: 'Settings',
    account: 'Account'
  };

  return &lt;UserForm key={view} title={titles[view]} /&gt;;
}</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Use key prop to reset component state when rendering same component type conditionally.
                </p>
              </div>
            </details>
        </CollapsibleBugCard>

        <!-- Bug 15: setState on Unmounted Component -->
        <CollapsibleBugCard
          id="bug-15"
          title="Bug #15: setState on Unmounted Component 🔴"
          description="Memory leak warning after navigating away from page"
          badge="Common"
          border-color="orange"
        >
          <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Warning: Can't perform a React state update on unmounted component</li>
                <li>Memory leak warnings in console</li>
                <li>Unpredictable behavior when navigating away</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>function DelayedMessage() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setMessage('Hello!'); // ❌ Might run after unmount
    }, 3000);
  }, []);

  return &lt;div&gt;{message}&lt;/div&gt;;
}</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  Async operations (timeouts, intervals, promises) may complete after component unmounts.
                  Use cleanup functions or mounted flags to prevent state updates on unmounted components.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution 1: Clear timeout on cleanup
function DelayedMessage() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage('Hello!');
    }, 3000);

    return () => clearTimeout(timer); // ✅ Cleanup
  }, []);

  return &lt;div&gt;{message}&lt;/div&gt;;
}

// Solution 2: Use mounted flag
function DelayedMessage() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    setTimeout(() => {
      if (isMounted) {
        setMessage('Hello!');
      }
    }, 3000);

    return () => \{ isMounted = false; };
  }, []);

  return &lt;div&gt;{message}&lt;/div&gt;;
}</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Always clean up async operations to prevent state updates after unmount.
                </p>
              </div>
            </details>
        </CollapsibleBugCard>

        <!-- Bug 16: Context Causing Unnecessary Re-renders -->
        <CollapsibleBugCard
          id="bug-16"
          title="Bug #16: Context Causing Unnecessary Re-renders 🔴"
          description="All context consumers re-render when any value changes"
          badge="Performance"
          border-color="red"
        >
          <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Entire app re-renders when one context value changes</li>
                <li>Performance issues with large component trees</li>
                <li>Components update even when their data didn't change</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>const AppContext = createContext();

function AppProvider(\{ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  // ❌ New object every render causes all consumers to update
  return (
    &lt;AppContext.Provider value=\{\{ user, setUser, theme, setTheme }}&gt;
      {children}
    &lt;/AppContext.Provider&gt;
  );
}</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  Context value is an object created on every render. All consumers re-render when provider renders.
                  Use useMemo to stabilize the context value, or split into multiple contexts.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution 1: Memoize context value
function AppProvider(\{ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  const value = useMemo(
    () => (\{ user, setUser, theme, setTheme }),
    [user, theme]
  );

  return (
    &lt;AppContext.Provider value={value}&gt;
      {children}
    &lt;/AppContext.Provider&gt;
  );
}

// Solution 2: Split contexts (better!)
const UserContext = createContext();
const ThemeContext = createContext();

function AppProvider(\{ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  return (
    &lt;UserContext.Provider value=\{\{ user, setUser }}&gt;
      &lt;ThemeContext.Provider value=\{\{ theme, setTheme }}&gt;
        {children}
      &lt;/ThemeContext.Provider&gt;
    &lt;/UserContext.Provider&gt;
  );
}</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Memoize context values or split into separate contexts to prevent unnecessary re-renders.
                </p>
              </div>
            </details>
        </CollapsibleBugCard>

        <!-- Bug 17: Unhandled Promise Rejection -->
        <CollapsibleBugCard
          id="bug-17"
          title="Bug #17: Unhandled Promise Rejection 🔴"
          description="App crashes silently when API request fails"
          badge="Universal"
          border-color="blue"
        >
          <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Unhandled promise rejection errors in console</li>
                <li>No error message shown to user when API fails</li>
                <li>Component stuck in loading state forever</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>function UserProfile(\{ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      // ❌ No error handling!
      const response = await fetch(\`/api/users/\${userId}\`);
      const data = await response.json();
      setUser(data);
      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  if (loading) return &lt;div&gt;Loading...&lt;/div&gt;;
  return &lt;div&gt;{user?.name}&lt;/div&gt;;
}</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  Every async operation can fail. Always wrap async/await in try/catch blocks.
                  Also check HTTP response status - fetch doesn't reject on 404/500 errors!
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>function UserProfile(\{ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(\`/api/users/\${userId}\`);

        // Check HTTP status
        if (!response.ok) {
          throw new Error(\`HTTP \${response.status}\`);
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return &lt;div&gt;Loading...&lt;/div&gt;;
  if (error) return &lt;div&gt;Error: {error}&lt;/div&gt;;
  return &lt;div&gt;{user?.name}&lt;/div&gt;;
}</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Always handle errors in async operations. Use try/catch and check response.ok for fetch.
                </p>
              </div>
            </details>
        </CollapsibleBugCard>

        <!-- Bug 18: Search Without Debouncing -->
        <CollapsibleBugCard
          id="bug-18"
          title="Bug #18: Search Without Debouncing 🔴"
          description="API called on every keystroke, overwhelming the server"
          badge="Universal"
          border-color="blue"
        >
          <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Too many API requests (one per keystroke)</li>
                <li>Poor performance and high server load</li>
                <li>Search results flicker as user types</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;

    // ❌ API call on EVERY keystroke!
    fetch(\`/api/search?q=\${query}\`)
      .then(res => res.json())
      .then(data => setResults(data));
  }, [query]);

  return (
    &lt;input
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Search..."
    /&gt;
  );
}</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  Use debouncing to delay the API call until user stops typing.
                  Set a timeout that gets cleared on each keystroke, only fires after delay.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>function SearchBar() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState([]);

  // Debounce the query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [query]);

  // Search with debounced value
  useEffect(() => {
    if (!debouncedQuery) return;

    fetch(\`/api/search?q=\${debouncedQuery}\`)
      .then(res => res.json())
      .then(data => setResults(data));
  }, [debouncedQuery]);

  return (
    &lt;input
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Search..."
    /&gt;
  );
}

// Or use a custom hook
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Always debounce search inputs to reduce API calls and improve performance.
                </p>
              </div>
            </details>
        </CollapsibleBugCard>

        <!-- Bug 19: N+1 Render Problem -->
        <CollapsibleBugCard
          id="bug-19"
          title="Bug #19: N+1 Render Problem 🔴"
          description="100 separate API calls instead of one batched request"
          badge="Universal"
          border-color="blue"
        >
          <div>
              <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
              <ul class="list-disc list-inside text-gray-700 space-y-1">
                <li>Hundreds of API requests for a single list</li>
                <li>Extremely slow page load</li>
                <li>Network tab filled with duplicate requests</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>function UserCard(\{ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ❌ Separate fetch for each card!
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]);

  return &lt;div&gt;{user?.name}&lt;/div&gt;;
}

function UserList(\{ userIds }) {
  return (
    &lt;div&gt;
      {userIds.map(id => (
        &lt;UserCard key={id} userId={id} /&gt;
      ))}
    &lt;/div&gt;
  );
}</code></pre>
            </div>

            <details class="group">
              <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
                💡 Hint
              </summary>
              <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
                <p class="text-gray-700">
                  Fetch all data in the parent component, then pass it down as props.
                  Or use a single batch API endpoint that accepts multiple IDs.
                </p>
              </div>
            </details>

            <details class="group">
              <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
                ✅ Solution
              </summary>
              <div class="mt-2 p-4 bg-green-50 rounded-lg">
                <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>// Solution 1: Fetch in parent
function UserList(\{ userIds }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Single batch request
    fetch(\`/api/users?ids=\${userIds.join(',')}\`)
      .then(res => res.json())
      .then(data => setUsers(data));
  }, [userIds]);

  return (
    &lt;div&gt;
      {users.map(user => (
        &lt;UserCard key={user.id} user={user} /&gt;
      ))}
    &lt;/div&gt;
  );
}

function UserCard(\{ user }) {
  return &lt;div&gt;{user.name}&lt;/div&gt;;
}

// Solution 2: Use React Query or SWR for automatic deduplication
import \{ useQuery } from '@tanstack/react-query';

function UserCard(\{ userId }) {
  const \{ data: user } = useQuery(['user', userId], () =>
    fetch(\`/api/users/\${userId}\`).then(r => r.json())
  );

  return &lt;div&gt;{user?.name}&lt;/div&gt;;
}</code></pre>
                <p class="mt-3 text-gray-700">
                  <strong>Key Lesson:</strong> Avoid N+1 problems by batching requests or using data-fetching libraries with deduplication.
                </p>
              </div>
            </details>
        </CollapsibleBugCard>

        <!-- Bug 20: Unnecessary DOM Manipulation -->
        <CollapsibleBugCard
          id="bug-20"
          title="Bug #20: Direct DOM Manipulation 🔴"
          description="Using querySelector instead of framework patterns"
          badge="Universal"
          border-color="blue"
        >
          <div>
            <h3 class="font-semibold text-gray-800 mb-2">Symptoms:</h3>
            <ul class="list-disc list-inside text-gray-700 space-y-1">
              <li>UI state out of sync with component state</li>
              <li>Changes get overwritten by framework re-renders</li>
              <li>Hard to debug and maintain</li>
            </ul>
          </div>

          <div>
            <h3 class="font-semibold text-gray-800 mb-2">Buggy Code:</h3>
            <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>function HighlightButton() {
  const [count, setCount] = useState(0);

  const highlight = () => {
    // ❌ Direct DOM manipulation!
    const button = document.querySelector('#myButton');
    button.style.backgroundColor = 'yellow';

    setTimeout(() => {
      button.style.backgroundColor = '';
    }, 1000);
  };

  return (
    &lt;button id="myButton" onClick={() => {
      setCount(count + 1);
      highlight();
    }}&gt;
      Clicked {count} times
    &lt;/button&gt;
  );
}</code></pre>
          </div>

          <details class="group">
            <summary class="cursor-pointer bg-yellow-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-yellow-100 transition">
              💡 Hint
            </summary>
            <div class="mt-2 p-4 bg-yellow-50 rounded-lg">
              <p class="text-gray-700">
                Use state to drive UI changes, not direct DOM manipulation.
                Let the framework handle DOM updates based on state changes.
              </p>
            </div>
          </details>

          <details class="group">
            <summary class="cursor-pointer bg-green-50 p-4 rounded-lg font-semibold text-gray-800 hover:bg-green-100 transition">
              ✅ Solution
            </summary>
            <div class="mt-2 p-4 bg-green-50 rounded-lg">
              <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>function HighlightButton() {
  const [count, setCount] = useState(0);
  const [isHighlighted, setIsHighlighted] = useState(false);

  const handleClick = () => {
    setCount(count + 1);
    setIsHighlighted(true);

    setTimeout(() => {
      setIsHighlighted(false);
    }, 1000);
  };

  return (
    &lt;button
      onClick={handleClick}
      className={isHighlighted ? 'bg-yellow-200' : ''}
      // Or inline style
      style=\{\{ backgroundColor: isHighlighted ? 'yellow' : '' }}
    &gt;
      Clicked {count} times
    &lt;/button&gt;
  );
}

// For complex animations, use refs
function AnimatedButton() {
  const buttonRef = useRef(null);

  const animate = () => {
    buttonRef.current?.classList.add('pulse');
    setTimeout(() => {
      buttonRef.current?.classList.remove('pulse');
    }, 1000);
  };

  return &lt;button ref={buttonRef} onClick={animate}&gt;Animate&lt;/button&gt;;
}</code></pre>
              <p class="mt-3 text-gray-700">
                <strong>Key Lesson:</strong> Use state and refs instead of querySelector. Let the framework manage the DOM.
              </p>
            </div>
          </details>
        </CollapsibleBugCard>
      </div>

      <!-- Interview Tips Section -->
      <div class="mt-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
        <h2 class="text-3xl font-bold mb-6">Interview Tips for React Debugging</h2>

        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-xl font-semibold mb-3">🎯 Debugging Strategy</h3>
            <ul class="space-y-2">
              <li class="flex items-start">
                <span class="mr-2">1.</span>
                <span>Read error messages carefully (they're usually helpful!)</span>
              </li>
              <li class="flex items-start">
                <span class="mr-2">2.</span>
                <span>Check React DevTools for component state</span>
              </li>
              <li class="flex items-start">
                <span class="mr-2">3.</span>
                <span>Use console.log strategically to trace data flow</span>
              </li>
              <li class="flex items-start">
                <span class="mr-2">4.</span>
                <span>Think about React's rendering lifecycle</span>
              </li>
              <li class="flex items-start">
                <span class="mr-2">5.</span>
                <span>Explain your thought process out loud</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">💬 What to Say</h3>
            <ul class="space-y-2">
              <li>"Let me check if state is being mutated..."</li>
              <li>"This looks like a closure issue..."</li>
              <li>"I should verify the dependency array..."</li>
              <li>"The component might be re-rendering unnecessarily..."</li>
              <li>"Let me trace when this effect runs..."</li>
            </ul>
          </div>
        </div>

        <div class="mt-6 bg-white/10 rounded-lg p-4">
          <h3 class="text-xl font-semibold mb-2">🔑 Key React Concepts to Master</h3>
          <div class="grid md:grid-cols-3 gap-4 mt-3">
            <div>
              <h4 class="font-semibold">State & Props</h4>
              <p class="text-sm">Immutability, one-way data flow</p>
            </div>
            <div>
              <h4 class="font-semibold">Hooks Rules</h4>
              <p class="text-sm">Top level, React functions only</p>
            </div>
            <div>
              <h4 class="font-semibold">Reconciliation</h4>
              <p class="text-sm">Keys, Virtual DOM, batching</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="mt-8 text-center">
        <router-link
          to="/"
          class="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
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
  { problem: 'State not updating in loop', solution: 'setCount(prev => prev + 1)' },
  { problem: 'Infinite loop in useEffect', solution: 'useEffect(() => {...}, [deps])' },
  { problem: 'Stale closure', solution: 'Use functional setState or useRef' },
  { problem: 'List re-render issues', solution: 'key={item.id} not key={index}' },
  { problem: 'Direct state mutation', solution: 'setItems([...items, newItem])' },
  { problem: 'Memory leak / cleanup missing', solution: 'return () => cleanup()' },
  { problem: 'Handler fires on render', solution: 'onClick={() => handler()}' },
  { problem: 'Object in dependency array', solution: 'useMemo(() => obj, [deps])' },
  { problem: "Memo'd child re-renders", solution: 'useCallback(() => fn, [deps])' },
  { problem: 'Derived state out of sync', solution: 'const x = calculate(props) or useMemo' },
  { problem: 'Custom hook memory leak', solution: 'useEffect cleanup in hook' },
  { problem: 'Race condition in async', solution: 'let ignore = false; return () => ignore = true' },
  { problem: 'Controlled/uncontrolled switch', solution: "value={val ?? ''} never undefined" },
  { problem: 'Component state persists', solution: 'Add key prop to reset state' },
  { problem: 'setState after unmount', solution: 'Clear timers in cleanup' },
  { problem: 'Context causes re-renders', solution: 'useMemo context value or split contexts' },
  { problem: 'Unhandled async errors', solution: 'try/catch + check response.ok' },
  { problem: 'Search without debounce', solution: 'setTimeout + cleanup on each keystroke' },
  { problem: 'N+1 API calls', solution: 'Batch requests in parent component' },
  { problem: 'Direct DOM manipulation', solution: 'Use state/refs, not querySelector' }
];
</script>
