import { AgentTypes } from "../enums";
import { BaseAgent } from "./base-agent.model";
import { Supervisor } from "./supervisor.model";

export class Manager extends BaseAgent {
  public type = AgentTypes.Manager;
  public maxMessageInteractions = 1;
  public maxPhoneInteractions = 1;
  public supervisors: Array<Supervisor>;

  constructor() {
    super();
    this.supervisors = [];
  }
}
