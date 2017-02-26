import { Observable, Subject } from 'rx'

interface State<Messages> {
  channels: Map<keyof Messages, Observable<any>>,
  listenerCounts: Map<keyof Messages, number>
}

export class Emitter<Messages> {

  private emitterState: State<Messages> = {
    channels: new Map,
    listenerCounts: new Map
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
    const count = this.emitterState.listenerCounts.get(type)!
    this.emitterState.listenerCounts.set(type, count + 1)
    return this.getChannel(type)!
  }

  /**
   * Stop listening and release resources
   */
  off<T extends keyof Messages>(type: T) {
    if (this.hasChannel(type)) {
      const count = this.emitterState.listenerCounts.get(type)!
      if (count === 1) {
        this.deleteChannel(type)
      } else {
        this.emitterState.listenerCounts.set(type, count - 1)
      }
    }
  }


  ///////////////////// privates /////////////////////

  private createChannel<T extends keyof Messages>(type: T) {
    this.emitterState.channels.set(type, new Subject<Messages[T]>())
    this.emitterState.listenerCounts.set(type, 0)
  }

  private deleteChannel<T extends keyof Messages>(type: T) {
    this.emitterState.channels.delete(type)
    this.emitterState.listenerCounts.delete(type)
  }

  private getChannel<T extends keyof Messages>(type: T) {
    return this.emitterState.channels.get(type) as Subject<Messages[T]>
  }

  private hasChannel<T extends keyof Messages>(type: T): boolean {
    return this.emitterState.channels.has(type)
  }
}
