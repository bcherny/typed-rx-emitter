// @flow
import test from 'ava'
import { Emitter } from './'

type Messages = {
  SHOULD_OPEN_MODAL: { id: number, value: boolean },
  SHOULD_NAME_MODAL: { id: number, value: string }
}

test('it should compile with flow', t => {
  const emitter: Emitter<Messages> = new Emitter()
  emitter.on('SHOULD_OPEN_MODAL').subscribe(_ => {
    t.is(_.id, 123)
    t.is(_.value, true)
  })
  emitter.on('SHOULD_NAME_MODAL').subscribe(_ => {
    t.is(_.id, 123)
    t.is(_.value, 'foo')
  })
  emitter.emit('SHOULD_OPEN_MODAL', { id: 123, value: true })
  emitter.emit('SHOULD_NAME_MODAL', { id: 123, value: true })

  emitter.all().subscribe(_ =>
    t.is(_.id, 123)
  )
})
