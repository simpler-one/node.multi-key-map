import { MetaNot } from './meta/meta-not';

export type Boxed<T> = [T] | [];
export type Key<K> = K | MetaNot<K>;
