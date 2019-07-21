export class MetaNot<T = {}> {
    public constructor(public readonly value: T) { }

    public toString(): string {
        return `Not: ${this.value}`;
    }
}
