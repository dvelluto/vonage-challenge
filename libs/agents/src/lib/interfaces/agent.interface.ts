import { AgentTypes } from "../enums";

export interface AgentInterface {
  id: string;
  type: AgentTypes;
  idActiveInteractions: Array<string>;
  maxPhoneInteractions: number;
  maxMessageInteractions: number;
}
