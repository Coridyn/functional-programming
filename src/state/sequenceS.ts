/**
 * https://paulgray.net/the-state-monad/
 */
import { pipe, flow } from 'fp-ts/function';
import { state, State, map as mapS, chain as chainS } from 'fp-ts/State';
import { sequenceT, sequenceS } from 'fp-ts/Apply';
import {Random, randomInRangeGenerator, randomName, randomTeamFn} from "./random";


/**
 * sequenceS (operates on *objects*)
 */

const getRandomUser = {
    name: randomName(['a', 'b', 'c', 'd']),
    age: randomInRangeGenerator(18, 100),
    favouriteTeam: randomTeamFn,
};


/*
typef getRandomUser = {
    name: Random<string>;
    age: Random<number>;
    favouriteTeam: Random<string>;
}

Usage:
*/
const seed1 = 1;
const [name, seed2] = getRandomUser.name(seed1);
const [age, seed3] = getRandomUser.age(seed2);
const [favouriteTeam, seed4] = getRandomUser.favouriteTeam(seed3);

const randomUser = {
    name,
    age,
    favouriteTeam,
};

console.log(`randomUser=`, randomUser);
console.log(`seed4=`, seed4);


/*
------------------------------------------

more useful to have:

Random<{
    name: string,
    age: number,
    favouriteTeam: string,
}>

`State` is an Applicative - we can apply functions to arguments

NOTE: That in this case the seed is passed from one function to another (just like above)
*/
type User = {
    name: string,
    age: number,
    favouriteTeam: string,
    rank: number,
};

type RandomUserProps = Pick<User, 'name' | 'age' | 'favouriteTeam'>;
type RemainingUserProps = Omit<User, keyof RandomUserProps>;

type RandomUserGenerator = {
    [K in keyof RandomUserProps]: State<number, RandomUserProps[K]>
};


const getRandomUser2 = {
    name: randomName(['a', 'b', 'c', 'd']),
    age: randomInRangeGenerator(18, 100),
    favouriteTeam: randomTeamFn,
    // other: () => 1,
};


const generateRandomUserFn: Random<RandomUserProps> = sequenceS(state)(getRandomUser2);

function fullUserFnGenerator(
    generateRandomUserFn: Random<RandomUserProps>
){
    return ( mergeValues: RemainingUserProps ) => {
        return pipe(
            generateRandomUserFn,
            mapS((user: RandomUserProps): User => {
                const newUser: User = {
                    ...user, 
                    ...mergeValues,
                };
                return newUser;
            }),
        );
    };
}

function fullUserFnGenerator2(
    generateRandomUserFn: Random<RandomUserProps>
){
    return (seed: number) => {
        return ( mergeValues: RemainingUserProps ) => {
            return pipe(
                generateRandomUserFn,
                mapS((user: RandomUserProps): User => {
                    const newUser: User = {
                        ...user, 
                        ...mergeValues,
                    };
                    return newUser;
                }),
            )(seed);
        };
    };
    
}

const [randomUser2, seed5] = generateRandomUserFn(1);
console.log(`randomUser2=`, randomUser2);
console.log(`seed5=`, seed5);

console.log(`\n------------------------------------------\n\n`);

const fullUserGetter = fullUserFnGenerator(generateRandomUserFn);
const [randomUser3, nextSeed1] = fullUserGetter({rank: 1})(1);
console.log(`randomUser3=`, randomUser3);

const fullUserGetter2 = fullUserFnGenerator2(generateRandomUserFn);
const randomUserFn2 = fullUserGetter2(1);
const [randomUser4, nextSeed2] = fullUserGetter2(1)({rank: 1});
const [randomUser5, nextSeed3] = randomUserFn2({rank: 1});
const [randomUser6, nextSeed4] = randomUserFn2({rank: 2});
console.log(`randomUser4=`, randomUser4);
console.log(`randomUser5=`, randomUser5);
console.log(`randomUser6=`, randomUser6);

console.log(`\n------------------------------------------\n\n`);
