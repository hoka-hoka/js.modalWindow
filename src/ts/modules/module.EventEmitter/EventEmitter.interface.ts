type EventMap = Record<string, any>; // { data: string } => true, {x: string} => true
type EventKey<T extends EventMap> = string & keyof T; // { string, data, ... }
type EventReceiver<C> = (params?: C) => void;

interface Emitter<T extends EventMap> { // K = ('data') содержится в EventKey() ?
  on<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void; // если да, то в (x: string) => this.data() ищем 'data'
  off<K extends EventKey<T>>(eventName: K, fn: EventReceiver<T[K]>): void;
  emit<K extends EventKey<T>>(eventName: K, params: T[K]): void;
}