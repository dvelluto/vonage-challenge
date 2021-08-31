import { Observable } from "rxjs";
import { InteractionInterface } from '@libs/interactions';

export interface AgentInterface {
  isBusy(): Observable<boolean>;
  availableSlots<T extends InteractionInterface>(): Observable<number>;
  resolveInteraction(interaction: InteractionInterface): Observable<boolean>;
}
