import test from 'ava'
import { Emitter } from './'

type Actions = {
  SHOULD_OPEN_MODAL: { id: number, value: boolean }
  SHOULD_CLOSE_MODAL: { id: number, value: boolean }
}

class App extends Emitter<Actions> { }
const app = new App()

test('it should trigger subscribers', t => {
  t.plan(2)
  app.on('SHOULD_OPEN_MODAL').subscribe(_ => {
    t.is(_.id, 123)
    t.is(_.value, true)
  })
  app.emit('SHOULD_OPEN_MODAL', { id: 123, value: true })
})
