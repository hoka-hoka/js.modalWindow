class eventEmitter<T extends EventMap> implements Emitter<T> {
  public listeners: {
    [K in keyof EventMap]?: Array<(p: EventMap[K]) => void>; // {""?:[(e)=>void]}
  } = {};
  on<K extends EventKey<T>>(key: K, fn: EventReceiver<T[K]>): void {
    this.listeners[key] = (this.listeners[key] || []).concat(fn);
  };
  off<K extends EventKey<T>>(key: K, fn: EventReceiver<T[K]>): void {
    this.listeners[key] = (this.listeners[key] || []).filter( (f: EventReceiver<T[K]>) => f !== fn);
  };
  emit<K extends EventKey<T>>(key: K, data: T[K] | undefined): void {
    (this.listeners[key] || []).forEach(function(fn: EventReceiver<T[K]>) {
      if ( data ) {
        fn(data);
      }
      else {
        fn();
      }
    });
  }
}
export default eventEmitter;