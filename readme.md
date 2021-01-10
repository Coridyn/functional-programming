# Functional Programming

Try out functional programming concepts with [fp-ts]()


* https://dev.to/gcanti/getting-started-with-fp-ts-functor-36ek
* 


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
