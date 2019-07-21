import { Key, Boxed } from '../interface';
import { MultiKeyMapNode } from './multi-key-map.node';
import { MultiKeyMapLeaf } from './multi-key-map.leaf';
import { MultiKeyMapBranch } from './multi-key-map.branch';
import { Exactness } from '../exactness';


export class MultiKeyMap<V> {

    private readonly map: MultiKeyMapNode<V>;

    public constructor(
        public readonly keyLength: number,
    ) {
        if (keyLength <= 0) {
            throw new RangeError(`keyLength is negative. ${keyLength}`);
        }

        this.map = keyLength === 1 ? new MultiKeyMapLeaf(0) : new MultiKeyMapBranch(keyLength, 0);
    }

    public get(keys: {}[]): V | undefined {
        return this.getBoxed(keys)[0];
    }

    public getBoxed(keys: {}[]): Boxed<V> {
        this.checkKeys(keys);
        const low: Exactness[] = new Array(this.keyLength).fill(Exactness.MetaAny);
        const high: Exactness[] = new Array(this.keyLength).fill(Exactness.Exactly);

        for (let e = Exactness.Exactly; e <= Exactness.MetaAny; e++) {
            for (let i = 0; i < this.keyLength; i++) {
                low[i] = high[i];
                const result = this.map.getBoxed(keys, low, high);
                if (result.length > 0) return result;

                low[i] = Exactness.MetaAny;
                high[i]++;
            }
        }

        return [];
    }

    public set(keys: Key<{}>[], value: V): void {
        this.checkKeys(keys);
        this.map.set(keys, value);
    }

    public has(keys: Key<{}>[]): boolean {
        return this.getBoxed(keys).length > 0;
    }


    private checkKeys(keys: Key<{}>[]): void {
        if (!keys || keys.length !== this.keyLength) {
            throw new RangeError(`keys.length mismatch. expected: ${this.keyLength}, actual: ${keys.length}`);
        }
    }
}

