import * as f from 'fp-ts/lib/function';
import * as A from 'fp-ts/lib/Array';
import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import * as Th from 'fp-ts/lib/These';
import {Monoid} from 'fp-ts/lib/Monoid';

// const b = A.getMonoid<number>();

// const configMonoid = A.getMonoid<number>();
// const configMonoid: Monoid<any> = {
//     concat: (x, y) => {
//         return y;
//     },
//     empty: null,
// };
// const theseSG = Th.getSemigroup(a, configMonoid);

const a = A.getMonoid<any>();
const theseSG = Th.getSemigroup(a, a)

// const theseAp = Th.getApplicative(a);

// const theseAp = Th.getApplicative(A.getMonoid<any>());
// const theseSG = Th.getSemigroup(A.getMonoid<any>(), A.getMonoid<any>());


// const eitherMonoid = E.getApplicativeValidation(A.getMonoid<any>());
// const eitherMonoid = E.getApplyMonoid(A.getMonoid());

// const numList = [1, 2, 3, 4];
// const numList = [6, 2, 4];
const numList = [1, 3];

const result = f.pipe(
    numList,
    A.map((x) => (x % 2 == 0) ? E.right(x) : E.left(`Invalid value ${x}`)),
    // A.map((x) => Th.both(`Invalid value ${x + 1}`, x)),
    
    A.separate,
    
    // A.map(Th.bimap(A.of, A.of)),
    
    // These two lines are equivalent
    // A.map(E.bimap(A.of, A.of)),
    // A.map(E.fold( (x) => E.left([x]), (x) => E.right([x]) )),
    
    // A.sequence(E.either),
    // A.reduce< E.Either<string[], number[]>, Th.These<string[], number[]> >(Th.right([]), theseSG.concat),
    
    // A.reduce< Th.These<string[], number[]>, Th.These<string[], number[]> >(Th.right([]), theseSG.concat),
    
    // A.map(A.of),
    // A.map(E.of),
    
    // E.sequenceArray,
    // A.array.sequence(E.either),
    
    // A.foldMap(eitherMonoid),
    // A.array.sequence(  ),
    
    
    // E.foldMap(A.getMonoid()),
    // E.foldMap()
    // A.map(Th.)
    
    // E.either.sequence(A.array),
    
    // A.array.sequence(O.option),
    
    // A.sequence(E.either),
    
    // A.reduce< E.Either<any, any>, Th.These<any, any>  >(E.right([]), theseSG.concat)
    
    // A.sequence(theseAp),
    // A.sequence(eitherAp),
    
);

// theseSG.concat
console.log(`result=`, result);
