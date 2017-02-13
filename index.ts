import { Observable, Subject } from 'rx'

interface State<Messages> {
  channels: Map<keyof Messages, Observable<any>>
}

export class Emitter<Messages> {

  private emitterState: State<Messages> = {
    channels: new Map
  }

  /**
   * Emit an event (silently fails if no listeners are hooked up yet)
   */
  emit<T extends keyof Messages>(type: T, data: Messages[T]) {
    if (this.hasChannel(type)) {
      this.getChannel(type)!.onNext(data)
    }
    return this
  }

  /**
   * Respond to an event
   */
  on<T extends keyof Messages>(type: T) {
    if (!this.hasChannel(type)) {
      this.createChannel(type)
    }
    return this.getChannel(type)!
  }


  ///////////////////// privates /////////////////////

  private createChannel<T extends keyof Messages>(type: T) {
    this.emitterState.channels.set(type, new Subject<Messages[T]>())
  }

  private getChannel<T extends keyof Messages>(type: T) {
    return this.emitterState.channels.get(type) as Subject<Messages[T]>
  }

  private hasChannel<T extends keyof Messages>(type: T): boolean {
    return this.emitterState.channels.has(type)
  }
}
