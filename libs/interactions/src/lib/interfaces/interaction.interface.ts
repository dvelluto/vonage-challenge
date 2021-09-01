import { Observable } from "rxjs";
import { InteractionTypes } from "../enums";

export interface InteractionInterface {
  id: string;
  type: InteractionTypes;
  duration: number;
  hasEnded(): Observable<boolean>;
  start(): void;
}
