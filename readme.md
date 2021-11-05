# Functional Programming

Try out functional programming concepts with [fp-ts]()


* https://dev.to/gcanti/getting-started-with-fp-ts-functor-36ek
* ``: https://rlee.dev/writing/practical-guide-to-fp-ts-part-1
* `Practical Guide to Fp‑ts P6: The Do Notation`: https://rlee.dev/writing/practical-guide-to-fp-ts-part-6
* `Practical Guide to Fp‑ts P5: Apply, Sequences, and Traversals`: https://rlee.dev/writing/practical-guide-to-fp-ts-part-5
* `Practical Guide to Fp‑ts P3: Task, Either, TaskEither`: https://rlee.dev/writing/practical-guide-to-fp-ts-part-3

* `Getting started with fp-ts: Semigroup` https://dev.to/gcanti/getting-started-with-fp-ts-semigroup-2mf7
* `Getting started with fp-ts: Either vs Validation`: https://dev.to/gcanti/getting-started-with-fp-ts-either-vs-validation-5eja
* `Do with validation`: https://paulgray.net/notes/do-validation/

* https://stackoverflow.com/questions/60471399/running-an-array-of-taskeithers-in-parallel-but-continue-if-1-or-more-task-fail
* https://dev.to/vncz/frequently-asked-questions-1108

* StackOverflow "newest 'fp-ts' questions": https://stackoverflow.com/questions/tagged/fp-ts


*Useful types*

* `Either`
  - Represent a failure or success value
  - https://gcanti.github.io/fp-ts/modules/Either.ts.html
    
* `These`
  - Like `Either`, represents a failure or succes, but allows 
    it to contain _both_ values at the same time (i.e. doesn't short-circuit after first failure)
  - Useful when we want to represent processing that may include failures and successes
    (e.g. multiple http requests, some worked, some didn't)
  - Or allow us to continue processing even if errors occurred
  - https://gcanti.github.io/fp-ts/modules/These.ts.html



## Running

In Webstorm (or other IntelliJ IDEs) set up an npm run task:

```
npm run startFile $FilePathRelativeToProjectRoot$
```

Add an `arguments` value with `$FilePathRelativeToProjectRoot$` to run `ts-node` on the currently focussed file
