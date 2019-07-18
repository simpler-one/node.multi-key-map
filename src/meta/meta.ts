import { MetaNot } from './meta-not';
import { MetaAny } from './meta-any';

export const Any: undefined = MetaAny.Instance as undefined;

export function not<T>(value: T): MetaNot<T> {
    return new MetaNot(value);
}
