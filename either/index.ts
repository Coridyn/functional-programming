import * as app from 'fp-ts/Apply';
import * as A from 'fp-ts/Array';
import { getSemigroup, NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import { 
    either,
    Either,
    left as leftE,
    right as rightE,
    sequenceArray,
    Applicative as ApplicativeE,
    getValidation
} from 'fp-ts/Either';

import {
    Applicative as ApplicativeO,
    some,
} from 'fp-ts/Option';

import {
    sequence as sequenceThese,
    getApplicative,
    traverse as traverseThese,
    these,
    isLeft,
    isRight,
    isBoth,
    left as leftT,
    right as rightT,
    both as bothT,
    These
} from 'fp-ts/These';
import { sequenceT } from 'fp-ts/Apply';
import { pipe } from 'fp-ts/lib/function';
import { mapLeft } from 'fp-ts/lib/Either';


/**
 * Remove the `readonly` annotation from `sequenceArray` return result
 */
const seq2: <E, A>(arr: Either<E, A>[]) => Either<E, A[]> = sequenceArray as any;


// import { promisify } from 'util';
// import { get } from 'https';
//
// const getP = promisify(get);
//
// // `httpstat.us/200/cors`;
// getP(`https://httpstat.us/200`)
//     .then(
//        
//     );


const list: Either<string, number>[] = [
    rightE<string, number>(1),
    rightE<string, number>(2),
    leftE<string, number>('Error'),
];

const result = sequenceArray(list);
const result2 = seq2(list);

console.log(`result=`, result);
console.log(`result2=`, result2);


// these
const listT: These<string, number>[] = [
    rightE(1),
];

/**
 * semigroup -> monoid without an identity
 * 
 * identity
 * 
 * associative
 * closure
 * 
 */
// getApplicative()

// A.sequence(either)(list);
const seqEither = A.sequence(either);

// sequenceThese(ApplicativeE)(listT)
const sgString = getSemigroup<string>();
const appString = getApplicative(sgString);


// const theseAp = getApplicative< Either<string, number>[] >({
//     concat: (x, y) => {
//         // left, right, both
//        
//         // if (isLeft(x)){
//         //     if (isLeft(y)){
//         //         // both
//         //     }
//         // } else if (isLeft(y)){
//         //    
//         // }
//        
//         return [];
//     },
// })
// const resultSeq = A.sequence( appString )(listT);

const resultSeq = app.sequenceT( ApplicativeE )(
    rightE<string, number>(1),
    rightE<string, number>(2),
    leftE<string, number>('some error'),
);
console.log(`resultSeq=`, resultSeq);


function lift<E, A, B>(check: (a: A) => Either<E, B>): (a: A) => Either<NonEmptyArray<E>, B> {
  return a =>
    pipe(
      check(a),
      mapLeft(a => [a])
    )
}

const applicativeValidation = getValidation(getSemigroup<string>());
// const resultSeq2 = sequenceT( applicativeValidation )(
//     lift((a: num) => {
//        
//     }),
//     // rightE<string, number>(2),
//     // leftE<string, number>('some error'),
// )([
//     rightE<string, number>(1)
// ]);

const resultSeq2 = pipe(
    list,
    A.traverse( traverseThese( getValidation(getSemigroup<string>()) ) )
);


console.log(`resultSeq2=`, resultSeq2);

// sequenceThese< These<string, number>[], Either<string, number> >(either)(listT)
