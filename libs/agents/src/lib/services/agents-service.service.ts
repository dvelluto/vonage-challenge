import { Injectable } from '@angular/core';
import { Agent, BaseAgent, Manager, Supervisor } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AgentsService {
  private agents: Array<Agent> = [];
  private supervisors: Array<Supervisor> = [];
  private managers: Array<Manager> = [];

  public getAgent(agentId: string): BaseAgent | undefined {
    return this.agents.find(a => a.id === agentId) ||
      this.supervisors.find(s => s.id === agentId) ||
      this.managers.find(m => m.id === agentId);
  }

  public getAgents(agentType: "Agent" | "Supervisor" | "Manager"): Array<BaseAgent> {
    switch (agentType) {
      case "Agent":
        return this.agents;
      case "Supervisor":
        return this.supervisors;
      case "Manager":
        return this.managers;
    }
  }

  public addAgents(nagents: number) {
    if (nagents > 0) {
      this.agents = this.addBaseAgents<Agent>(nagents, this.agents, Agent);
    }

    if (nagents < 0) {
      this.agents = this.removeBaseAgents<Agent>(nagents, this.agents);
    }
  }

  public addSupervisors(nsupervisors: number) {
    if (nsupervisors > 0) {
      this.supervisors = this.addBaseAgents<Supervisor>(nsupervisors, this.supervisors, Supervisor);
    }
    if (nsupervisors < 0) {
      this.supervisors = this.removeBaseAgents<Supervisor>(nsupervisors, this.supervisors);
    }
  }

  public addManagers(nmanagers: number) {
    if (nmanagers > 0) {
      this.managers = this.addBaseAgents<Manager>(nmanagers, this.managers, Manager);
    }
    if (nmanagers < 0) {
      this.managers = this.removeBaseAgents<Manager>(nmanagers, this.managers);
    }
  }

  public addInteractionToAgent(agentId: string, interactionId: string) {
    const agent = this.getAgent(agentId);
    if (!!agent) {
      agent.idActiveInteractions = [...agent.idActiveInteractions, interactionId];
    }
  }

  public removeInteractionFromAgent(agentId: string, interactionId: string) {
    const agent = this.getAgent(agentId);
    if (!!agent) {
      agent.idActiveInteractions = agent.idActiveInteractions.filter(i => i !== interactionId);
    }
  }

  private addBaseAgents<T extends BaseAgent>(nagents: number, oldArray: Array<T>, agentClass: { new(): T; }): Array<T> {
    let newAgents = [] as Array<T>;
    for (let i = 0; i < nagents; i++) {
      newAgents = [...newAgents, new agentClass()];
    }
    return [...oldArray, ...newAgents];
  }

  private removeBaseAgents<T extends BaseAgent>(nagents: number, oldArray: Array<T>): Array<T> {
    const agentsToRemove = Math.abs(nagents);
    const lastAgentIndex = agentsToRemove > oldArray.length ? - oldArray.length : nagents;
    return oldArray.slice(0, lastAgentIndex);
  }
}
