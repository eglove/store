// eslint-disable-next-line max-classes-per-file
import { type Draft, produce } from "immer";

export type Listener<TState> = (state: TState) => void;

class Id {
  private counter = 0;

  public getId() {
    this.counter += 1;
    return `${Date.now()}-${this.counter}`;
  }
}

export class Store<TState> {
  private readonly _elementListeners = new Map<string, HTMLElement>();

  private readonly _idTracker = new Id();

  private readonly _initialState: TState;

  private readonly _listeners = new Set<Listener<TState>>();

  private _state: TState;

  public constructor(initialState: TState) {
    this._state = initialState;
    this._initialState = initialState;
  }

  private cleanup(id: string, updateElement: Listener<TState>): boolean {
    if (this._elementListeners.has(id) && "undefined" !== typeof window) {
      const foundElement = document.querySelector(`[data-listener-id="${id}"]`);

      if (!foundElement) {
        this._elementListeners.delete(id);
        this._listeners.delete(updateElement);
        return true;
      }
    }

    return false;
  }

  public bind<E>(
    onUpdate: (state: TState, element: E) => void,
  ) {
    return (element: E | null) => {
      const id = this._idTracker.getId();

      if (null !== element) {
        const updateElement = () => {
          const cleanedUp = this.cleanup(id, updateElement);
          if (!cleanedUp) {
            onUpdate(this.state, element);
          }
        };

        updateElement();
        this._listeners.add(updateElement);
        (element as HTMLElement).dataset["listenerId"] = id;
        this._elementListeners.set(id, element as HTMLElement);
      }
    };
  }

  public get(): TState;
  public get<T>(selector: (state: TState) => T): T;
  public get<T>(selector?: (state: TState) => T) {
    if (!selector) {
      return this.state;
    }

    return selector(this.state);
  }

  public notifySubscribers() {
    for (const listener of this._listeners) {
      listener(this.state);
    }
  }

  public resetState() {
    this.state = this._initialState;
  }

  public set(updater: (draft: Draft<TState>) => void) {
    this.state = produce(this.state, updater);
  }

  public subscribe(listener: Listener<TState>) {
    this._listeners.add(listener);

    return () => {
      this._listeners.delete(listener);
    };
  }

  private set state(state: TState) {
    this._state = state;
    this.notifySubscribers();
  }

  private get state() {
    return this._state;
  }
}
