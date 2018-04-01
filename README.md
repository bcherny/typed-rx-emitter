<img alt="typed-rx-emitter: Typesafe Rx-based event emitter" src="https://raw.githubusercontent.com/bcherny/typed-rx-emitter/master/logo.png" width="320px" />

[![Build Status][build]](https://circleci.com/gh/bcherny/typed-rx-emitter) [![npm]](https://www.npmjs.com/package/typed-rx-emitter) [![mit]](https://opensource.org/licenses/MIT)

[build]: https://img.shields.io/circleci/project/bcherny/typed-rx-emitter.svg?branch=master&style=flat-square
[npm]: https://img.shields.io/npm/v/typed-rx-emitter.svg?style=flat-square
[mit]: https://img.shields.io/npm/l/typed-rx-emitter.svg?style=flat-square

## Highlights

- 100% typesafe:
  - Statically enforces that channels in `.on()` are defined
  - Statically enforces that channels in `.emit()` are defined
  - Statically enforces that emitters are called with the correct data given their Message name
  - Statically enforces that listeners are called with the correct data given their Message name
- Supports [all RxJS methods](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/libraries/main/rx.md)

## Installation (with RxJS v5.x - recommended)

```sh
# Using Yarn:
yarn add typed-rx-emitter rxjs

# Using NPM:
npm install typed-rx-emitter rxjs --save
```

## Installation (with RxJS v4.x)

```sh
# Using Yarn:
yarn add typed-rx-emitter@^0.3

# Using NPM:
npm install typed-rx-emitter@^0.3 --save
```

## Usage

```ts
import { Emitter } from 'typed-rx-emitter'

// Enumerate messages
type Messages = {
  INCREMENT_COUNTER: number
  OPEN_MODAL: boolean
}

const emitter = new Emitter<Messages>()

// Listen on an event (basic)
emitter
  .on('OPEN_MODAL')
  .subscribe(_ => console.log(`Change modal visibility: ${_}`)) // _ is a boolean

// Listen on an event (advanced)
emitter
  .on('INCREMENT_COUNTER')
  .filter(_ => _ > 3) // _ is a number
  .debounce()
  .subscribe(_ => console.log(`Counter incremented to ${_}`)) // _ is a number

// Listen on all events
emitter
  .all()
  .subscribe(() => console.log('Something changed'))

// Trigger an event - throws a compile time error unless id and value are set, and are of the right types
emitter.emit('OPEN_MODAL', true)

// Event is misspelled - throws a compile time error
emitter.emit('INCREMENT_CONTER')
```

See a complete browser usage example [here](https://github.com/bcherny/typed-rx-emitter/blob/master/browser-example).

## Tests

```sh
npm test
```
