/**
 * https://rlee.dev/writing/practical-guide-to-fp-ts-part-5
 */
import * as f from 'fp-ts/lib/function';
import * as A from 'fp-ts/lib/Array';
import * as E from 'fp-ts/lib/Either';
import * as T from 'fp-ts/lib/These';


// /**
//  * EITHER HELPERS
//  */
//
// /**
//  *
//  * @since 2.9.0
//  */
// var traverseArrayWithIndex = function <E, A, B>(f: (index: number, a: A) => E.Either<E, B>) { return function (arr: readonly A[]): E.Either<E, B[]> {
//     // tslint:disable-next-line: readonly-array
//     var result = [];
//     for (var i = 0; i < arr.length; i++) {
//         var e = f(i, arr[i]);
//         if (e._tag === 'Left') {
//             return e;
//         }
//         result.push(e.right);
//     }
//     return E.right(result);
// }; };
//
//
// var traverseArray = function<E, A, B>(f: (a: A) => E.Either<E, B>) {
//     return traverseArrayWithIndex(function (_, a: A) {
//         return f(a);
//     });
// };
//
//
// var sequenceArray: <E, A>(arr: Array<E.Either<E, A>>) => E.Either<E, Array<A>> = traverseArray(f.identity);
// // END EITHER VERSIONS

/**
 *
 * @since 2.9.0
 */
var traverseArrayWithIndex = function <E, A, B>(f: (index: number, a: A) => E.Either<E, B>) { return function (arr: readonly A[]): T.These<E[], B[]> {
    // tslint:disable-next-line: readonly-array
    var resultL = [];
    var resultR = [];
    for (var i = 0; i < arr.length; i++) {
        var e = f(i, arr[i]);
        if (e._tag === 'Left') {
            resultL.push(e.left);
        } else {
            resultR.push(e.right);
        }
    }
    
    if (resultL.length && resultR.length){
        return T.both(resultL, resultR);
    } else if (resultL.length){
        return T.left(resultL);
    } else {
        return T.right(resultR);
    }
}; };


var traverseArray = function<E, A, B>(f: (a: A) => E.Either<E, B>) {
    return traverseArrayWithIndex(function (_, a: A) {
        return f(a);
    });
};


var sequenceArray: <E, A>(arr: Array<E.Either<E, A>>) => T.These<Array<E>, Array<A>> = traverseArray(f.identity);

var traverseArray = function<E, A, B>(f: (a: A) => E.Either<E, B>) {
    return traverseArrayWithIndex(function (_, a: A) {
        return f(a);
    });
};


var sequenceArray: <E, A>(arr: Array<E.Either<E, A>>) => T.These<Array<E>, Array<A>> = traverseArray(f.identity);
// END EITHER VERSIONS


/**
 * 
 */
const arr: Array< E.Either<string, number> > = [1, 2, 3].map(x => E.of<string, number>(x));
const arrInvalid: Array< E.Either<string, number> > = [1, 2, 3].map(x => (x < 3) ? E.right(x) : E.left(`Invalid value: ${x}`));
const arrInvalidOnly: Array< E.Either<string, number> > = [3, 4, 5, 6].map(x => (x < 3) ? E.right(x) : E.left(`Invalid value: ${x}`));

// Convert an array of eithers to an either with array
const result: E.Either< string, Array<number> > = A.array.sequence(E.either)(arr);
console.log(`result=`, result);


// Convert an array of eithers to an either with array
const resultValid: T.These< Array<string>, Array<number> > = sequenceArray(arr);
const resultBoth: T.These< Array<string>, Array<number> > = sequenceArray(arrInvalid);
const resultInvalid: T.These< Array<string>, Array<number> > = sequenceArray(arrInvalidOnly);
console.log(`resultValid=`, resultValid);
console.log(`resultBoth=`, resultBoth);
console.log(`resultInvalid=`, resultInvalid);
