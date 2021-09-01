import { AgentTypes } from "../enums";
import { Agent } from "./agent.model";
import { BaseAgent } from "./base-agent.model";
import { Manager } from "./manager.model";

export class Supervisor extends BaseAgent {
  public type = AgentTypes.Supervisor;
  public maxPhoneInteractions = 1;
  public maxMessageInteractions = 2;
  public manager: Manager | undefined;
  public agents: Array<Agent>;

  constructor() {
    super();
    this.agents = [];
  }
}
