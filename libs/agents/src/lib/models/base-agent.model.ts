import { InteractionInterface, InteractionTypes } from "@libs/interactions";
import { AgentTypes } from "../enums";
import { AgentInterface } from "../interfaces";

export abstract class BaseAgent implements AgentInterface {
  public abstract type: AgentTypes;
  public id: string;
  public abstract maxPhoneInteractions: number;
  public abstract maxMessageInteractions: number;
  private _activeInteractions: Array<InteractionInterface> = [];

  public get activeInteractions(): Array<InteractionInterface> {
    return this._activeInteractions;
  }

  public set activeInteractions(newInteraction: Array<InteractionInterface>) {
    this._activeInteractions = [...this._activeInteractions, ...newInteraction];
  }

  constructor() {
    this.id = Date.now().toString();
  }

  isAvailableForMessages(): boolean {
    const activeMessages = this.activeInteractions.filter(i => i.type === InteractionTypes.MessageInteraction);
    const activePhones = this.activeInteractions.filter(i => i.type === InteractionTypes.PhoneInteraction);

    return this.maxMessageInteractions > activeMessages.length && activePhones.length === 0;
  }

  isAvailableForPhones(): boolean {
    const activePhones = this.activeInteractions.filter(i => i.type === InteractionTypes.PhoneInteraction);
    const activeMessages = this.activeInteractions.filter(i => i.type === InteractionTypes.MessageInteraction)

    return this.maxPhoneInteractions > activePhones.length && activeMessages.length === 0;
  }

  isBusy(): boolean {
    return !this.isAvailableForMessages() && !this.isAvailableForPhones()
  }
}
