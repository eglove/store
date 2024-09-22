# "state management"

```shell
pnpm i @ethang/store
```

## Create a store:

```ts
import { Store } from "@ethang/store";

const store = new Store({ count: 0 });
```

## Update store

```ts
store.set((state) => {
    state.count += 1; // Immutable changes via Immer
})
```

## Get from store

```ts
store.get(); // { count: 1 }

store.get(state => state.count); // 1
```

## Subscribe to changes

```ts
const unsubscribe = store.subscribe((state) => {
    console.log(`Count is now ${state.count}`);
})

unsubscribe(); // Don't forget to clean up.
```

## Subscribe HTML element

```ts
const counterButton = document.querySelector('#counter');

counterButton.onclick = () => store.set(state => {
    state.count += 1;
})

const bindFn = store.bind((state, element) => {
    element.textContent = state.count; 
})

bindFn(counterButton);

// Automatically cleans up after element is removed from DOM
```

## Bind React Ref*

*(fine-grained reactivity)

```tsx
<button
    onClick={() => {
        store.set(state => {
            state.count += 1;
        })
    }}
    ref={store.bind((state, element) => {
        element.textContent = state.count;
    })}
/>
```

## React useSyncExternalStore*

*(sync w/ React reconciliation)

```tsx
import { useStore } from "@ethang/hooks/use-store";

const count = useStore(
    listener => store.subcribe(listener),
    () => store.get(), // get client snapshot
    () => store.get(), // get server snaphot
    state => state.count(), // selector
    (a, b) => boolean, // Optional comparison, defaults to shallow comparison
);

<div>{count}</div>
```

## Batch Updates

```ts
// Subscribers aren't notified until after work in set is done
store.set(state => {
    state.count + 1;
    state.count + 1;
    state.count + 1;
})
```

## Async

Use [TanStack Query](https://tanstack.com/query/latest)
