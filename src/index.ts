import { type Draft, produce } from "immer";

export type Listener<TState> = (state: TState) => void;

export class Store<TState> {
  private readonly _elementListeners = new Map<string, HTMLElement>();

  private _idCounter = 0;

  private readonly _initialState: TState;

  private _isNotifying = true;

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
    const id = `${Date.now()}-${this._idCounter}`;
    this._idCounter += 1;

    return (element: E | null) => {
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

  public setIsNotifying(isNotifying: boolean) {
    this._isNotifying = isNotifying;

    if (isNotifying) {
      this.notifySubscribers();
    }
  }

  public subscribe(listener: Listener<TState>) {
    this._listeners.add(listener);

    return () => {
      this._listeners.delete(listener);
    };
  }

  private set state(state: TState) {
    this._state = state;

    if (this._isNotifying) {
      this.notifySubscribers();
    }
  }

  private get state() {
    return this._state;
  }
}
