import type { Listener, Store } from "./index";

export const storeSubscriptionHandler = <T,>(
  store: Store<T>,
): (listener: Listener<T>) => void => {
  return (listener: Listener<T>) => {
    return store.subscribe(listener);
  };
};

export const storeSnapshotHandler = <T,>(store: Store<T>): () => T => {
  return () => {
    return store.get();
  };
};
