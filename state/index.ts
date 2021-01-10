import { 
    randomNumber,
    randomInRangeGenerator,
    randomName,
    randomName2,
    randomName3,
    randomFullname,
    randoms,
    randomTeamGetterFn,
    randomTeamFn,
} from './random';
import './sequenceS';


function runExamples(){
    
    const seed = 596821;
    const [random1, seed2] = randomNumber(seed);
    const [random2, seed3] = randomNumber(seed2);
    
    console.log(`random1: `, random1);
    console.log(`random2: `, random2);
    
    
    //-----------------------------------------
    console.log(`\n`);
    
    
    console.log(`randomInRange`);
    const getRandom = randomInRangeGenerator(100, 0);
    const [random3, seed4] = getRandom(seed3);
    const [random4, seed5] = getRandom(seed4);
    console.log(`random3: `, random3);
    console.log(`random4: `, random4);
    
    
    //-----------------------------------------
    console.log(`\n`);
    
    console.log(`randomName`);
    const getRandomName = randomName(['a', 'b', 'c', 'd', 'e', 'f']);
    const [name1, seed6] = getRandomName(100);
    const [name2, seed7] = getRandomName(seed6);
    console.log(`name1:`, name1);
    console.log(`name2:`, name2);
    
    const getRandomName2 = randomName3(['a', 'b', 'c', 'd', 'e', 'f']);
    let nameSeed = 0;
    for (let i = 0; i < 5; i++){
        const nameS = getRandomName2(i);
        const name = nameS[0];
        nameSeed = nameS[1];
        
        console.log(`[${i}] name=`, name);
    }
    
    
    //-----------------------------------------
    console.log(`\n## Composition\n`);
    
    console.log(`randomFullname`);
    const getRandomLastname = randomName3(['1', '2', '3', '4']);
    const randomFullnameFn = randomFullname(getRandomName, getRandomLastname);
    const [fname1, seed8] = randomFullnameFn(seed7);
    const [fname2, seed9] = randomFullnameFn(seed8);
    console.log(`fname1:`, fname1);
    console.log(`fname2:`, fname2);
    
    
    /**
     * sequenceT
     * 
     * Use the same seed to generate results from multiple state generators
     * 
     * `randoms` is a composed set of three state functions
     * From a single seed number we pick a different value from each of the states
     */
    const [results1, seed10] = randoms(5);
    const [results2, seed11] = randoms(seed10);
    console.log(`results1=`, results1);
    console.log(`results2=`, results2);
    
    {
        let rSeed = 0;
        let results: ReturnType<typeof randoms>[0];
        for (let i = 0; i < 10; i++){
            const r = randoms(rSeed);
            [results, rSeed] = r;
            console.log(`results=`, results);
        }
    }
    
    
    /**
     * chain
     * Use the result from one state to feed into subsequent states
     */
    console.log(`### chain`);
    for (let i = 0; i < 10; i++){
        const [result] = randomTeamFn(i);
        console.log(`result=`, result);
    }
}


// runExamples();
