import { Meta } from './meta';
import { MetaNot } from './meta/meta-not';


type Key<K> = K | MetaNot<K>;
interface Result<V> {
    ok: boolean;
    value?: V;
}

export class MapK2<K1, K2, V> {

    private readonly map: Map<Key<K1>, Map<Key<K2>, V>> = new Map();

    private readonly notKeys1: Map<K1, MetaNot<K1>> = new Map();
    private readonly notKeys2: Map<K2, MetaNot<K2>> = new Map();

    public constructor(
        items?: [Key<K1>,
            [Key<K2>, V][]
        ][]
    ) {
        for (const item of items || []) {
            for (const item2 of item[1]) {
                this.set(item[0], item2[0], item2[1]);
            }
        }
    }

    public static formFlat<K1, K2, V>(items: [Key<K1>, Key<K2>, V][]): MapK2<K1, K2, V> {
        const map = new MapK2<K1, K2, V>();
        for (const item of items) {
            map.set(item[0], item[1], item[2]);
        }

        return map;
    }

    private static updateNot<K>(key: Key<K>, keys: Map<K, MetaNot<K>>): Key<K> {
        if (!(key instanceof MetaNot)) {
            return key;
        }

        const k = keys.get(key.value);
        if (k) {
            return k;
        } else {
            keys.set(key.value, key);
            return key;
        }
    }

    private static get<K, V1, V2>(
        map: Map<Key<K>, V1>, key: K, keys: Key<K>[], cb: (v: V1) => Result<V2>
    ): Result<V2> {
        for (const k of keys) {
            if (k instanceof MetaNot && k.value === key) continue;
            const val = map.get(k);
            if (!val) continue;

            const result = cb(val);
            if (result.ok) {
                return result;
            }
        }    

        return { ok: false };
    }


    public set(key1: Key<K1>, key2: Key<K2>, value: V): void {
        const k1 = MapK2.updateNot(key1, this.notKeys1);
        const k2 = MapK2.updateNot(key2, this.notKeys2);

        let map2 = this.map.get(k1);
        if (!map2) {
            map2 = new Map();
            this.map.set(k1, map2);
        }

        map2.set(k2, value);
    }

    public get(key1: K1, key2: K2): V | undefined {
        const keysSet1: Key<K1>[][] = [[key1], [...this.notKeys1.values()], [Meta.Any]];
        const keysSet2: Key<K2>[][] = [[key2], [...this.notKeys2.values()], [Meta.Any]];

        while (keysSet1.length > 0) {
            const keys1 = keysSet1.shift();
            let result = MapK2.get(this.map, key1, keys1, (map2) =>
                MapK2.get(map2, key2, toFlat(keysSet2), (value) => ({ ok: true, value }))
            );
    
            if (result.ok) {
                return result.value;
            }
    
            const keys2 = keysSet2.shift();
            result = MapK2.get(this.map, key1, toFlat(keysSet1), (map2) =>
                MapK2.get(map2, key2, keys2, (value) => ({ ok: true, value }))
            );

            if (result.ok) {
                return result.value;
            }
        }

        return undefined;
    }

}


function toFlat<T>(array: T[][]): T[] {
    const result: T[] = [];
    for (const item of array) {
        result.push(...item);
    }
    return result;
}
