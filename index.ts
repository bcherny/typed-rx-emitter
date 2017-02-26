import { Observable, Observer } from 'rx'

interface State<Messages> {
  observables: Map<keyof Messages, Observable<any>[]>
  observers: Map<keyof Messages, Observer<any>[]>
}

export class Emitter<Messages> {

  private emitterState: State<Messages> = {
    observables: new Map,
    observers: new Map
  }

  /**
   * Emit an event (silently fails if no listeners are hooked up yet)
   */
  emit<T extends keyof Messages>(type: T, data: Messages[T]): this {
    if (this.hasChannel(type)) {
      this.emitterState.observers.get(type)!.forEach(_ => _.onNext(data))
    }
    return this
  }

  /**
   * Respond to an event
   */
  on<T extends keyof Messages>(type: T): Observable<Messages[T]> {
    return this.createChannel(type)
    // const subject = new Subject<Messages[T]>()
    // subject.finally(() => this.deleteChannel(type, subject))
    // this.getChannel(type).push(subject)
    // return subject
  }

  ///////////////////// privates /////////////////////

  private createChannel<T extends keyof Messages>(type: T) {
    if (!this.emitterState.observers.has(type)) {
      this.emitterState.observers.set(type, [])
    }
    const observable: Observable<Messages[T]> = Observable.create<Messages[T]>(observer => {
      this.emitterState.observers.get(type)!.push(observer)
    })
    .finally(() => this.deleteChannel(type, observable))
    if (!this.emitterState.observables.has(type)) {
      this.emitterState.observables.set(type, [])
    }
    this.emitterState.observables.get(type)!.push(observable)
    return observable
  }

  private deleteChannel<T extends keyof Messages>(type: T, observable: Observable<Messages[T]>) {
    if (!this.emitterState.observables.has(type)) {
      return
    }
    const array = this.emitterState.observables.get(type)!
    const index = array.indexOf(observable)
    if (index < 0) {
      return
    }
    array.splice(index, 1)
    if (!array.length) {
      this.emitterState.observables.delete(type)
      this.emitterState.observers.delete(type)
    }
  }

  // private getChannel<T extends keyof Messages>(type: T) {
  //   return this.emitterState.observables.get(type) as Observable<Messages[T]>
  // }

  private hasChannel<T extends keyof Messages>(type: T): boolean {
    return this.emitterState.observables.has(type)
  }
}
