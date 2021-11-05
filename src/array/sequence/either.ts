/**
 * https://rlee.dev/writing/practical-guide-to-fp-ts-part-5
 */
import * as A from 'fp-ts/lib/Array';
import * as Ap from 'fp-ts/lib/Apply'
import * as E from 'fp-ts/lib/Either';
import * as f from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';


/**
 * either:
 */
describe('either:', function(){
    
    
    const arr: Array< E.Either<string, number> > = [1, 2, 3].map(x => E.of<string, number>(x));
    const arrInvalid: Array< E.Either<string, number> > = [1, 2, 3].map(x => (x < 3) ? E.right(x) : E.left(`Invalid value: ${x}`));
    
    /**
     * Array.sequence:
     */
    describe('Array.sequence:', function(){
        
        it('converts an array of eithers into an either with array (right)', function(){
            // Convert an array of eithers to an either with array
            const result: E.Either< string, Array<number> > = A.array.sequence(E.either)(arr);
            console.log(`result=`, result);
        });
        
        
        it('converts an array of eithers into an either with array (left)', function(){
            // convert an array of eithers to an either with array
            const resultInvalid: E.Either< string, Array<number> > = A.array.sequence(E.either)(arrInvalid);
            console.log(`resultInvalid=`, resultInvalid);
        });
        
        
        it('convert array of eithers with E.sequenceArray', function(){
            const result3 = E.sequenceArray(arr);
            console.log(`result3=`, result3);
        });
        
    });
    // End of 'Array.sequence:'.
    
    
    /**
     * E.traverse:
     */
    describe('E.traverse:', function(){
        
        it('picks the head of Array<Either> and converts it to a single Option<Either>', function(){
            const result: E.Either< string, Array<number> > = A.array.sequence(E.either)(arr);
            
            /* Either<> - NOTE: the result is wrapped */
            const result4 = E.traverse(O.option)(A.head)(result);
            console.log(`result4=`, result4);
            
        });
        
    });
    // End of 'E.traverse:'.
    
    
    /**
     * E.sequenceArray:
     */
    describe('E.sequenceArray:', function(){
        
        type Errors = Array<string>;
        type Validation<A> = E.Either<Errors, A>;
        
        
        it('a', function(){
            /**
             * Simulate io-ts codec validation processing
             *
             * Array< Either<string[], A> > => Either<string[], A[]> (or possibly `Either<string[][], A[]>`)
             */
            const sourceValid: Validation<number>[] = [
                E.of(1),
                E.of(2),
                E.of(3),
            ];
            const result5 = f.pipe(
                sourceValid,
                E.sequenceArray,
            );
            console.log(`5. (io-ts: Array<Either<E[], A>> => right(A[])) result5=`, result5);
        });
        
        
        it('b', function(){
            /*
            `E.sequenceArray()` will correctly flip `Array< Either<> >` to `Either<E, A[]>`
            BUT NOTE: We will only have a single left result value (i.e. we stop after the first `left` value)
            */
            const sourceInvalid: Validation<number>[] = [
                E.of(1),
                E.of(2),
                E.left(['Invalid value 1']),
                E.of(3),
                E.left(['Invalid value 2']),
            ];
            const result6 = f.pipe(
                sourceInvalid,
                E.sequenceArray,
            );
            console.log(`6. (io-ts: Array<Either<E[], A>> => left(E[])) result6=`, result6);
        });
        
        
        it('c', function(){
            /*
            Try using `E.validation` to return a list of lefts.
            */
            
            /*
            NOTE: Define the monoid for the **left** type
            
            `A.sequence()` automatically determines the **right** type as an array of rights
            
            `getValidationSemigroup()` defines the
            */
            // how to collect a nested list of lefts `A.of()`
            
            // // Concatenate (and flatten) so `Array<left[]>` will be flattened to => `Array<left>`
            // const lValidation = E.getValidation(A.getMonoid<string>());
            
            // // Custom SemiGroup that keeps nested lists
            // const lValidation = E.getValidation({concat: (a, b) => [a, b]});
            
            const lValidation = E.getApplicativeValidation(A.getMonoid<string>());
            
            const sourceInvalid2: Validation<number>[] = [
                E.of(1),
                E.of(2),
                E.left(['Invalid value 1']),
                E.of(3),
                E.left(['Invalid value 2']),
            ];
            const result7 = f.pipe(
                sourceInvalid2,
                A.sequence(lValidation),
            );
            console.log(`7. (io-ts: Array<Either<E[], A>> => left(E[])) result7=`, result7);
        });
        
        
        /**
         * sequence:
         */
        describe('sequence:', function(){
            
            it('right', function(){
                const responseProductDetailsE: Array< E.Either<number, string> > = [
                    E.of('a'),
                    E.of('b'),
                ];
                
                const lValidation = E.getApplicativeValidation(A.getMonoid<number>());
                
                const result = f.pipe(
                    responseProductDetailsE,
                    A.map(E.mapLeft(A.of)),
                    
                    A.sequence(lValidation),
                );
                expect(result).toEqual( E.right(['a', 'b']) );
                console.log(`result=`, result);
            });
            
            
            it('left', function(){
                const responseProductDetailsE: Array< E.Either<number, string> > = [
                    E.right<number, string>(''),
                    E.left<number, string>(-1),
                    E.left<number, string>(-2),
                ];
                
                // const lValidation = E.getApplicativeValidation(A.getMonoid<number>());
                
                // // Concatenate (and flatten) so `Array<left[]>` will be flattened to => `Array<left>`
                // const lValidation = E.getValidationSemigroup(A.getMonoid<number>(), A.getMonoid<string>());
                
                // // // Custom SemiGroup that keeps nested lists
                // const lValidation = E.getValidation({concat: (a, b) => [a, b]});
                
                // // lValidation
                const lValidation = E.getValidation(A.getMonoid<number>());
                
                const result = f.pipe(
                    responseProductDetailsE,
                    A.map(E.mapLeft(A.of)),
                    A.sequence(lValidation),
                );
                expect(result).toEqual( E.left([-1, -2]) );
                console.log(`result=`, result);
            });
            
            
        });
        // End of 'sequence:'.
        
    });
    // End of 'E.sequenceArray:'.
    
    
    /**
     * A.traverse:
     */
    describe('A.traverse:', function(){
        
        
        /**
         * CFH: The confusing part for me is that it's the left E type needs to be wrapped/
         * converted to `E[]` in order to be valid, but the right A type does not,
         * and is automatically converted to an array type by the `A.traverse()` function.
         *
         * I feel like the A.sequence()/A.traverse() function should take a function
         * that returns `E.Either<E, A>` and automatically convert it to `E.Either<E[], A[]>`
         * BUT REMEMBER, that is not the case. We need to traverse/mapLeft the `E` type to `E[]`
         * before we can use the Either validation types to collect/concat to a list of `E` types.
         */
        it('right 1 - verbose - A.traverse', function(){
            const lValidation = E.getApplicativeValidation(A.getMonoid<number>());
            
            const ids: Array< number | string > = [
                'a',
                'b',
            ];
            
            const result = f.pipe(
                ids,
                
                /*
                We need to sort out two things for the `lValidation` traversal:
                    - convert `A` => `E.right<A>` on the right-hand side
                      - Note that `A.traverse()` is responsible for handling the Array conversion on the right side.
                      - i.e. we just return a `E.right<A>` and `A.traverse(lValidation)(...)` will handle the conversion
                        of *that* result into `E.right<A[]>` for us.
                        
                    - but on the left, we need to sort out *both* conversions: `number` => `E.left<number[]>`
                      - `number` to `number[]` *and* wrapping it in `E.left<number[]>`
                      - that is why the return type signature is "lopsided" as `E.Either<number[], string>`
                      - the array traversal already handles the conversion of `string` to `string[]` on the right-hand side
                
                `A.traverse(applicative)(ourFunction)`
                
                NOTE: For traversal over Eithers, the most important thing is that the `E.left<E>` type matches
                the `applicative` type.
                
                i.e. in this example the applicative is `lValidation` and the E type is `E.left<number[]>`
                so `ourFunction` *must* return a `E.left<number[]>` (not just number or a `E.left<number>`, must be an array)
                
                */
                A.traverse(lValidation)(
                    (value: string | number): E.Either<number[], string> => {
                        if (typeof value === 'string'){
                            return E.right(value);
                        } else {
                            return E.left([value]);
                        }
                    }
                ),
            );
            expect(result).toEqual( E.right(['a', 'b']) );
            console.log(`result=`, result);
        });
    
    
        /**
         * This is the same as example 1 above, but maps to Either first, to make the traversal simpler.
         * But note that this does two iterations over the list of items (one for the map, and the second for the traversal).
         */
        it('right - 2 - A.map, A.traverse, E.mapLeft', function(){
            const lValidation = E.getApplicativeValidation(A.getMonoid<number>());
            
            const ids: Array< number | string > = [
                'a',
                'b',
            ];
    
            /**
             * This is effectively the same as example 1 above, except we map
             * the values to `number | string` => `Either<number, string>` first,
             * and then do the traversal.
             *
             * The difference in the traversal in this version is that, since the
             * values coming in are already `Either`s then we only have to manage
             * converting the `E.left<number>` values to `E.left<number[]>` values.
             *
             * As noted in example 1, `A.traverse()` automatically handles the conversion
             * of `E.right<string`> into `E.right<string[]>` so we don't have to do it manually here.
             *
             * Note: this does two maps/iterations over the elements, compared to a single iteration in example 1.
             * We first map to Either, and then do the traversal.
             */
            const result = f.pipe(
                ids,
                
                A.map((value: string | number): E.Either<number, string> => {
                    if (typeof value === 'string'){
                        return E.right(value);
                    } else {
                        return E.left(value);
                    }
                }),
                
                /*
                `A.traverse()` already handles the right side,
                so we just need to handle the left side conversion
                from `E.left<number>` to `E.left<number[]>`
                */
                A.traverse(lValidation)(
                    E.mapLeft((num) => [num])
                ),
                
                /*
                This is exactly the same as the code immediately above.
                `E.mapLeft((num) => [num])` is the same as `E.mapLeft(A.of)`
                
                A.traverse(lValidation)(
                    E.mapLeft(A.of)
                ),
                */
            );
            expect(result).toEqual( E.right(['a', 'b']) );
            console.log(`result=`, result);
        });
        
        
        // it('right - 3', function(){
        //     const lValidation = E.getApplicativeValidation(A.getMonoid<number>());
        //
        //     const ids: Array< number | string > = [
        //         'a',
        //         'b',
        //     ];
        //
        //     const result = f.pipe(
        //         ids,
        //         A.traverse(lValidation)((): E.Either<number[], string> => {
        //             // E.mapLeft(A.of)
        //         }),
        //     );
        //     expect(result).toEqual( E.right(['a', 'b']) );
        //     console.log(`result=`, result);
        // });
        
        
        it('left', function(){
            const ids: Array< string | number > = [
                'a',
                'b',
                -1,
                -2,
            ];
            
            const lValidation = E.getApplicativeValidation(A.getMonoid<number>());
            
            const result = f.pipe(
                ids,
                A.traverse(lValidation)(
                    f.flow(
                        (value: string | number): E.Either<number, string> => {
                            if (typeof value === 'string'){
                                return E.right(value);
                            } else {
                                return E.left(value);
                            }
                        },
                        E.mapLeft(A.of),
                    )
                ),
            );
            expect(result).toEqual( E.left([-1, -2]) );
            console.log(`result=`, result);
        });
        
        
    });
    // End of 'A.traverse:'.
    
    
    /**
     * double traverse:
     */
    describe('double traverse:', function(){
        
        it('Either-to-array-and-back', function(){
            
            const ids: Array< string | number > = [
                'a',
                'b',
            ];
            
            const lValidation = E.getApplicativeValidation(A.getMonoid<number>());
            
            const result = f.pipe(
                ids,
                A.traverse(lValidation)(
                    f.flow(
                        (value: string | number): E.Either<number, string> => {
                            if (typeof value === 'string'){
                                return E.right(value);
                            } else {
                                return E.left(value);
                            }
                        },
                        E.mapLeft((num) => [num]),
                    )
                ),
            );
            expect(result).toEqual( E.right(['a', 'b']) );
            console.log(`result=`, result);
        });
        
    });
    // End of 'double traverse:'.
    
    
    /**
     * nested array, either, array:
     * 
     * Handle traversing a list of eithers, each containing lists in the E, A position:
     *      `Array< Either<E[], A[]> >` => `Either<E[], A[]>`
     */
    describe('nested array, either, array:', function(){
        
        it('merges nested rights inside eithers (right)', function(){
            
            const rValidation = E.getSemigroup( A.getMonoid< number >() );
            const lValidation = E.getApplicativeValidation(A.getMonoid< string >());
            
            
            const inData: Array< E.Either<string[], number[]> > = [
                E.right<string[], number[]>([1, 3, 5]),
                E.right<string[], number[]>([2, 4, 6]),
            ];
    
            /**
             * E.Either<string[], number[]>
             *     
             * Expected result:
             *     E.right([1, 3, 5, 2, 4, 6])
             */
            const result = f.pipe(
                inData,
                
                (a) => {
                    return a;
                },
    
                /**
                 * 2021-08-19
                 * Just using `A.sequence(lValidation)` doesn't give us the expected results
                 * on the right side.
                 * 
                 * This unwraps the Either from the right side, and wraps the result in an array
                 * so we get `E.right([ [1, 3, 5], [2, 4, 6] ])` instead of a single combined list.
                 * 
                 * I'm not sure which combination we'd need for that - ask on stackoverflow?
                 */
                // A.sequence(lValidation),
                
                /**
                 * 2021-08-19
                 * CFH - this combination of `A.sequence, E.map(A.flatten)` gives us
                 * the result we want, but it's not very clear and I'm not happy with it.
                 */
                A.sequence(lValidation),
                E.map(A.flatten),
            );
            
            console.log(`(!!!) result=`, result);
            
            expect(result).toEqual(
                { _tag: 'Right', right: [ 1, 3, 5, 2, 4, 6 ] }
            );
            
            /*
            What we end up with when we just use: A.sequence(lValidation),
            */
            // expect(result).toEqual(
            //     { _tag: 'Right', right: [ [1, 3, 5], [2, 4, 6] ] }
            // );
        });
        
        
        it('merges nested lefts inside eithers (left)', function(){
            
            
            const lValidation = E.getApplicativeValidation(A.getMonoid< string >());
            
            const lValidation2 = E.getValidation( A.getMonoid< string >() );
            
            
            const inData: Array< E.Either<string[], number[]> > = [
                E.left<string[], number[]>(['z', 'x']),
                E.right<string[], number[]>([1, 3, 5]),
                E.left<string[], number[]>(['a', 'b']),
            ];
    
            /**
             * E.Either<string[], number[]>
             *     
             * Expected result:
             *     E.left(['z', 'x', 'a','b'])
             */
            const result = f.pipe(
                inData,
                
                (a) => {
                    return a;
                },
                
                // A.sequence(lValidation),
                A.sequence(lValidation2),
                // E.sequenceArray,
                
                // A.traverse(lValidation)( rMerge ),
                // A.traverse( A.get )(  ),
            );
            
            console.log(`(!!!) result=`, result);
            
            expect(result).toEqual(
                { _tag: 'Left', left: [ 'z', 'x', 'a', 'b' ] }
            );
        });
        
    });
    // End of 'nested array, either, array:'.
    
    
});
// End of 'either:'.


//==============================================================
