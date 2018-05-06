// @flow strict
import { filter, map } from 'rxjs/operators'
import { Emitter } from './'

type Messages = {
  SHOULD_OPEN_MODAL: { id: number, value: boolean },
  SHOULD_NAME_MODAL: { id: number, value: string }
}

const emitter: Emitter<Messages> = new Emitter
emitter.on('SHOULD_OPEN_MODAL').subscribe(_ => {
  _.id === 123
  _.value === true
})
emitter.on('SHOULD_NAME_MODAL').subscribe(_ => {
  _.id === 123
  _.value === 'foo'
})
emitter.emit('SHOULD_OPEN_MODAL', { id: 123, value: true })
emitter.emit('SHOULD_NAME_MODAL', { id: 123, value: 'Yes' })

emitter
  .on('SHOULD_NAME_MODAL')
  .pipe(
    filter(_ => _.id > 100),
    map(_ => ({ ..._, id: _.id * 2}))
  )
  .subscribe(_ => {
    _.id === 246
    _.value === 'foo'
  })

emitter.all().subscribe(_ =>
  _.id === 123
)
