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
