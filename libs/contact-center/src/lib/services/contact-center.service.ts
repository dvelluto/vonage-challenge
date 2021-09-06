import { Injectable, OnDestroy } from '@angular/core';
import { Agent, BaseAgent, Manager, Supervisor } from "@libs/agents";
import { InteractionInterface, InteractionTypes } from '@libs/interactions';
import { BehaviorSubject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AgentsOnInteraction } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ContactCenterService implements OnDestroy {

  private agents: Array<Agent> = [];
  private supervisors: Array<Supervisor> = [];
  private managers: Array<Manager> = [];
  private maxManagers = 1;
  private maxSupervisors = this.agents.length;

  private interactions = new BehaviorSubject<Array<InteractionInterface>>([]);

  private agentsOnInteractions = new BehaviorSubject<AgentsOnInteraction>({});

  private subscriptions = new Subscription();


  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  queueNewInteraction(interaction: InteractionInterface) {
    const assigned = this.assignAgentToInteraction(interaction) ||
      this.assignSupervisorToInteraction(interaction) ||
      this.assignManagerToInteraction(interaction);

    if (assigned) {
      const actualInteractions = this.interactions.value;
      this.interactions.next([...actualInteractions, interaction]);
    }
  }

  addAgents(nagents = 1) {
    if (nagents > 0) {
      this.agents = this.addBaseAgents<Agent>(nagents, this.agents, Agent);
    }

    if (nagents < 0) {
      this.agents = this.removeBaseAgents<Agent>(nagents, this.agents);
    }

    const shouldRemoveExtraSupervisors = this.agents.length < this.maxSupervisors &&
      this.supervisors.length === this.maxSupervisors;

    if (shouldRemoveExtraSupervisors) {
      const supervisorsToRemove = this.agents.length - this.maxSupervisors;
      this.supervisors = this.removeBaseAgents<Supervisor>(supervisorsToRemove, this.supervisors);
    }
    this.maxSupervisors = this.agents.length;
  }

  addSupervisors(nsupervisors = 1) {
    if (nsupervisors > 0 && this.supervisors.length + nsupervisors <= this.maxSupervisors) {
      this.supervisors = this.addBaseAgents<Supervisor>(nsupervisors, this.supervisors, Supervisor);
    }
    if (nsupervisors < 0) {
      this.supervisors = this.removeBaseAgents<Supervisor>(nsupervisors, this.supervisors);
    }
  }

  addManagers(nmanagers = 1) {
    if (nmanagers > 0 && this.managers.length + nmanagers <= this.maxManagers) {
      this.managers = this.addBaseAgents<Manager>(nmanagers, this.managers, Manager);
    }
    if (nmanagers < 0) {
      this.managers = this.removeBaseAgents<Manager>(nmanagers, this.managers);
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

  private assignAgentToInteraction(interaction: InteractionInterface): boolean {
    return this.tentativeAssignInteraction(this.agents, interaction);
  }

  private assignSupervisorToInteraction(interaction: InteractionInterface): boolean {
    return this.tentativeAssignInteraction(this.supervisors, interaction);
  }

  private assignManagerToInteraction(interaction: InteractionInterface): boolean {
    return this.tentativeAssignInteraction(this.managers, interaction);
  }


  private tentativeAssignInteraction(agentList: Array<BaseAgent>, interaction: InteractionInterface): boolean {
    return !!agentList
      .filter(a => !a.isBusy())
      .filter(a => this.isAgentAvailableForInteraction(a, interaction))
      .reduce((prev: BaseAgent | undefined, availableAgent) => !prev && !!availableAgent ? this.assignInteraction(availableAgent, interaction) : prev, undefined);
  }

  private isAgentAvailableForInteraction(agent: BaseAgent, interaction: InteractionInterface) {
    switch (interaction.type) {
      case InteractionTypes.MessageInteraction:
        return agent.isAvailableForMessages();
      case InteractionTypes.PhoneInteraction:
        return agent.isAvailableForPhones();
      default:
        return false;
    }
  }

  private assignInteraction(agent: BaseAgent, interaction: InteractionInterface): BaseAgent {
    const currentAssigned = this.agentsOnInteractions.value;
    agent.activeInteractions = [interaction];

    this.handleSubscriptionToEndOfInteraction(agent, interaction);

    this.agentsOnInteractions.next({ ...currentAssigned, [interaction.id]: { [agent.id]: agent.isBusy() } });

    return agent;
  }

  private handleSubscriptionToEndOfInteraction(agent: BaseAgent, interaction: InteractionInterface) {
    const subscribeToEndInteraction: Subscription = interaction.hasEnded()
      .pipe(filter(e => !!e))
      .subscribe(hasEnded => this.onInteractionEnd(hasEnded, interaction, agent, subscribeToEndInteraction));

    this.subscriptions.add(subscribeToEndInteraction);
  }

  private onInteractionEnd(response: boolean, interaction: InteractionInterface, agent: BaseAgent, subscription: Subscription) {
    const { [interaction.id]: _, ...currentInteractions } = this.agentsOnInteractions.value;

    agent.activeInteractions = agent.activeInteractions.filter(i => i.id == interaction.id);

    this.agentsOnInteractions.next(currentInteractions);
    subscription.unsubscribe();
    this.subscriptions.remove(subscription);
  }
}
