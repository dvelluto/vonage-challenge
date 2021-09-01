import { AgentTypes } from "../enums";
import { BaseAgent } from "./base-agent.model";
import { Supervisor } from "./supervisor.model";

export class Agent extends BaseAgent {
  public type = AgentTypes.Agent;
  public maxMessageInteractions = 2;
  public maxPhoneInteractions = 1;
  public supervisor: Supervisor | undefined;

  constructor() {
    super();
  }
}
