import { BehaviorSubject, iif, Observable, of } from "rxjs";
import { delay, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { InteractionTypes } from "../enums";
import { InteractionInterface } from "../interfaces";

export abstract class BaseInteraction implements InteractionInterface {

  private interactionWaiter$ = new BehaviorSubject(false);
  public abstract duration: number;
  public abstract type: InteractionTypes;
  public id: string;

  constructor() {
    this.id = Date.now().toString();
  }

  public hasEnded(): Observable<boolean> {
    return this.interactionWaiter$.asObservable().pipe(
      switchMap(hasStarted => iif(() => !hasStarted, of(hasStarted), of(hasStarted).pipe(delay(this.duration * 1000)))),
      distinctUntilChanged()
    );
  }

  public start(): void {
    this.interactionWaiter$.next(true);
  }
}
