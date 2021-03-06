import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { AgentInterface, AgentsService, AgentTypes, BaseAgent, Manager, Supervisor } from "@libs/agents";
import { InteractionInterface, InteractionsService, InteractionStatus, InteractionTypes } from '@libs/interactions';
import { AgentsOnInteraction } from '../models';

@Injectable()
export class ContactCenterService implements OnDestroy {

  private maxManagers = 1;
  private maxSupervisors = this.agentsService.getAgents(AgentTypes.Agent).length;

  private agentsOnInteractions = new BehaviorSubject<AgentsOnInteraction>({});

  private subscriptions = new Subscription();

  constructor(
    public agentsService: AgentsService,
    public interactionsService: InteractionsService) { }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public queueNewInteraction(interaction: InteractionInterface): boolean {
    const assigned = this.assignAgentToInteraction(interaction, AgentTypes.Agent) ||
      this.assignAgentToInteraction(interaction, AgentTypes.Supervisor) ||
      this.assignAgentToInteraction(interaction, AgentTypes.Manager);

    return assigned;
  }

  public getActiveAgentsOnInteractions$(): Observable<Array<AgentInterface | undefined>> {
    return this.agentsOnInteractions.asObservable().pipe(
      map(p => Object.values(p)),
      map(agentIds => agentIds.map(({ agentId }) => this.agentsService.getAgent(agentId)).filter(a => !!a)),
    )
  }

  public addAgents(nagents = 1) {
    this.agentsService.addAgents(nagents);
    const agentsCount = this.agentsService.getAgents(AgentTypes.Agent).length;
    const supervisorsCount = this.agentsService.getAgents(AgentTypes.Supervisor).length;

    const shouldRemoveExtraSupervisors = agentsCount < this.maxSupervisors &&
      supervisorsCount === this.maxSupervisors;

    if (shouldRemoveExtraSupervisors) {
      const supervisorsToRemove = agentsCount - this.maxSupervisors;
      this.agentsService.addSupervisors(supervisorsToRemove);
    }

    this.maxSupervisors = agentsCount;
  }

  public addSupervisors(nsupervisors = 1) {
    const supervisorsCount = this.agentsService.getAgents(AgentTypes.Supervisor).length;

    if (supervisorsCount + nsupervisors <= this.maxSupervisors) {
      this.agentsService.addSupervisors(nsupervisors);
    }
  }

  public addManagers(nmanagers = 1) {
    const managersCount = this.agentsService.getAgents(AgentTypes.Manager).length;

    if (managersCount + nmanagers <= this.maxManagers) {
      this.agentsService.addManagers(nmanagers);
    }
  }

  public isAgentAvailableForMessages(agentId: string): boolean {
    const agent = this.agentsService.getAgent(agentId);
    if (!!agent) {
      const { phoneInteractions, messageInteractions } = this.interactionsService.getInteractionsById(agent.idActiveInteractions);

      return agent.maxMessageInteractions > messageInteractions.length && phoneInteractions.length === 0;
    }
    return false;
  }

  public isAgentAvailableForPhones(agentId: string): boolean {
    const agent = this.agentsService.getAgent(agentId);
    if (!!agent) {
      const { phoneInteractions, messageInteractions } = this.interactionsService.getInteractionsById(agent.idActiveInteractions);

      return agent.maxPhoneInteractions > phoneInteractions.length && messageInteractions.length === 0;
    }
    return false;
  }

  private assignAgentToInteraction(interaction: InteractionInterface, agentType: AgentTypes): boolean {
    const availableAgents = this.agentsService.getAgents(agentType);
    const freeAgent = availableAgents.find(a => this.isAgentAvailableForInteraction(a, interaction));

    return !!availableAgents.length && !!freeAgent && !!this.assignInteraction(freeAgent, interaction);
  }

  private isAgentAvailableForInteraction(agent: BaseAgent, interaction: InteractionInterface): boolean {
    switch (interaction.type) {
      case InteractionTypes.MessageInteraction:
        return this.isAgentAvailableForMessages(agent.id);
      case InteractionTypes.PhoneInteraction:
        return this.isAgentAvailableForPhones(agent.id);
      default:
        return false;
    }
  }

  private assignInteraction(agent: AgentInterface, interaction: InteractionInterface): AgentInterface {
    const currentAssigned = this.agentsOnInteractions.value;

    this.agentsService.addInteractionToAgent(agent.id, interaction.id);
    this.interactionsService.addInteractionToActive(interaction);

    const interactionObserver = this.interactionsService.startInteraction$(interaction);
    this.agentsOnInteractions.next({ ...currentAssigned, [interaction.id]: { agentId: agent.id } });

    const subscriberToInteraction = interactionObserver
      .subscribe((status: InteractionStatus) => {
        if (status.hasEnded) {
          const { [interaction.id]: { agentId }, ...currentInteractions } = this.agentsOnInteractions.value;
          this.agentsService.removeInteractionFromAgent(agentId, interaction.id);
          this.agentsOnInteractions.next(currentInteractions);
          subscriberToInteraction.unsubscribe();

          this.subscriptions.remove(subscriberToInteraction);
        }
      });

    this.subscriptions.add(subscriberToInteraction);
    return agent;
  }
}
