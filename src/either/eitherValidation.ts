/**
 * https://dev.to/gcanti/getting-started-with-fp-ts-either-vs-validation-5eja
 */
import { Either, left, right } from 'fp-ts/lib/Either'

import * as Ap from 'fp-ts/lib/Apply'
import { getSemigroup as getSemigroupNonEmpty, NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import { getMonoid as getMonoidArray } from 'fp-ts/lib/Array'
import * as A from 'fp-ts/lib/Array'
import {
    getSemigroup as getSemigroupEither,
    getValidationSemigroup as getValidationSemigroupEither,
    getValidation,
    map,
    mapLeft,
    fold,
} from 'fp-ts/lib/Either'

import { chain } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import { bimap } from 'fp-ts/lib/Either'



const minLength = (s: string): Either<string, string> =>
  s.length >= 6 ? right(s) : left('at least 6 characters')

const oneCapital = (s: string): Either<string, string> =>
  /[A-Z]/g.test(s) ? right(s) : left('at least one capital letter')

const oneNumber = (s: string): Either<string, string> =>
  /[0-9]/g.test(s) ? right(s) : left('at least one number')


const validatePassword = (s: string): Either<string, string> =>
  pipe(
    minLength(s),
    chain(oneCapital),
    chain(oneNumber)
  );


const result1 = validatePassword('aaaaaa');

const result2 = validatePassword('aaaaaA');

const result3 = validatePassword('aaaa1A');

console.log(`result1=`, result1);
console.log(`result2=`, result2);
console.log(`result3=`, result3);


console.log(`-------------------------------\n`);
console.log(`validatePassword2`);


const applicativeValidation = getValidation(getMonoidArray<string>());


function lift<E, A, B>(check: (a: A) => Either<E, B>): (a: A) => Either<Array<E>, B> {
  return a =>
    pipe(
      check(a),
      mapLeft(a => [a])
    )
}

const minLengthV = lift(minLength)
const oneCapitalV = lift(oneCapital)
const oneNumberV = lift(oneNumber)


function validatePassword2(s: string): Either<Array<string>, string> {
    const applicativeValidation = getValidation(getMonoidArray<string>());
    return pipe(
        // Ap.sequenceT( getValidation(getSemigroup<string>()) )(
        Ap.sequenceT( applicativeValidation )(
            minLengthV(s),
            oneCapitalV(s),
            oneNumberV(s)
        ),
        map((v) => {
            // NOTE: This is only run when successful
            console.log(`(eitherValidation) v=`, v);
            return v;
        }),
        map(() => s)
    )
}
const result4 = validatePassword2('ab');
const result5 = validatePassword2('abCd3a');
console.log(`result4=`, result4);
console.log(`result5=`, result5);
// => left(["at least 6 characters", "at least one capital letter", "at least one number"])


console.log(`-------------------------------\n`);
console.log(`validatePassword3`);


/**
 * Try using applicative for the validation functions
 *
 *
 */

/**
 * Lift validation functions from `Either<string, string>` to `Either<string[], string[]>`
 */
function lift2<E, A, B>(check: (a: A) => Either<E, B>): (a: A) => Either<Array<E>, Array<B>> {
  return a =>
    pipe(
      check(a),
      bimap(
          l => [l],
          r => [r],
      ),
    )
}


/**
 *
 */
function validatePassword3(s: string): Either<Array<string>, string> {
    
    const monoidArray = getMonoidArray<string>();
    const applicativeValidation = getValidationSemigroupEither(monoidArray, monoidArray);
    
    return pipe(
        [lift2],
        A.ap([
            minLengthV,
            oneCapitalV,
            oneNumberV,
        ]),
        A.ap([s]),
        
        A.reduce(right<string[], string[]>([]), applicativeValidation.concat),
        
        map((v) => {
            // NOTE: This is only run when successful
            console.log(`(eitherValidation) v=`, v);
            return v;
        }),
        // Replace the `right<string[]>` value with just the valid string
        map(() => s)
    )
}


/**
 *
 */
function VERSION_2(){
    return function validatePassword3(s: string): Either<Array<string>, string> {
        
        const monoidArray = getMonoidArray<string>();
        const applicativeValidation = getValidationSemigroupEither(monoidArray, monoidArray);
        
        const minLengthV2 = lift2(minLength)
        const oneCapitalV2 = lift2(oneCapital)
        const oneNumberV2 = lift2(oneNumber)
        
        return pipe(
            [
                minLengthV2,
                oneCapitalV2,
                oneNumberV2,
            ],
            A.ap([s]),
            
            A.reduce(right<string[], string[]>([]), applicativeValidation.concat),
            
            // map((v) => {
            //     // NOTE: This is only run when successful
            //     console.log(`(eitherValidation) v=`, v);
            //     return v;
            // }),
            
            // Replace the `right<string[]>` value with just the valid string
            map(() => s)
        )
    }
}


function VERSION_1(){
    return function validatePassword3(s: string): Either<Array<string>, string> {
        
        const monoidArray = getMonoidArray<string>();
        const applicativeValidation = getValidationSemigroupEither(monoidArray, monoidArray);
        
        const minLengthV = lift(minLength);
        const oneCapitalV = lift(oneCapital);
        const oneNumberV = lift(oneNumber);
        
        return pipe(
            [
                minLengthV,
                oneCapitalV,
                oneNumberV,
            ],
            A.ap([s]),
            
            A.map(fold(
                (l: string[]) => {
                    return left<string[], string[]>(l);
                },
                (r: string) => {
                    return right<string[], string[]>([r]);
                },
            )),
            
            A.reduce(right<string[], string[]>([]), applicativeValidation.concat),
            
            map((v) => {
                // NOTE: This is only run when successful
                console.log(`(eitherValidation) v=`, v);
                return v;
            }),
            
            // Replace the `right<string[]>` value with just the valid string
            map(() => s)
        )
    }
}


/**
 *
 */
function VERSION_0(){
    return function validatePassword3(s: string): Either<Array<string>, string> {
        
        const minLengthV = lift(minLength);
        const oneCapitalV = lift(oneCapital);
        const oneNumberV = lift(oneNumber);
        
        return pipe(
            [
                minLengthV,
                oneCapitalV,
                oneNumberV,
            ],
            A.ap([s]),
            
            A.map(fold(
                (l: string[]) => {
                    return left<string[], string[]>(l);
                },
                (r: string) => {
                    return right<string[], string[]>([r]);
                },
            )),
            
            A.reduce<Either<string[], string[]>, Either<string[], string[]>>(right<string[], string[]>([]), (acc, e) => {
                const result = fold(
                    (l1: string[]): Either<string[], string[]> => {
                        return fold(
                            (l2: string[]) => {
                                return left<string[], string[]>(l1.concat(l2));
                            },
                            () => {
                                return left<string[], string[]>(l1);
                            },
                        )(e);
                    },
                    (r1: string[]): Either<string[], string[]> => {
                        return fold(
                            (l2: string[]) => {
                                return left<string[], string[]>(l2);
                            },
                            (r2: string[]) => {
                                return right<string[], string[]>(r1.concat(r2));
                            },
                        )(e);
                    }
                )(acc);

                return result;
            }),
            
            map((v) => {
                // NOTE: This is only run when successful
                console.log(`(eitherValidation) v=`, v);
                return v;
            }),
            
            // Replace the `right<string[]>` value with just the valid string
            map(() => s)
        )
    }
}


const result6 = validatePassword3('ab');
const result6a = validatePassword3('111111');
const result6b = validatePassword3('AAAAAA');
const result7 = validatePassword3('abCd3a');
console.log(`result6=`, result6);
console.log(`result6a=`, result6a);
console.log(`result6b=`, result6b);
console.log(`result7=`, result7);
// => left(["at least 6 characters", "at least one capital letter", "at least one number"])



console.log(`-------------------------------\n`);

/**
 * Extension - more complex types
 */

interface Person {
  name: string
  age: number
}

// Person constructor
const toPerson = ([name, age]: [string, number]): Person => ({
    name,
    age
});

const validateName = (s: string): Either<string, string> =>
    s.length === 0 ? left('Invalid name') : right(s)

const validateAge = (s: string): Either<string, number> =>
    isNaN(+s) ? left('Invalid age') : right(+s)

const validateNameV = lift(validateName);
const validateAgeV = lift(validateAge);

function validatePerson(name: string, age: string): Either<Array<string>, Person> {
    return pipe(
        Ap.sequenceT(applicativeValidation)(
            validateNameV(name),
            validateAgeV(age),
        ),
        map(toPerson)
    )
}

const result8 = validatePerson('abc', '50');
console.log(`result8=`, result8);
