import { InteractionTypes } from "../enums";
import { InteractionInterface, InteractionStatus } from "../interfaces";

export abstract class BaseInteraction implements InteractionInterface {
  public abstract duration: number;
  public abstract type: InteractionTypes;
  public id: string;
  public status: InteractionStatus;

  constructor() {
    this.id = Date.now() + Math.random().toString(36).substr(2, 9);
    this.status = { hasStarted: false, hasEnded: false };
  }
}
