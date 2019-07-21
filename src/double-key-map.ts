import { Key } from './interface';
import { MultiKeyMap } from './multi-key-map';


export class MapK2<K1, K2, V> {

    private readonly map: MultiKeyMap<V> = new MultiKeyMap(2);


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


    public get(key1: K1, key2: K2): V | undefined {
        return this.map.getBoxed([key1, key2])[0];
    }

    public set(key1: Key<K1>, key2: Key<K2>, value: V): void {
        this.map.set([key1, key2], value);
    }
}
