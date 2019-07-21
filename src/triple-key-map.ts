import { Key } from './interface';
import { MultiKeyMap } from './multi-key-map';


export class MapK3<K1, K2, K3, V> {

    private readonly map: MultiKeyMap<V> = new MultiKeyMap(3);


    public constructor(
        items?:
        [Key<K1>,
            [Key<K2>, 
                [Key<K3>, V][]
            ][]
        ][]
    ) {
        for (const item of items || []) {
            for (const item2 of item[1]) {
                for (const item3 of item2[1]) {
                    this.set(item[0], item2[0], item3[0], item3[1]);
                }
            }
        }
    }


    public static formFlat<K1, K2, K3, V>(items: [Key<K1>, Key<K2>, Key<K3>, V][]): MapK3<K1, K2, K3, V> {
        const map = new MapK3<K1, K2, K3, V>();
        for (const item of items) {
            map.set(item[0], item[1], item[2], item[3]);
        }

        return map;
    }


    public get(key1: K1, key2: K2, key3: K3): V | undefined {
        return this.map.getBoxed([key1, key2, key3])[0];
    }

    public set(key1: Key<K1>, key2: Key<K2>, key3: Key<K3>, value: V): void {
        this.map.set([key1, key2, key3], value);
    }
}
