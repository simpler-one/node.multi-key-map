import { Key, Boxed } from '../interface';
import { Exactness } from '../exactness';


export abstract class MultiKeyMapNode<V> {

    public constructor(
        public readonly keyLength: number,
        protected readonly i: number,
    ) {
    }

    public get(keys: Key<{}>[], low: Exactness[], high: Exactness[]): V | undefined {
        return this.getBoxed(keys, low, high)[0];
    }

    public abstract getBoxed(keys: Key<{}>[], low: Exactness[], high: Exactness[]): Boxed<V>;

    public abstract set(keys: Key<{}>[], value: V): void;
}
