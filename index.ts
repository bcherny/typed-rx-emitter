import { Observable, Subject } from 'rxjs'

interface State<Actions> {
  channels: Map<keyof Actions, Observable<any>>
}

export class Emitter<Actions> {

  private emitterState: State<Actions> = {
    channels: new Map
  }

  /**
   * Emit an action (silently fails if no listeners are hooked up yet)
   */
  emit<T extends keyof Actions>(type: T, data: Actions[T]) {
    if (this.hasChannel(type)) {
      this.getChannel(type)!.next(data)
    }
    return this
  }

  /**
   * Respond to an action
   */
  on<T extends keyof Actions>(type: T) {
    this.createChannel(type)
    return this.getChannel(type)!
  }


  ///////////////////// privates /////////////////////

  private createChannel<T extends keyof Actions>(type: T) {
    this.emitterState.channels.set(type, new Subject<Actions[T]>())
  }

  private getChannel<T extends keyof Actions>(type: T) {
    return this.emitterState.channels.get(type) as Subject<Actions[T]>
  }

  private hasChannel<T extends keyof Actions>(type: T): boolean {
    return this.emitterState.channels.has(type)
  }
}
