import { InteractionType } from "../enums";
import { InteractionInterface } from "../interfaces";

export class MessageInteraction implements InteractionInterface {
  public type = InteractionType.MESSAGE;
}
