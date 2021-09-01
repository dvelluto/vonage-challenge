import { InteractionTypes } from "../enums";
import { BaseInteraction } from "./base-interaction.model";

export class PhoneInteraction extends BaseInteraction {
  public duration = 10;
  public type = InteractionTypes.PhoneInteraction;

  constructor() {
    super();
  }
}
