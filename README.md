# typed-rx-emitter [![Build Status][build]](https://circleci.com/gh/bcherny/typed-rx-emitter) [![npm]](https://www.npmjs.com/package/typed-rx-emitter) [![mit]](https://opensource.org/licenses/MIT)

[build]: https://img.shields.io/circleci/project/bcherny/typed-rx-emitter.svg?branch=master&style=flat-square
[npm]: https://img.shields.io/npm/v/typed-rx-emitter.svg?style=flat-square
[mit]: https://img.shields.io/npm/l/typed-rx-emitter.svg?style=flat-square

> Typesafe Rx-based emitter

## Highlights

- 100% type-safe:
  - Statically guarantees that emitters are called with the correct Message data given their Message name
  - Statically guarantees that listeners are called with the correct Message data given their Message name
- Supports all Rx methods on event listeners
- Reuses observables across subscribers

## Installation

```sh
npm install typed-rx-emitter --save
```

## Usage

```ts
import { Emitter } from 'typed-rx-emitter'

// Enumerate messages
type Messages = {
  INCREMENT_COUNTER: number
  OPEN_MODAL: boolean
}

const emitter = new Emitter

// Trigger an event
// - Throws a compile time error unless id and value are set, and are of the right types
// - Fails silently if no listeners have been assigned yet
emitter.emit('OPEN_MODAL', true)

// Listen on an event (basic)
emitter
  .on('OPEN_MODAL')
  .subscribe(_ => console.log(`Change modal visibility: ${_}`))

// Listen on an event (advanced)
emitter
  .on('INCREMENT_COUNTER')
  .filter(_ => _ > 3)
  .debounce()
  .subscribe(_ => console.log(`Counter incremented from ${_.previousValue} to ${_.value}!`))
```

## Tests

```sh
npm test
```
