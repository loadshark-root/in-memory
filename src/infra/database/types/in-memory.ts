export interface InMemoryMethods<V> {
  get(key: string): Promise<V | any>;
  create(key: string, value: V | any, expiresIn?: number): Promise<void>;
  remove(key: string): Promise<void>;
  generateKey(text: string, replaceBaseUrl?: boolean): string;
}

export abstract class InMemoryAdapter<T, O> {
  abstract startInMemory(options: O): T | null;
  abstract useInMemory<V>(): InMemoryMethods<V>;
}