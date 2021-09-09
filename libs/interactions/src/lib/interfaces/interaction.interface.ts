import { InteractionTypes } from "../enums";
import { InteractionStatus } from "./interaction-status.interface";

export interface InteractionInterface {
  id: string;
  type: InteractionTypes;
  duration: number;
  status: InteractionStatus;
}
