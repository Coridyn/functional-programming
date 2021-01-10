/**
 * https://paulgray.net/the-state-monad/
 */
import { pipe, flow } from 'fp-ts/function';
import { state, State, map as mapS, chain as chainS } from 'fp-ts/State';
import { sequenceT, sequenceS } from 'fp-ts/Apply';



export type Random<A> = State<number, A>;

const MOD_VALUE = 8239451023;


/**
 * Take a starting seed value and return a random number (and some state for
 * generating the next random number)
 */
export const randomNumber: Random<number> = (seed: number) => {
    const nextSeed = (1839567234 * seed + 972348567) % MOD_VALUE;
    return [nextSeed, nextSeed];
}


/**
 * Try to implement our own version of `map` for State
 * 
 * Take a function from `a => b` and return a function that takes a 
 * `State<E, A>` and returns `State<E, B>`
 */
function ourMap<A, B>(f: (a: A) => B): <E>(fa: State<E, A>) => State<E, B> {
    // f's type is (a: A) => B
    // generate's type is (s: E) => [A, E]
    // seed's type is E
    
    return (generate) => {
        return (seed) => {
            
            const [a, nextSeed] = generate(seed);
            return [f(a), nextSeed];
        }
    };
}


/**
 * Version from: https://paulgray.net/the-state-monad/
 */
const map: <A, B>(f: (a: A) => B) => <S>(fa: State<S, A>) => State<S, B> =
  (f) => (generate) => (seed) => {
    // // f's type is (a: A) => B
    // // generate's type is (s: E) => [A, E]
    // // seed's type is E
    //
    // // we need to return a [B, E]
    // const [a, nextSeed] = generate(seed);
    // const result: [B, S] = [f(a), nextSeed];
    // return result;
      
    const [a, nextSeed] = generate(seed)
    return [f(a), nextSeed];
  }


/**
 * 1. Generate a random number within the specified range
 * 
 * NOTE: This function returns a State generator, not a random number itself.
 * 
 * i.e. it is not equivalent to the `randomNumber` function above - instead
 * it returns a *new function* which is equivalent to `randomNumber()`
 */
export function randomInRangeGenerator(max: number, min: number = 0): Random<number> {
    /*
    Take an `a` and return `b` to make State<E, A> to State<E, B>
     - straightfoward, map an `a` to `b` in the lifted context of State
    
    const mapS: <A, B>(f: (a: A) => B) => <E>(fa: State<E, A>) => State<E, B>
    */
    
    function inRange(num: number): number {
        const clampedValue = min + Math.floor((num / MOD_VALUE) * (max - min));
        return clampedValue;
    }
    
    // const resultFn = mapS(inRange)(randomNumber);
    const resultFn = ourMap(inRange)(randomNumber);
    return resultFn;
}

/**
 * 2. Use `pipe` to implement the randomInRange state generator
 */
export function randomInRange2(max: number, min: number = 0): Random<number> {
    /*
    Take an `a` and return `b` to make State<E, A> to State<E, B>
     - straightfoward, map an `a` to `b` in the lifted context of State
    
    const mapS: <A, B>(f: (a: A) => B) => <E>(fa: State<E, A>) => State<E, B>
    */
    
    function inRange(num: number): number {
        const clampedValue = min + Math.floor((num / MOD_VALUE) * (max - min));
        return clampedValue;
    }
    
    const resultFn = pipe(
        randomNumber,
        mapS(inRange),
    );
    
    return resultFn;
}


/**
 * 
 */
export function randomName(nameList: string[]): Random<string> {
    const rndInRangeFn = randomInRangeGenerator(0, nameList.length);
    const randomNameFn = pipe(
        rndInRangeFn,
        mapS((index: number) => {
            return nameList[index];
        })
    );
    return randomNameFn;
}


/**
 * 
 */
export function randomName2(nameList: string[]): Random<string> {
    const randomNameFn = pipe(
        randomInRangeGenerator(0, nameList.length),
        mapS((index: number) => (nameList[index])),
    );
    return randomNameFn;
}


/**
 * 
 */
export function randomName3(nameList: string[]): Random<string> {
    const randomNameFn = randomItemInList(nameList);
    return randomNameFn;
}


/**
 * Generalised function to select a random item from a list
 */
export function randomItemInList<T>(list: T[]): Random<T> {
    return pipe(
        randomInRangeGenerator(0, list.length),
        mapS((index: number) => list[index])
    );
}


/**
 * Composition
 */


/**
 * NOTE: This is *NOT* a generator function
 */
export function randomFullname(
    randomFirstname: Random<string>,
    randomLastname: Random<string>
): Random<string> {
    
    const randomFullnameFn = pipe(
        sequenceT(state)(randomFirstname, randomLastname),
        mapS(( args ) => {
            const [first, last] = args;
            return `${first} ${last}`;
        }),
    );
    return randomFullnameFn;
}


/**
 * sequenceT (operates on Arrays/tuples)
 */
const randomBool: Random<boolean> = randomItemInList([true, false]);
const randomString: Random<string> = randomItemInList(['a', 'b', 'c', 'd']);
// const randomCount: Random<number> = randomItemInList([1]);
const randomCount: Random<number> = randomNumber;

export const randoms: State<number, [boolean, string, number]> = sequenceT(state)(randomBool, randomString, randomCount);


/**
 * chain
 * Use the result from one state to feed into subsequent states
 */

`
Let's assume that we want each user to have a favorite sports team, but we also want each of 
the sports to have equal distribution among users. Since we have more hockey teams than football 
teams, we can’t put them all into the same pool. What we’ll do is first generate a random boolean, 
then, if the value is true, we’ll pick a hockey team, but if it's false, we'll pick a football team:
`;

const randomHockeyTeamFn = randomItemInList(['H: Maple Leafs', 'H: Canadiens', 'H: Flyers', 'H: Bruins']);
const randomFootballTeamFn = randomItemInList(['F: Steelers', 'F: Eagles', 'F: Jaguars',]);


export const randomBoolFn: Random<boolean> = pipe(
    randomInRangeGenerator(0, 2),
    map(n => n === 1)
);

export const randomTeamGetterFn: Random< Random<string> > = pipe(
    randomBoolFn,
    mapS((bool) => {
        return bool ? randomHockeyTeamFn : randomFootballTeamFn;
    }),
);

export const randomTeamFn: Random<string> = pipe(
    randomBoolFn,
    // chainS((bool) => {
    ourChain((bool) => {
        return bool ? randomHockeyTeamFn : randomFootballTeamFn;
    }),
);


/*
implement our own version of chain

chain is `lift` lift an A and return a `State<S, B>`
*/
export function ourChain<S, A, B>(f: (a: A) => State<S, B>): (fa: State<S, A>) => State<S, B> {
    return (generate) => {
        return (seed) => {
            const [a, seed2] = generate(seed);
            const [b, seed3] = f(a)(seed2);
            return [b, seed3]
        };
    };
}
