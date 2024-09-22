# "state management"

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
store.subscribe((state) => {
    console.log(`Count is now ${state.count}`);
})
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

## React useExternalStore*

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