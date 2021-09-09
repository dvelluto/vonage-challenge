import { Injectable } from '@angular/core';
import { BehaviorSubject, iif, Observable, of } from 'rxjs';
import { delay, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { InteractionTypes } from '../enums';
import { InteractionInterface, InteractionStatus } from '../interfaces';
import { InteractionsByType, MessageInteraction, PhoneInteraction } from '../models';

@Injectable({
  providedIn: 'root'
})
export class InteractionsService {
  private activeInteractions: Array<InteractionInterface> = [];

  constructor() { }

  public startInteraction(interaction: InteractionInterface): Observable<InteractionStatus> {
    const interactionSubject = new BehaviorSubject(interaction.status);

    return interactionSubject.asObservable().pipe(
      switchMap(status =>
        iif(() => !status.hasStarted,
          of(status).pipe(tap(() => interactionSubject.next({ ...status, hasStarted: true }))),
          of(status).pipe(
            delay(interaction.duration * 1000),
            tap(() => interactionSubject.next({ ...status, hasEnded: true }))
          )
        )
      ),
      takeUntil(interactionSubject.asObservable().pipe(map(status => status.hasStarted && status.hasEnded)))
    )
  }

  public addInteractionToActive(interaction: InteractionInterface): Array<InteractionInterface> {
    this.activeInteractions = [...this.activeInteractions, interaction];
    return this.activeInteractions;
  }

  public removeInteractionFromActiveById(interactionId: string): Array<InteractionInterface> {
    this.activeInteractions = this.activeInteractions.filter(i => i.id !== interactionId);
    return this.activeInteractions;
  }

  public getInteractionsById(interactionsIds: Array<string>): InteractionsByType {
    const phoneInteractions = this.activeInteractions
      .filter(i => i.type === InteractionTypes.PhoneInteraction)
      .filter(i => interactionsIds.includes(i.id))
      .map(i => i as PhoneInteraction);

    const messageInteractions = this.activeInteractions
      .filter(i => i.type === InteractionTypes.MessageInteraction)
      .filter(i => interactionsIds.includes(i.id))
      .map(i => i as MessageInteraction);

    return {
      [InteractionTypes.PhoneInteraction]: phoneInteractions,
      [InteractionTypes.MessageInteraction]: messageInteractions
    };
  }
}
