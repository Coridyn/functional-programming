/**
 * https://rlee.dev/writing/practical-guide-to-fp-ts-part-5
 */
import { pipe } from 'fp-ts/lib/pipeable'
import * as f from 'fp-ts/lib/function'
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import * as E from 'fp-ts/lib/Either';


/**
 * Array.chain:
 */
describe('Array.chain:', function(){
    
    it('baseline: map return array', function(){
        
        const items = [
            {
                values: [1, 2, 3],
            },
            {
                values: [],
            },
            {
                values: [6, 7, 8],
            },
        ];
        
        
        const result = pipe(
            items,
            A.map((item) => {
                return item.values;
            }),
        );
        expect(result).toEqual([
            [1,2,3],
            [],
            [6,7,8],
        ]);
        
    });
    
    
    it('acts like flatmap', function(){
        
        const items = [
            {
                values: [1, 2, 3],
            },
            {
                values: [],
            },
            {
                values: [6, 7, 8],
            },
        ];
        
        
        const result = pipe(
            items,
            A.chain((item) => {
                return item.values;
            }),
        );
        expect(result).toEqual([
            1,2,3,
            6,7,8,
        ]);
        
    });
    
});
// End of 'Array.chain:'.
