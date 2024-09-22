import type { Listener, Store } from "./index";

export const storeSubscriptionHandler = <T,>(
  store: Store<T>,
) => {
  return (listener: Listener<T>) => {
    return store.subscribe(listener);
  };
};

export const storeSnapshotHandler = <T,>(store: Store<T>) => {
  return () => {
    return store.get();
  };
};
