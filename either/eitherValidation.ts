/**
 * https://dev.to/gcanti/getting-started-with-fp-ts-either-vs-validation-5eja
 */
import { Either, left, right } from 'fp-ts/lib/Either'

import { sequenceT } from 'fp-ts/lib/Apply'
import { getSemigroup, NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import { getValidation, map, mapLeft } from 'fp-ts/lib/Either'

import { chain } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'



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

const applicativeValidation = getValidation(getSemigroup<string>());


function lift<E, A, B>(check: (a: A) => Either<E, B>): (a: A) => Either<NonEmptyArray<E>, B> {
  return a =>
    pipe(
      check(a),
      mapLeft(a => [a])
    )
}

const minLengthV = lift(minLength)
const oneCapitalV = lift(oneCapital)
const oneNumberV = lift(oneNumber)


function validatePassword2(s: string): Either<NonEmptyArray<string>, string> {
    const applicativeValidation = getValidation(getSemigroup<string>());
    return pipe(
        // sequenceT( getValidation(getSemigroup<string>()) )(
        sequenceT( applicativeValidation )(
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

function validatePerson(name: string, age: string): Either<NonEmptyArray<string>, Person> {
    return pipe(
        sequenceT(applicativeValidation)(
            validateNameV(name),
            validateAgeV(age),
        ),
        map(toPerson)
    )
}

const result6 = validatePerson('abc', '50');
console.log(`result6=`, result6);
