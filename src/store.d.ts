import { type Draft } from "immer";
export type Listener = () => void;
export declare class Store<TState> {
    private _state;
    private readonly elementListeners;
    private readonly initialState;
    private readonly listeners;
    constructor(initialState: TState);
    private cleanup;
    bindRef<E>(onUpdate: (state: TState, element: E) => void): (element: E | null) => void;
    notifySubscribers(): void;
    resetState(): void;
    set(updater: (draft: Draft<TState>) => void): void;
    subscribe(listener: Listener): () => void;
    private set state(value);
    get state(): TState;
}
