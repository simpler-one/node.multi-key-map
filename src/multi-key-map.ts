import { Meta } from './meta';
import { MetaNot } from './meta/meta-not';

type Key<K> = K | MetaNot<K>;


export class MultiKeyMap<V> {

    private readonly map: Map<Key<{}>, V> = new Map();
    private readonly notKeys: Map<{}, MetaNot<{}>>[] = [];

    public constructor(
        public readonly keyLength: number,
    ) {
        for (let i = 0; i < keyLength; i++) {
            this.notKeys.push(new Map());
        }
    }
}
