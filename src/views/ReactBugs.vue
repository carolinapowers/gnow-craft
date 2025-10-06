<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-gray-900 mb-4">
          React Interview Debugging Scenarios
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Common React bugs you'll encounter in technical interviews. Each scenario includes buggy code,
          symptoms, hints, and solutions.
        </p>
      </div>

      <!-- Bug Cards -->
      <div class="space-y-8">
        <!-- Bug 1: State Update in Loop -->
        <div class="bg-white rounded-lg shadow-lg p-8 border-l-4 border-red-500">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                Bug #1: State Updates in Loop 🔴
              </h2>
              <p class="text-gray-600">Counter doesn't increment correctly when clicked multiple times rapidly</p>
            </div>
            <span class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
              Common
            </span>
          </div>

          <div class="space-y-4">
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
          </div>
        </div>

        <!-- Bug 2: Infinite Loop with useEffect -->
        <div class="bg-white rounded-lg shadow-lg p-8 border-l-4 border-orange-500">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                Bug #2: Infinite Loop in useEffect 🔴
              </h2>
              <p class="text-gray-600">Component re-renders infinitely and crashes the browser</p>
            </div>
            <span class="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
              Critical
            </span>
          </div>

          <div class="space-y-4">
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
          </div>
        </div>

        <!-- Bug 3: Stale Closure in Event Handler -->
        <div class="bg-white rounded-lg shadow-lg p-8 border-l-4 border-purple-500">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                Bug #3: Stale Closure 🔴
              </h2>
              <p class="text-gray-600">Timer always shows 0 instead of incrementing count</p>
            </div>
            <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
              Tricky
            </span>
          </div>

          <div class="space-y-4">
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
          </div>
        </div>

        <!-- Bug 4: Keys in Lists -->
        <div class="bg-white rounded-lg shadow-lg p-8 border-l-4 border-blue-500">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                Bug #4: Incorrect List Keys 🔴
              </h2>
              <p class="text-gray-600">List items lose state when reordered or items are deleted</p>
            </div>
            <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              Common
            </span>
          </div>

          <div class="space-y-4">
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
          </div>
        </div>

        <!-- Bug 5: Direct State Mutation -->
        <div class="bg-white rounded-lg shadow-lg p-8 border-l-4 border-pink-500">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                Bug #5: Mutating State Directly 🔴
              </h2>
              <p class="text-gray-600">Adding items to array doesn't trigger re-render</p>
            </div>
            <span class="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-semibold">
              Common
            </span>
          </div>

          <div class="space-y-4">
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
          </div>
        </div>

        <!-- Bug 6: Missing Cleanup in useEffect -->
        <div class="bg-white rounded-lg shadow-lg p-8 border-l-4 border-green-500">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                Bug #6: Memory Leak from Missing Cleanup 🔴
              </h2>
              <p class="text-gray-600">Warning: Can't perform state update on unmounted component</p>
            </div>
            <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
              Important
            </span>
          </div>

          <div class="space-y-4">
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
          </div>
        </div>

        <!-- Bug 7: Event Handler Binding -->
        <div class="bg-white rounded-lg shadow-lg p-8 border-l-4 border-yellow-500">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                Bug #7: Incorrect Event Handler Syntax 🔴
              </h2>
              <p class="text-gray-600">Handler fires immediately on render instead of on click</p>
            </div>
            <span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
              Beginner
            </span>
          </div>

          <div class="space-y-4">
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
          </div>
        </div>
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

      <!-- Quick Reference -->
      <div class="mt-8 bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Quick Reference: Common Fixes</h2>

        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Problem</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quick Fix</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr>
                <td class="px-6 py-4 text-sm text-gray-900">State not updating</td>
                <td class="px-6 py-4 text-sm font-mono text-gray-600">setCount(prev => prev + 1)</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-900">Infinite loop</td>
                <td class="px-6 py-4 text-sm font-mono text-gray-600">useEffect(() => {...}, [deps])</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-900">Stale closure</td>
                <td class="px-6 py-4 text-sm font-mono text-gray-600">Use functional setState or useRef</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-900">List re-render issues</td>
                <td class="px-6 py-4 text-sm font-mono text-gray-600">key={item.id} not key={index}</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-900">State mutation</td>
                <td class="px-6 py-4 text-sm font-mono text-gray-600">setItems([...items, newItem])</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-900">Memory leak</td>
                <td class="px-6 py-4 text-sm font-mono text-gray-600">return () => cleanup()</td>
              </tr>
              <tr>
                <td class="px-6 py-4 text-sm text-gray-900">Handler fires on render</td>
                <td class="px-6 py-4 text-sm font-mono text-gray-600">onClick={() => handler()}</td>
              </tr>
            </tbody>
          </table>
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
// No additional logic needed for this view
</script>
