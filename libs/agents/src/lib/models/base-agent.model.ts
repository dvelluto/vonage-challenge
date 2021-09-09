import { AgentTypes } from "../enums";
import { AgentInterface } from "../interfaces";

export abstract class BaseAgent implements AgentInterface {
  public abstract type: AgentTypes;
  public id: string;
  public idActiveInteractions: Array<string> = [];
  public abstract maxPhoneInteractions: number;
  public abstract maxMessageInteractions: number;

  constructor() {
    this.id = Date.now().toString();
  }
}
