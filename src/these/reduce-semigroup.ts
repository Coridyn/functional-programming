import * as f from 'fp-ts/lib/function';
import * as A from 'fp-ts/lib/Array';
import * as E from 'fp-ts/lib/Either';
import * as Th from 'fp-ts/lib/These';
import {Monoid} from 'fp-ts/lib/Monoid';

const a = A.getMonoid<string>();

// const b = A.getMonoid<number>();
const configMonoid: Monoid<any> = {
    concat: (x, y) => {
        return y;
    },
    empty: null,
};

const theseSG = Th.getSemigroup(a, configMonoid);

const numList = [1, 2, 3, 4];
// const numList = [2, 4];
// const numList = [1, 3];

const result = f.pipe(
    numList,
    A.map(x => (x % 2 == 0) ? E.right(x) : E.left(`Invalid value ${x}`)),
    A.map(E.fold(
        (l: string) => {
            return E.left([l]);
        },
        (r: number) => {
            return E.right(r);
        }
    )),
    A.reduce< E.Either<string[], number>, Th.These< string[], number > >(E.right(0), theseSG.concat),
);

// theseSG.concat
console.log(`result=`, result);
