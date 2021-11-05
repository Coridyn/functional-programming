import * as f from 'fp-ts/lib/function';
import * as Ap from 'fp-ts/lib/Apply';
import * as O from 'fp-ts/lib/Option';
import * as b from 'fp-ts/lib/boolean';
import * as R from 'fp-ts/lib/Record';
import {ap} from 'fp-ts/lib/Identity';


const sequence = R.sequence(O.Applicative);

/**
 * Example 1 - simple example using sequence.
 * The value in the record is the Applicative type (in this case, Option).
 * This gets transformed to an Option<> containing a record.
 *
 * Think of it as unwrapping each record property and rewrapping the entire record object as the result.
 *
 * `{ a: Option<A> }` => Option<{a: A }>
 */
const result = f.pipe(
    {
        a: O.some(1),
        b: O.some(2),
    },
    // R.sequence(O.Applicative),
    sequence,
);
console.log(`result=`, result);



/**
 * Example 2 - using traverse
 *
 * Record of functions, that return Option<value>.
 * Mapped to an Option< record, containing value>.
 *
 * We use `Record.traverse(Applicative type)(transformFn)`
 * to transform the record values as we traverse the record (i.e. invoke each function in the record).
 *
 * `{ a: () => Option<A> }` => `{ a: Option<A> }`
 */
const result2 = f.pipe(
    {
        a: () => {
            return O.some(1);
        },
        b: () => {
            return O.some(2);
        }
    },
    // `{ a: () => Option<A> }` => Option<{a: A }>
    R.traverse(O.Applicative)((fn) => {
        return fn();
    }),
);
console.log(`result2=`, result2);


/**
 * Example 3 - using map and sequence
 *
 * The same as example 2, but the traverse has been split up into a `map` followed by `sequence`
 *
 * `{ a: () => Option<A> }` => `{ a: Option<A> }`
 */
const result3 = f.pipe(
    // context
    
    {
        a: () => {
            return O.some(1);
        },
        b: () => {
            return O.some(2);
        }
    },
    R.map((a) => {
        return a();
    }),
    
    // `{ a: Option<A> }` => Option<{a: A }>
    R.sequence(O.Applicative),
);
console.log(`result3=`, result3);


// import { HKT } from 'fp-ts/lib/HKT';
//
//
// const a = <T extends Record<string, HKT<any, any> >> () => {
//     return () => {
//
//     };
// }


//-------------------------------


/**
 * Example 4 - using traverse and binding to some context
 */
const context = {
    z: 5,
    y: 9,
};
type IContext = typeof context;

const getValue = (key: keyof IContext) => {
    return (context: IContext) => {
        return context[key];
    };
};


const result4 = f.pipe(
    {
        a: (context: IContext) => {
            return f.pipe(
                context,
                O.fromNullableK(getValue('z')),
            );
        },
        b: (context: IContext) => {
            return f.pipe(
                context,
                O.fromNullableK(getValue('y')),
            );
        },
    },
    
    // `{ a: () => Option<A> }` => Option<{a: A }>
    R.traverse(O.Applicative)((fn) => {
        return fn(context);
    }),
);
console.log(`result4=`, result4);
