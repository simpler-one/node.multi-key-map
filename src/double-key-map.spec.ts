import { MapK2 } from './double-key-map';
import { Meta } from './meta';
import { MetaNot } from './meta/meta-not';

const Items: [string | MetaNot<string>, string | MetaNot<string>, string][] = [
    ['a', 'b', 'c'],
    ['a', 'B', 'C'],
    [Meta.not('A'), 'B', 'AC1'],
    [Meta.not('A'), Meta.not('no'), 'AC2'],
    ['A', Meta.not('B'), 'AC3'],
    ['A', Meta.Any, 'Any1'],
    [Meta.Any, 'B', 'Any2'],
    [Meta.Any, 'AnyB', 'Any3'],
    [Meta.Any, Meta.Any, 'Any4'],
];

describe('MapK2', () => {
    describe('fromFlat', () => {
        it('should return equal object to constructor', () => {
            // Given
            const items = Items;

            // When
            const map = MapK2.formFlat(items);

            // Then
            expect(JSON.stringify(map)).toEqual(JSON.stringify(new MapK2([
                ['a', [
                    ['b', 'c'],
                    ['B', 'C'],
                ]],
                [Meta.not('A'), [
                    ['B', 'AC1'],
                    [Meta.not('no'), 'AC2'],
                ]],
                ['A', [
                    [Meta.not('B'), 'AC3'],
                    [Meta.Any, 'Any1'],
                ]],
                [Meta.Any, [
                    ['B', 'Any2'],
                    ['AnyB', 'Any3'],
                    [Meta.Any, 'Any4'],
                ]],
            ])));
        });
    });

    describe('get', () => {
        it('normal/normal', () => {
            // Given
            const map = MapK2.formFlat(Items);
            // When
            const val = map.get('a', 'b');
            // Then
            expect(val).toEqual('c');
        });
        
        it('normal/normal (brother)', () => {
            // Given
            const map = MapK2.formFlat(Items);
            // When
            const val = map.get('a', 'B');
            // Then
            expect(val).toEqual('C');
        });

        it('-/not', () => {
            // Given
            const map = MapK2.formFlat(Items);
            // When
            const val = map.get('A', 'notB');
            // Then
            expect(val).toEqual('AC3');
        });

        it('not/-', () => {
            // Given
            const map = MapK2.formFlat(Items);
            // When
            const val = map.get('notA', 'B');
            // Then
            expect(val).toEqual('AC1');
        });

        it('not/not', () => {
            // Given
            const map = MapK2.formFlat(Items);
            // When
            const val = map.get('notA', 'not-no');
            // Then
            expect(val).toEqual('AC2');
        });

        it('any/-', () => {
            // Given
            const map = MapK2.formFlat(Items);
            // When
            const val = map.get('notfound', 'AnyB');
            // Then
            expect(val).toEqual('Any3');
        });

        it('-/any', () => {
            // Given
            const map = MapK2.formFlat(Items);
            // When
            const val = map.get('A', 'B');
            // Then
            expect(val).toEqual('Any1');
        });

        it('any/any', () => {
            // Given
            const map = MapK2.formFlat(Items);
            // When
            const val = map.get('notfound', 'no');
            // Then
            expect(val).toEqual('Any4');
        });
    });
});