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

  agents: Array<Agent>;
  supervisors: Array<Supervisor>;
  managers: Array<Manager>;

  private interactions = new BehaviorSubject<Array<InteractionInterface>>([]);

  private agentsOnInteractions = new BehaviorSubject<AgentsOnInteraction>({});

  private subscriptions = new Subscription();

  constructor() {
    this.managers = new Array(1);
    this.supervisors = [];
    this.agents = [];
  }

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
    const subscribeToEndInteraction = interaction.hasEnded().pipe(filter(e => !!e)).subscribe(hasEnded => {
      const { [interaction.id]: _, ...currentInteractions } = this.agentsOnInteractions.value;

      agent.activeInteractions = agent.activeInteractions.filter(i => i.id == interaction.id);

      this.agentsOnInteractions.next(currentInteractions);
      subscribeToEndInteraction.unsubscribe();
      this.subscriptions.remove(subscribeToEndInteraction);
    });

    this.subscriptions.add(subscribeToEndInteraction);
  }
}
