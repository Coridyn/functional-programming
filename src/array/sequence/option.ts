/**
 * https://rlee.dev/writing/practical-guide-to-fp-ts-part-5
 */
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';

// // Convert an array of options to an option with array
// const arr: Array< O.Option<number> > = [1, 2, 3].map(O.of);
// const result: O.Option< Array<number> > = A.array.sequence(O.option)(arr);
// console.log(`result=`, result);


// Convert an array of options to an option with array
const arr: Array< O.Option<number> > = [1, 2, 3].map(x => (x < 3) ? O.some(x) : O.none);
const result: O.Option< Array<number> > = A.array.sequence(O.option)(arr);
console.log(`result=`, result);

