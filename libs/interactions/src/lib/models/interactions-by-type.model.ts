import { InteractionTypes, MessageInteraction, PhoneInteraction } from "@libs/interactions";

export type InteractionsByType = {
  [InteractionTypes.PhoneInteraction]: Array<PhoneInteraction>,
  [InteractionTypes.MessageInteraction]: Array<MessageInteraction>
}