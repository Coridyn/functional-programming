import { left, right, chain, map, Either } from 'fp-ts/Either';

const doChain = chain((value: number): Either<number, number> => {
    console.log(`(eitherChain) value=`, value);
    return right(value);
});

console.log(`run right`);
doChain( right(1) );

console.log(`run left`);
doChain( left(1) );
