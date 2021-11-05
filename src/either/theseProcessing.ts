/**
 * https://dev.to/gcanti/getting-started-with-fp-ts-either-vs-validation-5eja
 */
import { Either, left, right } from 'fp-ts/lib/Either'

import * as f from 'fp-ts/lib/function';
import * as A from 'fp-ts/lib/Array';
import { sequenceT } from 'fp-ts/lib/Apply'
import { getSemigroup, NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import { getMonoid } from 'fp-ts/lib/Array'
import { 
    getValidation, 
    map as mapE,
    mapLeft, 
    chain as chainE, 
    sequenceArray, 
    traverseArray, 
    fold,
    foldMap as foldMapE
} from 'fp-ts/lib/Either'

import { chain } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import {
    These,
    fold as foldT,
    both, 
    getSemigroup as getSemiGroupThese, 
    getApplicative as getApplicativeThese, 
    sequence as sequenceThese,
    map as mapThese,
    bimap as bimapThese,
    foldMap as foldMapThese,
} from 'fp-ts/lib/These';
import { identity } from 'fp-ts/lib/function';


/**
 * Remove the `readonly` annotation from `sequenceArray` return result
 */
const sequenceArray2: <E, A>(arr: Either<E, A>[]) => Either<E, A[]> = sequenceArray as any;


const applicativeValidation = getValidation(getSemigroup<string>());


/**
 * Validation functions
 */
const minLength = (s: string): Either<string, string> =>
  s.length >= 6 ? right(s) : left('at least 6 characters')

const oneCapital = (s: string): Either<string, string> =>
  /[A-Z]/g.test(s) ? right(s) : left('at least one capital letter')

const oneNumber = (s: string): Either<string, string> =>
  /[0-9]/g.test(s) ? right(s) : left('at least one number')


/**
 * Generate a validation function from a list of validators
 */
type IValidationFn = (s: string) => Either<string, string>;

const arrayStrMonoid = getMonoid<string>();
const arrayNumMonoid = getMonoid<number>();
const arrayEitherMonoid = getMonoid<Either<any, any>>();
const theseStrAp = getApplicativeThese(arrayStrMonoid);

const theseStrSemiGroup = getSemiGroupThese(arrayStrMonoid, arrayStrMonoid);
const theseStrNumSemiGroup = getSemiGroupThese(arrayStrMonoid, arrayNumMonoid);
// const theseNumSemiGroup = getSemiGroupThese(arrayNumMonoid, arrayNumMonoid);

const theseEitherSemiGroup = getSemiGroupThese(arrayStrMonoid, arrayNumMonoid);

// const numberListE: Either<string, number>[] = [1, 5, 7, 9, 3].map((num: number) => {
//     const resultE: Either<string, number> = pipe(
//         num,
//         (num): Either<string, number> => {
//             if (num % 2 == 0){
//                 return right(num);
//             } else {
//                 return left(`Invalid number ${num}`);
//             }
//         },
//         mapE((evenNumber: number) => {
//             // force all even numbers to only 2
//             return 2;
//         }),
//     );
//     return resultE;
// });


const numberList = [1, 5, 7, 9, 3];
const numberListE: Either<string, number>[] = pipe(
    numberList,
    A.map((num): Either<string, number> => {
        if (num % 2 == 0){
            return right(num);
        } else {
            return left(`Invalid number ${num}`);
        }
    }),
    A.map(mapE((evenNumber: number) => {
        // force all even numbers to only 2
        return 2;
    })),
);


appThese.map

const appThese = getApplicativeThese(theseEitherSemiGroup);
const numberListThese = numberListE.map();

// theseEitherSemiGroup.concat
const seqThese = A.array.sequence(appThese);
const strNumThese = seqThese(numberListThese);

// const strNumThese: These<string[], number[]> = pipe(
//     numberListE,
//     A.array.sequence(appThese),
//    
//     A.map(fold(
//         (lValue: string) => {
//             return left<string[], number[]>([lValue]);
//         },
//         (rValue) => {
//             return right<string[], number[]>([rValue]);
//         },
//     )),
//    
//     A.reduce< Either<string[], number[]>, These<string[], number[]> >(right<string[], number[]>([]), theseEitherSemiGroup.concat),
// );

console.log(`strNumThese=`, strNumThese);

// const theseStrNumResult = pipe(
//     numberListE,
//     A.map((e: Either<number, number>): Either<string[], number[]> => {
//         return fold(
//             (odd: number) => {
//                 return left<string[]>([''+odd]);
//             },
//             (even: number) => {
//                 return right<string[], number[]>([even]);
//             },
//         )(e);
//     }),
//     A.reduce<Either<string[], number[]>, These<string[], number[]> >(right<string[], number[]>([]), theseStrNumSemiGroup.concat),
//     mapThese((numList: number[]): number => {
//         return numList[0] ?? 0;
//     }),
// );


// const a = A.reduce< Either<number, number>, These<number[], number[]> >(right<number[], number[]>([]), theseEitherSemiGroup.concat);
// const foldMapTheseList = foldMapThese(theseEitherSemiGroup.concat);

const theseStrNumResult = pipe(
    numberListE,
    
    // A.chain((e: Either<number, number>) => {
    //     const a = foldMapE(arrayNumMonoid)((num: number) => [num]);
    //     return a(e);
    // }),
    
    // A.sequence(theseEitherSemiGroup),
    
    A.map(fold(
        (lValue) => {
            return left<string[], number[]>([lValue]);
        },
        (rValue) => {
            return right<string[], number[]>([rValue]);
        },
    )),
    
    A.reduce< Either<string[], number[]>, These<string[], number[]> >(right<string[], number[]>([]), theseEitherSemiGroup.concat),
    
    // A.map((e: Either<number, number>): Either<string[], number[]> => {
    //     return fold(
    //         (odd: number) => {
    //             return left<string[]>([''+odd]);
    //         },
    //         (even: number) => {
    //             return right<string[], number[]>([even]);
    //         },
    //     )(e);
    // }),
    
    // // A.reduce<Either<number[], number[]>, These<number[], number[]> >(right<number[], number[]>([]), theseNumSemiGroup.concat),
    // mapThese((numList: number[]): number => {
    //     return numList[0] ?? 0;
    // }),
    
    // bimapThese(
    //     (l: number[]) => {
    //         return l;
    //     },
    //     (numList: number[]): number => {
    //         return numList[0] ?? 0;
    //     },
    // ),
);

console.log(`theseStrNumResult=`, theseStrNumResult);



// function getValidatorFn(fnList: Array<IValidationFn> ) {
//     // return function validatePassword(s: string): Either<string[], string> {
//     return function validatePassword(s: string)/*: Either<string[], string[]>*/ {
//         // const result = pipe(
//         //     s,
//         //     A.f
//         //     map(fnList),
//         // );
//        
//         // const seqTArray = sequenceT(A.Applicative);
//         // const a = seqTArray(fnList);
//         // console.log(`a=`, a);
//        
//         const result = pipe(
//             fnList,
//             A.ap([s]),
//            
//             // A.reduce<Either<string, string>, Either<string[], string[]>>(right<string[], string[]>([]), (acc, e) => {
//             //     const result = fold(
//             //         (l1: string[]): Either<string[], string[]> => {
//             //             return fold(
//             //                 (l2: string) => {
//             //                     return left<string[], string[]>(l1.concat(l2));
//             //                 },
//             //                 () => {
//             //                     return left<string[], string[]>(l1);
//             //                 },
//             //             )(e);
//             //         },
//             //         (r1: string[]): Either<string[], string[]> => {
//             //             return fold(
//             //                 (l2: string) => {
//             //                     return left<string[], string[]>([l2]);
//             //                 },
//             //                 (r2: string) => {
//             //                     return right<string[], string[]>(r1.concat(r2));
//             //                 },
//             //             )(e);
//             //         }
//             //     )(acc);
//             //
//             //     return result;
//             // }),
//            
//             A.map((e: Either<string, string>): Either<string[], string[]> => {
//                 return fold(
//                     (lStr: string) => {
//                         return left<string[], string[]>([lStr]);
//                     },
//                     (rStr: string) => {
//                         return right<string[], string[]>([rStr]);
//                     },
//                 )(e);
//             }),
//             // A.reduce<Either<string[], string[]>, These<string[], string[]> >(right<string[], string[]>([]), (acc, e) => {
//             //     return theseSemiGroup.concat(acc, e);
//             // }),
//    
//             /**
//              * YAYAYAYAYAY
//              * 
//              * It's possible to map from `Either<E, A>[]` to `Either<E, A[]>`
//              * or (in this case) `These<E[], A[]>` by using `SemiGroup.concat`
//              * 
//              * The important step is above where we have to map from `Either<E, A>[]` to `Either<E[], A[]>[]` (see `A.map()` above)
//              * which then lets us concat them back to the expected `These<E[], A[]>`
//              */
//             A.reduce<Either<string[], string[]>, These<string[], string[]> >(right<string[], string[]>([]), theseStrSemiGroup.concat),
//            
//             // /**
//             //  * A manually written version of These's `SemiGroup.concat`
//             //  * 
//             //  * Acts like `SemiGroup.concat()`
//             //  * 
//             //  * See: `fp-ts/These.ts` `getSemigroup()`
//             //  */
//             // A.reduce<Either<string, string>, These<string[], string[]>>(right<string[], string[]>([]), (acc, e) => {
//             //     const result = foldT(
//             //         (l1: string[]): These<string[], string[]> => {
//             //             return fold(
//             //                 (l2: string) => {
//             //                     return left<string[], string[]>(l1.concat(l2));
//             //                 },
//             //                 (r2: string) => {
//             //                     return both<string[], string[]>(l1, [r2]);
//             //                 },
//             //             )(e);
//             //         },
//             //         (r1: string[]): These<string[], string[]> => {
//             //             return fold(
//             //                 (l2: string) => {
//             //                     return both<string[], string[]>([l2], r1);
//             //                 },
//             //                 (r2: string) => {
//             //                     return right<string[], string[]>(r1.concat(r2));
//             //                 },
//             //             )(e);
//             //         },
//             //         (l1: string[], r1: string[]): These<string[], string[]> => {
//             //             return fold(
//             //                 (l2: string) => {
//             //                     return both<string[], string[]>(l1.concat(l2), r1);
//             //                 },
//             //                 (r2: string) => {
//             //                     return both<string[], string[]>(l1, r1.concat(r2));
//             //                 },
//             //             )(e);
//             //         },
//             //     )(acc);
//             //
//             //     return result;
//             // }),
//            
//            
//             // A.ap([(a) => {
//             //     console.log(`a=`, a);
//             //     return a;
//             // }]),
//             //
//             // A.chain((a) => {
//             //     console.log(`a=`, a);
//             //     return [a];
//             // }),
//            
//             // chainE((a) => {
//             //     return right(a);
//             // }),
//             // applicativeValidation.,
//            
//         );
//        
//         // const result = fnList.map(fn => fn(s));
//         return result;
//     };
// }
//
//
// /**
//  * Get a validation function
//  */
// const validator = getValidatorFn([
//     minLength,
//     oneCapital,
//     oneNumber,
// ]);
//
// const result = validator('tester');
// console.log(`result=`, result);
