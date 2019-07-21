import { MetaMap } from '../meta-map';
import { Key, Boxed } from '../interface';
import { Exactness } from '../exactness';
import { MultiKeyMapNode } from './multi-key-map.node';
import { MultiKeyMapLeaf } from './multi-key-map.leaf';
import { Meta } from '../meta';


export class MultiKeyMapBranch<V> extends MultiKeyMapNode<V> {

    private readonly map: MetaMap<{}, MultiKeyMapNode<V>> = new MetaMap<{}, MultiKeyMapNode<V>>();

    public constructor(
        keyLength: number,
        i: number,
    ) {
        super(keyLength, i);
    }


    public getBoxed(keys: Key<{}>[], low: Exactness[], high: Exactness[]): Boxed<V> {
        const maps = this.map.getAll(keys[this.i], low[this.i], high[this.i]);
        for (const map of maps) {
            const result = map.getBoxed(keys, low, high);
            if (result.length > 0) return result;
        }

        return [];
    }

    public set(keys: Key<{}>[], value: V): void {
        let next = this.map.get(keys[this.i], Exactness.Exactly);
        if (!next) {
            const nextLength = this.keyLength - 1;
            next = nextLength === 1 ?
                new MultiKeyMapLeaf(this.i + 1) : new MultiKeyMapBranch(nextLength, this.i + 1);
            this.map.set(keys[this.i], next);
        }

        next.set(keys, value);
    }
}
