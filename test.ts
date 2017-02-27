import test from 'ava'
import { Emitter } from './'

type Messages = {
  SHOULD_OPEN_MODAL: { id: number, value: boolean }
  SHOULD_CLOSE_MODAL: { id: number, value: boolean }
}

test('it should trigger subscribers', t => {
  t.plan(2)
  const emitter = new Emitter<Messages>()
  emitter.on('SHOULD_OPEN_MODAL').subscribe(_ => {
    t.is(_.id, 123)
    t.is(_.value, true)
  })
  emitter.emit('SHOULD_OPEN_MODAL', { id: 123, value: true })
})

test('it should fail silently if emitting before subscribers exist', t => {
  const emitter = new Emitter<Messages>()
  emitter.emit('SHOULD_OPEN_MODAL', { id: 123, value: true })
  emitter.on('SHOULD_OPEN_MODAL').subscribe(_ => t.fail('Should not get called'))
})

test('it should support Rx methods', t => {
  t.plan(2)
  const emitter = new Emitter<Messages>()
  emitter.on('SHOULD_OPEN_MODAL')
    .filter(_ => _.id > 100)
    .subscribe(_ => {
      t.is(_.id, 101)
      t.is(_.value, true)
    })
  emitter.emit('SHOULD_OPEN_MODAL', { id: 99, value: true })
  emitter.emit('SHOULD_OPEN_MODAL', { id: 101, value: true })
})

test('it should support multiple listeners', t => {
  t.plan(2)
  const emitter = new Emitter<Messages>()
  emitter.on('SHOULD_OPEN_MODAL').subscribe(_ => t.is(_.value, true))
  emitter.on('SHOULD_OPEN_MODAL').subscribe(_ => t.is(_.value, true))
  emitter.emit('SHOULD_OPEN_MODAL', { id: 123, value: true })
})

test('it should dispose listeners independently', t => {
  t.plan(1)
  const emitter = new Emitter<Messages>()
  const disposable1 = emitter.on('SHOULD_OPEN_MODAL').subscribe(_ => t.fail())
  emitter.on('SHOULD_OPEN_MODAL').subscribe(_ => t.pass())
  disposable1.dispose()
  emitter.emit('SHOULD_OPEN_MODAL', { id: 123, value: true })
})

test('it should automatically clean up unused listeners', t => {
  t.plan(1)
  const emitter = new Emitter<Messages>()
  const disposable1 = emitter.on('SHOULD_OPEN_MODAL').subscribe(_ => t.fail())
  const disposable2 = emitter.on('SHOULD_OPEN_MODAL').subscribe(_ => t.fail())
  disposable1.dispose()
  disposable2.dispose()
  t.is(emitter['emitterState'].observables.has('SHOULD_OPEN_MODAL'), false)
})

test('it handle sequential additions and removals gracefully', t => {
  t.plan(5)
  const emitter = new Emitter<Messages>()
  const disposable1 = emitter.on('SHOULD_OPEN_MODAL').subscribe(_ => t.fail())
  const disposable2 = emitter.on('SHOULD_OPEN_MODAL').subscribe(_ => t.deepEqual(_, { id: 123, value: true }))
  disposable1.dispose()
  emitter.emit('SHOULD_OPEN_MODAL', { id: 123, value: true })
  disposable2.dispose()
  t.is(emitter['emitterState'].observables.has('SHOULD_OPEN_MODAL'), false)
  const disposable3 = emitter.on('SHOULD_OPEN_MODAL').subscribe(_ => t.deepEqual(_, { id: 456, value: false }))
  emitter.emit('SHOULD_OPEN_MODAL', { id: 456, value: false })
  t.is(emitter['emitterState'].observables.has('SHOULD_OPEN_MODAL'), true)
  disposable3.dispose()
  t.is(emitter['emitterState'].observables.has('SHOULD_OPEN_MODAL'), false)
})
