import * as f from 'fp-ts/lib/function';
import * as A from 'fp-ts/lib/Array';
import * as E from 'fp-ts/lib/Either';
import * as T from 'fp-ts/lib/These';

const a = A.getMonoid<string>();
const b = A.getMonoid<number>();
const theseSG = T.getSemigroup(a, b);

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
            return E.right([r]);
        }
    )),
    A.reduce< E.Either<string[], number[]>, T.These< string[], number[] > >(E.right([]), theseSG.concat),
);

// theseSG.concat
const theseM = T.getMonad(theseSG);
// theseM.chain()

const bimapResult = f.pipe(
    result,
    // (resultT) => {
    //     // do it, then concat
    // },
    
    T.bimap(
        (l) => {
            console.log(`(left) l=`, l);
            return l;
        },
        (r) => {
            console.log(`(right) r=`, r);
            return r;
        },
    ),
);

const result3 = theseSG.concat(result, bimapResult)

console.log(`result=`, result);
console.log(`bimapResult=`, bimapResult);

console.log(`result3=`, result3);
