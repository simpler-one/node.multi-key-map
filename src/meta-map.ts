import { Meta } from './meta';
import { MetaNot } from './meta/meta-not';
import { Exactness } from './exactness';

type Boxed<T> = [T] | [];
type Key<K> = K | MetaNot<K>;
interface MapSet<K, V> {
    map: Map<K, V>;
    keys: Iterable<K>;
}

export class MetaMap<K, V> {
    private readonly map = new Map<K, V>();
    private readonly notMap = new Map<K, V>();


    public set(key: Key<K>, value: V): void {
        if (key instanceof MetaNot) {
            this.notMap.set(key.value, value);
        } else {
            this.map.set(key, value);
        }
    }

    public get(key: Key<K>, low: Exactness = Exactness.MetaAny, high: Exactness = Exactness.Exactly): V | undefined {
        return this.getAll(key, low, high, 1)[0];
    }

    public getAll(
        key: Key<K>, low: Exactness = Exactness.MetaAny, high: Exactness = Exactness.Exactly,
        limit: number = 0,
    ): V[] {
        if (key instanceof MetaNot) {
            return this.notMap.has(key.value) ? [this.notMap.get(key.value)] : [];
        }

        const mapSets: MapSet<K, V>[] = [
            { map: this.map, keys: [key] },
            { map: this.notMap, keys: this.notMap.keys() },
            { map: this.map, keys: [Meta.Any] },
        ];
        const found: V[] = [];
        const lim = Math.floor(limit);

        for (let i = high; i <= low; i++) {
            const mapSet = mapSets[i];
            for (const k of mapSet.keys) {
                if (i === Exactness.MetaNot && k === key) continue;
                if (mapSet.map.has(k)) {
                    found.push(mapSet.map.get(k));

                    if (found.length === lim) {
                        return found;
                    }
                }
            }
        }

        return found;
    }

    public getBoxed(
        key: Key<K>, low: Exactness = Exactness.MetaAny, high: Exactness = Exactness.Exactly
    ): Boxed<V> {
        return this.getAll(key, low, high, 1) as [V];
    }

    public has(key: Key<K>, low: Exactness = Exactness.MetaAny, high: Exactness = Exactness.Exactly): boolean {
        return this.getAll(key, low, high, 1).length > 0;
    }
}
