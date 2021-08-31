import { BehaviorSubject, Observable, Subject } from "rxjs";
import { delay, skipWhile } from 'rxjs/operators';
import { InteractionInterface } from "../interfaces";

export abstract class BaseInteraction implements InteractionInterface {

  private interactionWaiter$ = new BehaviorSubject(false);
  public abstract duration: number;

  public hasEnded(): Observable<boolean> {
    return this.interactionWaiter$.asObservable().pipe(
      skipWhile(res => !res),
      delay(this.duration * 1000));
  }

  public start(): void {
    this.interactionWaiter$.next(true);
  }
}
