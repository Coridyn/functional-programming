/**
 * https://rlee.dev/writing/practical-guide-to-fp-ts-part-5
 */
import { pipe } from 'fp-ts/lib/pipeable'
import * as f from 'fp-ts/lib/function'
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import * as E from 'fp-ts/lib/Either';

type MapNum = (x: number) => number;

const fns: MapNum[] = [
    (x: number): number => {
        return x + 1;
    },
    (x: number): number => {
        return x * 2;
    },
];

const result = pipe(
    fns,
    A.ap([5]),
);

const result2 = pipe(
    fns,
    A.ap([5]),
);

console.log(`result=`, result);
console.log(`result2=`, result2);
