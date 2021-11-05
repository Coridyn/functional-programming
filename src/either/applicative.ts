/**
 * https://dev.to/gcanti/getting-started-with-fp-ts-either-vs-validation-5eja
 */
import { Either, left, right } from 'fp-ts/lib/Either'

import * as f from 'fp-ts/lib/function';
import * as A from 'fp-ts/lib/Array';
import { sequenceT } from 'fp-ts/lib/Apply'
import { getSemigroup, NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import { getValidation, map as mapE, mapLeft } from 'fp-ts/lib/Either'

import { chain } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'


const args = [1];
const fns = [
    function(){
        console.log(`1 arguments=`, arguments);
        return true;
    },
    function(){
        console.log(`2 arguments=`, arguments);
        return false;
    },
];
// const result = A.ap(args)(fns);
function getValidator(fns: Array< (value: number) => boolean >){
    return (args: number[]) => {
        return A.ap(args)(fns);
    };
}

const result = A.ap(args)(fns);
const result2 = getValidator(fns)(args);
console.log(`result=`, result);
console.log(`result2=`, result2);

