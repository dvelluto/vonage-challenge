import { Component } from '@angular/core';
import { Agent, AgentInterface, AgentTypes, BaseAgent } from '@libs/agents';
import { ContactCenterService } from '@libs/contact-center';
import { InteractionInterface, MessageInteraction, PhoneInteraction } from '@libs/interactions';
import { BehaviorSubject, queue } from 'rxjs';
import { distinct, filter, map } from 'rxjs/operators';

@Component({
  selector: 'vonage-challenge-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ContactCenterService]
})
export class AppComponent {

  private agentsSubject = new BehaviorSubject<number>(0);
  private supervisorsSubject = new BehaviorSubject<number>(0);
  private managersSubject = new BehaviorSubject<number>(0);

  private queuedInteractionsSubject = new BehaviorSubject<Array<InteractionInterface>>([]);
  private handledInteractionsSubject = new BehaviorSubject<Array<InteractionInterface>>([]);
  private discardedInteractionsSubject = new BehaviorSubject<Array<InteractionInterface>>([]);

  agents$ = this.agentsSubject.asObservable();
  supervisors$ = this.supervisorsSubject.asObservable();
  managers$ = this.managersSubject.asObservable();

  queuedInteractions$ = this.queuedInteractionsSubject.asObservable();
  handledInteractions$ = this.handledInteractionsSubject.asObservable();
  discardedInteractions$ = this.discardedInteractionsSubject.asObservable();

  activePeople$ = this.contactCenter.getActiveAgentsOnInteractions$().pipe(
    map(a => a.filter(p => p !== undefined).map(p => p as AgentInterface))
  );
  activeAgents$ = this.activePeople$.pipe(
    map(a => a.filter(p => p.type === AgentTypes.Agent)),
    map(a => a.length)
  );
  activeSupervisors$ = this.activePeople$.pipe(
    map(a => a.filter(p => p.type === AgentTypes.Supervisor)),
    map(a => a.length)
  )
  activeManagers$ = this.activePeople$.pipe(
    map(a => a.filter(p => p.type === AgentTypes.Manager)),
    map(a => a.length),
  )

  inProcessing$ = this.activePeople$.pipe(
    map(array => array.map(a => a.idActiveInteractions).flat()),
    map(array => this.contactCenter.interactionsService.getInteractionsById(array)),
    map(({ phoneInteractions, messageInteractions }) => [...phoneInteractions, ...messageInteractions]),
    map(array => array.filter(i => !i.status.hasEnded))
  )

  title = 'vonage-app';

  constructor(public contactCenter: ContactCenterService) {
  }

  addSupervisor() {
    this.contactCenter.addSupervisors(1);
    this.supervisorsSubject.next(this.contactCenter.agentsService.getAgents(AgentTypes.Supervisor).length)
  }

  removeSupervisor() {
    this.contactCenter.addSupervisors(-1);
    this.supervisorsSubject.next(this.contactCenter.agentsService.getAgents(AgentTypes.Supervisor).length)
  }


  addManager() {
    this.contactCenter.addManagers(1);
    this.managersSubject.next(this.contactCenter.agentsService.getAgents(AgentTypes.Manager).length)
  }

  removeManager() {
    this.contactCenter.addManagers(-1);
    this.managersSubject.next(this.contactCenter.agentsService.getAgents(AgentTypes.Manager).length)
  }


  addAgent() {
    this.contactCenter.addAgents(1);
    this.agentsSubject.next(this.contactCenter.agentsService.getAgents(AgentTypes.Agent).length)
  }

  removeAgent() {
    this.contactCenter.addAgents(-1);
    this.agentsSubject.next(this.contactCenter.agentsService.getAgents(AgentTypes.Agent).length);
    this.supervisorsSubject.next(this.contactCenter.agentsService.getAgents(AgentTypes.Supervisor).length)
  }

  addPhoneInteractionToQueue() {
    const phone = new PhoneInteraction();
    const queued = this.contactCenter.queueNewInteraction(phone);

    this.updateInteractionSubjects(phone, queued);
  }

  addMessageInteractionToQueue() {
    const message = new MessageInteraction();
    const queued = this.contactCenter.queueNewInteraction(message);

    this.updateInteractionSubjects(message, queued);
  }

  private updateInteractionSubjects(interaction: InteractionInterface, isHandled: boolean) {
    const queuedInteractions = this.queuedInteractionsSubject.value;
    const handledInteractions = this.handledInteractionsSubject.value;
    const discardedInteractions = this.discardedInteractionsSubject.value;

    this.queuedInteractionsSubject.next([...queuedInteractions, interaction]);
    isHandled ? this.handledInteractionsSubject.next([...handledInteractions, interaction]) : this.discardedInteractionsSubject.next([...discardedInteractions, interaction]);
  }

}
