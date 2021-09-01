import { InteractionTypes } from "../enums";
import { BaseInteraction } from "./base-interaction.model";

export class MessageInteraction extends BaseInteraction {
  public type = InteractionTypes.MessageInteraction;
  public duration = 5;

  constructor() {
    super();
  }
}
