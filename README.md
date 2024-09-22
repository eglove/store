# "state management"

```shell
pnpm i @ethang/store
```

## Create a store:

```ts
import { Store } from "@ethang/store";

const store = Store({ count: 0 });
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
const useStore = () => {
    return useSyncExternalStore(
        listener => store.subscribe(listener),
        () => store.get(),
        () => store.get(),
    )
}

const state = useStore();

<div>{state.count}</div>
```

## Batch Updates

```ts
// By default, subscribers aren't notified until 
// after work in set is done
store.set(state => {
    state.count + 1;
    state.count + 1;
    state.count + 1;
})

// Optionally, you can just turn notifications off for a bit
store.setIsNotifying(false);
store.set(state => { ... })
store.set(state => { ... })
store.set(state => { ... })
store.setIsNotifying(true); // Immediately updates subscribers
```

## Async

Use [TanStack Query](https://tanstack.com/query/latest)