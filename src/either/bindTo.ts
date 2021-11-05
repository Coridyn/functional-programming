import * as E from 'fp-ts/lib/Either';
import * as f from 'fp-ts/lib/function';


/**
 * Either.bindTo() - do notation (do-notation, doNotation)
 *
 * either:
 */
describe('either:', function(){
    
    /**
     * bindTo:
     */
    describe('bindTo:', function(){
        
        enum EOutcome {
            'success' = 'success',
            'successUpToValue' = 'successUpToValue',
            'successNoLoanRequired' = 'successNoLoanRequired',
            'invalidDeposit' = 'invalidDeposit',
            'invalidLoanBelowMin' = 'invalidLoanBelowMin',
            'invalid' = 'invalid',
            'incomplete' = 'incomplete',
        }
        
        enum EBuyingCostsResult {
            'loanValid' = 'loanValid',
            'insufficientDeposit' = 'insufficientDeposit',
            'noLoanRequired' = 'noLoanRequired',
        }
        
        enum EBorrowingPowerResult {
            'yes' = 'yes',
            'upToValue' = 'upToValue',
            'belowMinimum' = 'belowMinimum',
            'no' = 'no',
        }
        
        interface IState {
            buyingControlsValid: boolean,
            buyingCostsResult: EBuyingCostsResult,
            borrowingPowerResult: EBorrowingPowerResult,
        }
        
        function stateToOutcome(state: IState): EOutcome {
            
            const result: EOutcome = f.pipe(
                E.right(state),
    
                /**
                 * Check prequal control/input state
                 */
                E.chain((context) => {
                    let result: E.Either<EOutcome, IState> = E.left(EOutcome.incomplete);
                    if (context.buyingControlsValid){
                        result = E.right(context);
                    }
                    return result;
                }),
    
                /**
                 * Check buying costs result
                 */
                E.chain((context) => {
                    let result: E.Either<EOutcome, IState> = E.left(EOutcome.incomplete);
                    switch (context.buyingCostsResult) {
                        case EBuyingCostsResult.loanValid:
                            result = E.right(context);
                            break;
                        case EBuyingCostsResult.noLoanRequired:
                            result = E.left(EOutcome.successNoLoanRequired);
                            break;
                        case EBuyingCostsResult.insufficientDeposit:
                            result = E.left(EOutcome.invalidDeposit);
                            break;
                    }
    
                    return result;
                }),
    
                /**
                 * Check borrowing power result
                 */
                E.chain((context) => {
                    let result: E.Either<EOutcome, IState> = E.left(EOutcome.incomplete);
                    
                    switch (context.borrowingPowerResult) {
                        case EBorrowingPowerResult.yes:
                            result = E.right(context);
                            break;
                        case EBorrowingPowerResult.upToValue:
                            result = E.left(EOutcome.successUpToValue);
                            break;
                        case EBorrowingPowerResult.belowMinimum:
                            result = E.left(EOutcome.invalidLoanBelowMin);
                            break;
                        case EBorrowingPowerResult.no:
                            result = E.left(EOutcome.invalid);
                            break;
                    }
    
                    return result;
                }),
                E.map(() => {
                    // If we've reached this far then its a success
                    return EOutcome.success;
                }),
    
                /**
                 * Unwrap the either to the internal value
                 */
                E.fold(
                    (outcome: EOutcome) => {
                        return outcome;
                    },
                    (outcome: EOutcome) => {
                        return outcome;
                    },
                )
            );
            
            return result;
        }
        
    
        /**
         * Based on beyond prequal state validation logic
         *  - run a processing pipeline to reduce a complex set of different flags down to a single overall state
         *  - at different points along the pipeline we exit with a Left value indicating a terminal state
         *  - otherwise, we continue with Right values until we reach the end with a final Right(success) or have exited
         *    with a Left() value indicating some other final result state
         */
        it('mixes property into context', function(){
            
            let state: IState = {
                buyingControlsValid: true,
                buyingCostsResult: EBuyingCostsResult.loanValid,
                borrowingPowerResult: EBorrowingPowerResult.yes,
            };
            
            const result: EOutcome = stateToOutcome(state);
            
            expect(result).toEqual(EOutcome.success);
            // expect(result).toEqual(null);
        
        });
        
        
        it('handles all combinations', function(){
            // happy
            expect(stateToOutcome({
                buyingControlsValid: true,
                buyingCostsResult: EBuyingCostsResult.loanValid,
                borrowingPowerResult: EBorrowingPowerResult.yes,
            })).toEqual(EOutcome.success);
            
            
            /**
             * controls incomplete
             */
            expect(stateToOutcome({
                buyingControlsValid: false,
                buyingCostsResult: EBuyingCostsResult.loanValid,
                borrowingPowerResult: EBorrowingPowerResult.yes,
            })).toEqual(EOutcome.incomplete);
            // })).toEqual(null);
            
            
            /**
             * buying costs
             */
            // insufficientDeposit
            expect(stateToOutcome({
                buyingControlsValid: true,
                buyingCostsResult: EBuyingCostsResult.insufficientDeposit,
                borrowingPowerResult: EBorrowingPowerResult.yes,
            })).toEqual(EOutcome.invalidDeposit);
            
            // noLoanRequired
            expect(stateToOutcome({
                buyingControlsValid: true,
                buyingCostsResult: EBuyingCostsResult.noLoanRequired,
                borrowingPowerResult: EBorrowingPowerResult.yes,
            })).toEqual(EOutcome.successNoLoanRequired);
            
            // noLoanRequired
            expect(stateToOutcome({
                buyingControlsValid: true,
                buyingCostsResult: EBuyingCostsResult.noLoanRequired,
                borrowingPowerResult: EBorrowingPowerResult.yes,
            })).toEqual(EOutcome.successNoLoanRequired);
            
            
            /**
             * borrowing power
             */
            // no
            expect(stateToOutcome({
                buyingControlsValid: true,
                buyingCostsResult: EBuyingCostsResult.loanValid,
                borrowingPowerResult: EBorrowingPowerResult.no,
            })).toEqual(EOutcome.invalid);
            
            // belowMinimum
            expect(stateToOutcome({
                buyingControlsValid: true,
                buyingCostsResult: EBuyingCostsResult.loanValid,
                borrowingPowerResult: EBorrowingPowerResult.belowMinimum,
            })).toEqual(EOutcome.invalidLoanBelowMin);
            
            // upToValue
            expect(stateToOutcome({
                buyingControlsValid: true,
                buyingCostsResult: EBuyingCostsResult.loanValid,
                borrowingPowerResult: EBorrowingPowerResult.upToValue,
            })).toEqual(EOutcome.successUpToValue);
        });
        
        it('handles invalid state', function(){
            
            // incomplete
            expect(stateToOutcome({
                buyingControlsValid: null,
                buyingCostsResult: null,
                borrowingPowerResult: null,
            })).toEqual(EOutcome.incomplete);
            
            // incomplete
            expect(stateToOutcome({
                buyingControlsValid: true,
                buyingCostsResult: null,
                borrowingPowerResult: null,
            })).toEqual(EOutcome.incomplete);
            
            // incomplete
            expect(stateToOutcome({
                buyingControlsValid: true,
                buyingCostsResult: EBuyingCostsResult.loanValid,
                borrowingPowerResult: null,
            })).toEqual(EOutcome.incomplete);
            
        });
    
    });
    // End of 'bindTo:'.
    
    
    /**
     * manual bind (do notation):
     */
    describe('manual bind (do notation):', function(){
        
        /*
        Try manually creating a context object that we can then
        update with bind 
        */
        it('passes context object around', function(){
            type IItem = {
                id: string,
                value: string,
            };
            type IContext = {
                index: number,
                item: IItem,
                // splitValue?: string[],
            };
            
            const item: IItem = {
                id: 'someKey',
                value: 'some-value',
            };
            
            const result = f.pipe(
                E.of<string, IContext>({
                    index: 1,
                    item: item,
                }),
                E.bind('splitValue', (context) => {
                    return E.of(context.item.value.split('-'));
                }),
                // E.map((context: IContext) => {
                //     context.splitValue = context.item.value.split('-');
                //     return context;
                // }),
            );
            
            // expect(result).toEqual(
            //     E.right({
            //         index: 1,
            //         item: {
            //             id: 'someKey',
            //             value: 'some-value',
            //         },
            //         splitValue: ['some', 'value'],
            //     })
            // );
            expect(result).toEqual(null);
        });
        
    });
    // End of 'manual bind (do notation):'.
    
});
// End of 'either:'.
