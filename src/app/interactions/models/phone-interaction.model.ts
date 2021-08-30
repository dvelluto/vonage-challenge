import { InteractionType } from "../enums";
import { InteractionInterface } from "../interfaces";

export class PhoneInteraction implements InteractionInterface {
  public type = InteractionType.PHONE;
}
