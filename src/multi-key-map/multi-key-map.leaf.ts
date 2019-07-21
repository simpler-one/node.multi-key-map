import { MetaMap } from '../meta-map';
import { Key, Boxed } from '../interface';
import { Exactness } from '../exactness';
import { MultiKeyMapNode } from './multi-key-map.node';


export class MultiKeyMapLeaf<V> extends MultiKeyMapNode<V> {

    private readonly map: MetaMap<{}, V> = new MetaMap<{}, V>();

    public constructor(
        i: number,
    ) {
        super(1, i);
    }

    public getBoxed(keys: Key<{}>[], low: Exactness[], high: Exactness[]): Boxed<V> {
        return this.map.getBoxed(keys[this.i], low[this.i], high[this.i]);
    }

    public set(keys: Key<{}>[], value: V): void {
        this.map.set(keys[this.i], value);
    }
}
