import { Component } from '@angular/core';
import { Agent, AgentInterface, AgentTypes, BaseAgent } from '@libs/agents';
import { ContactCenterService } from '@libs/contact-center';
import { BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

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

  agents$ = this.agentsSubject.asObservable();
  supervisors$ = this.supervisorsSubject.asObservable();
  managers$ = this.managersSubject.asObservable();

  activePeople$ = this.contactCenter.getActiveAgentsOnInteractions$().pipe(
    map(a => a.filter(p => p !== undefined).map(p => p as AgentInterface))
  );
  activeAgents$ = this.activePeople$.pipe(
    map(a => a.filter(p => p.type === AgentTypes.Agent))
  );
  activeSupervisors$ = this.activePeople$.pipe(
    map(a => a.filter(p => p.type === AgentTypes.Supervisor))
  )
  activeManagers$ = this.activePeople$.pipe(
    map(a => a.filter(p => p.type === AgentTypes.Manager))
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


}
