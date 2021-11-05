import { pipe, identity } from 'fp-ts/lib/function';
import * as A from 'fp-ts/lib/Array';
import * as TE from 'fp-ts/lib/TaskEither';
import * as T from 'fp-ts/lib/Task';
import * as E from 'fp-ts/lib/Either';


/**
 * TaskEither:
 */
describe('TaskEither:', function(){
    
    function fromPromise<T, E = null>(p: Promise<T>): TE.TaskEither<E, T> {
        return TE.tryCatch(
            () => p,
            () => null,
        );
    }
    
    // // function fromPromise<T, E = null>(pFn: () => Promise<T>): TE.TaskEither<E, T> {
    // function fromPromise<E, T>(pFn: () => Promise<T>): () => TE.TaskEither<E, T> {
    //     return TE.tryCatchK(
    //         pFn,
    //         () => null,
    //     );
    // }
    
    // function tryCatch2<T, E = null>(p: Promise<T>): TE.TaskEither<E, T> {
    //     return TE.tryCatch(
    //         () => p,
    //         () => null,
    //     );
    // }
    
    
    
    // /**
    //  * tryCatch:
    //  */
    // describe('tryCatch:', function(){
    //    
    //     /*
    //     pipe(
    //         TE.tryCatch(
    //             () => {
    //                 return Promise.resolve(5);
    //             },
    //             (err) => {
    //                 return err;
    //             }
    //         ),
    //         TE.map((value: number) => {
    //            
    //         }),
    //     );
    //     */
    //    
    // });
    // // End of 'tryCatch:'.
    
    
    /**
     * with promises:
     */
    describe('with promises:', function(){
        
        it('pipe', function(done){
            
            function nullToLeft(result){
                if (result == null){
                    return TE.left(null);
                } else {
                    return result;
                }
            }
            
            const a = pipe(
                // TE.tryCatch(
                //     () => {
                //         // return Promise.resolve(1);
                //         return Promise.resolve(null)
                //             .then(nullToLeft);
                //     },
                //     () => {
                //         // convert reject to E type
                //         return null;
                //     },
                // ),
                TE.fromTask(() => {
                    // return Promise.resolve(1);
                    return Promise.resolve(null)
                        .then(nullToLeft);
                }),
                TE.orElse(() => {
                    // return TE.right(2);
                    return TE.fromTask(() => Promise.resolve(2));
                }),
                
                // 
            );
            
            const result = a();
            result.then((value) => {
                // expect(result).toEqual(TE.right(1));
                expect(value).toEqual(null);
            });
        });
        
    });
    // End of 'with promises:'.
    
    
    it('reduces list of TaskEithers', function(done){
        // Change this value to affect the test outcome
        const VALID_VALUE = 2;
        
        const inList = [1, 2, 3];
        
        function fromNumber(value: number): Promise<number> {
            if (value >= VALID_VALUE){
                return Promise.resolve(value);
            } else {
                return Promise.reject(null);
            }
        }
        
        const resultFn = pipe(
            inList,
            A.map((value) => {
                return () => {
                    return fromPromise(fromNumber(value));
                };
                // return fromPromise<null, number>(() => {
                //     return fromNumber(value);
                // });
            }),
            
            A.reduce(TE.left<null, number>(null), (acc: TE.TaskEither<null, number>, item) => {
                const newAcc = pipe(
                    acc,
                    TE.orElse(item)
                );
                return newAcc;
            }),
        );
        
        console.log(`resultFn=`, resultFn);
        
        resultFn()
            .then((result) => {
                expect(result).toEqual(true);
                done();
            });
    });
    
    
    /**
     * 
     */
    it('handles pipeline of values', function(done){
        // Change this value to affect the test outcome
        const VALID_VALUE = 2;
        
        function fromNumber(value: number): Promise<number> {
            if (value >= VALID_VALUE){
                return Promise.resolve(value);
            } else {
                return Promise.reject(null);
            }
        }
        
        // const a = TE.tryCatch(
        //     () => {
        //         console.log(`(tryCatch)`);
        //         return fromNumber(1);
        //     },
        //     () => null,
        // );
        // a().then((a) => {
        //     console.log(`a=`, a);
        //     done();
        // });
        
        
        const resultFn = pipe(
            TE.tryCatch(
                () => {
                    return fromNumber(1);
                },
                () => null,
            ),
            
            TE.orElse(() => {
                return fromPromise(fromNumber(2));
                
                // return fromPromise<null, number>(() => {
                //     return fromNumber(1);
                // })
            }),
            
            // TE.orElse(() => {
            //     return fromPromise(fromNumber(3));
            // }),
        );
        
        
        console.log(`resultFn=`, resultFn);
        
        resultFn()
            .then((result) => {
                expect(result).toEqual(true);
                done();
            });
    });
    
    
    /**
     * tryCatch:
     */
    describe('tryCatch:', function(){
        
        it('tryCatch is lazy and returns function', function(done){
            
            let didRun = false;
            const result = TE.tryCatch(
                () => {
                    didRun = true;
                    return Promise.resolve(1);
                },
                () => null,
            );
            
            expect(result).toEqual(expect.any(Function));
            expect(didRun).toEqual(false);
            done();
        });
        
        
        it('tryCatch invokes function, returns promise that resolves with Either', function(done){
            
            let didRun = false;
            const result = TE.tryCatch(
                () => {
                    didRun = true;
                    return Promise.resolve(1);
                },
                () => null,
            );
            
            result()
                .then((value: E.Either<null, number>) => {
                    expect(value).toEqual(E.right(1));
                    expect(didRun).toEqual(true);
                    done();
                });
        });
        
    });
    // End of 'tryCatch:'.
    
});
// End of 'TaskEither:'.
