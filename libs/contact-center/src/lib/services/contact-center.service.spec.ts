import { TestBed } from '@angular/core/testing';
import { pipe } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Agent, AgentsService, AgentTypes, Manager, Supervisor } from '@libs/agents';
import { InteractionInterface, InteractionsService, MessageInteraction, PhoneInteraction } from '@libs/interactions';

import { ContactCenterService } from './contact-center.service';

describe('ContactCenterService', () => {
  let service: ContactCenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AgentsService, InteractionsService]
    });
    service = TestBed.inject(ContactCenterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should assign a phone interaction to the first available agent', () => {
    // Arrange
    const interaction = new PhoneInteraction();
    service.addAgents(1);
    const testAgent = service.agentsService.getAgents(AgentTypes.Agent)[0];

    // Act
    const result = service.queueNewInteraction(interaction);

    // Assert
    expect(result).toBeTruthy();
    expect(service.isAgentBusy(testAgent.id)).toBeTruthy();
  })

  it('should assign a phone interaction to the next available agent', () => {
    // Arrange
    service.addAgents(2);
    const agentBusy = service.agentsService.getAgents(AgentTypes.Agent)[0];
    const agentFree = service.agentsService.getAgents(AgentTypes.Agent)[1];
    const interaction = new PhoneInteraction();


    // Act
    const result = service.queueNewInteraction(interaction);

    // Assert
    expect(result).toBeTruthy();
    expect(service.isAgentBusy(agentBusy.id)).toBeTruthy();
    expect(service.isAgentBusy(agentFree.id)).toBeFalsy();
  })

  it('should assign a message interaction to the next available agent', () => {
    // Arrange
    service.addAgents(2);
    const agentBusy = service.agentsService.getAgents(AgentTypes.Agent)[0];
    const agentFree = service.agentsService.getAgents(AgentTypes.Agent)[1];
    const interaction = new MessageInteraction();


    // Act
    const result = service.queueNewInteraction(interaction);

    // Assert
    expect(result).toBeTruthy();
    expect(service.isAgentBusy(agentBusy.id)).toBeTruthy();
    expect(service.isAgentBusy(agentFree.id)).toBeFalsy();
  })

  it('should assign a message interaction to the next available supervisor', () => {
    // Arrange
    service.agentsService.addSupervisors(1);
    const supervisorFree = service.agentsService.getAgents(AgentTypes.Supervisor)[0];
    const interaction = new MessageInteraction();


    // Act
    const result = service.queueNewInteraction(interaction);

    // Assert
    expect(result).toBeTruthy();
    expect(service.isAgentBusy(supervisorFree.id)).toBeTruthy();
  })


  it('should assign a phone interaction to the manager if available', () => {
    // Arrange
    service.agentsService.addManagers(1);
    const managerFree = service.agentsService.getAgents(AgentTypes.Manager)[0];
    const interaction = new MessageInteraction();

    // Act
    const result = service.queueNewInteraction(interaction);

    // Assert
    expect(result).toBeTruthy();
    expect(service.isAgentBusy(managerFree.id)).toBeTruthy();
  })


  it('should discard the interaction if no one is available', () => {
    // Arrange
    const interaction = new MessageInteraction();

    // Act
    const result = service.queueNewInteraction(interaction);

    // Assert
    expect(result).toBeFalsy();
  })

  it('should add a new Agent', () => {
    // Arrange
    const oldMaxSupervisors = service['maxSupervisors'];

    // Act 
    service.addAgents();

    // Assert
    expect(service.agentsService.getAgents(AgentTypes.Agent).length).toEqual(1);
    expect(service['maxSupervisors']).toBeGreaterThan(oldMaxSupervisors);
  });

  it('should remove an Agent', () => {
    // Arrange
    service.addAgents();
    const oldMaxSupervisors = service['maxSupervisors'];

    // Act 
    service.addAgents(-1);

    // Assert
    expect(service.agentsService.getAgents(AgentTypes.Agent).length).toEqual(0);
    expect(service['maxSupervisors']).toBeLessThan(oldMaxSupervisors);
  });

  it('should add a new Supervisor', () => {
    // Arrange
    service.addAgents();

    // Act 
    service.addSupervisors();

    // Assert
    expect(service.agentsService.getAgents(AgentTypes.Supervisor).length).toEqual(1);
  });

  it('should remove a Supervisor', () => {
    // Arrange
    service.addAgents();
    service.addSupervisors();

    // Act 
    service.addSupervisors(-1);

    // Assert
    expect(service.agentsService.getAgents(AgentTypes.Supervisor).length).toEqual(0);
  });


  it('should add a new Manager', () => {
    // Arrange

    // Act 
    service.addManagers();

    // Assert
    expect(service.agentsService.getAgents(AgentTypes.Manager).length).toEqual(1);
  });

  it('should remove a Manager', () => {
    // Arrange
    service.addManagers(1);

    // Act 
    service.addManagers(-1);

    // Assert
    expect(service.agentsService.getAgents(AgentTypes.Manager).length).toEqual(0);

  });

  it('should remove a Supervisor if removing an Agent reduce the max number of supervisors', () => {
    // Arrange
    service.addAgents(2);
    service.addSupervisors(2);

    // Act
    service.addAgents(-1);

    // Assert
    expect(service.agentsService.getAgents(AgentTypes.Supervisor).length).toEqual(1);
  });

  it('should not remove more Agents/Supervisors/Managers than available', () => {
    // Arrange
    service.addAgents(3);

    // Act
    service.addAgents(-4);

    // Assert
    expect(service.agentsService.getAgents(AgentTypes.Agent).length).toEqual(0);

  });

  it('should remove interaction when ended', () => {
    // Arrange
    const interaction = new PhoneInteraction();
    service.addAgents(1);
    const agent = service.agentsService.getAgents(AgentTypes.Agent)[0];

    // Act
    const result = service.queueNewInteraction(interaction);

    // Assert
    expect(result).toBeTruthy();
  });

  it('should unsubscribe on ngOnDestroy', () => {
    // Arrange

    // Act
    service.ngOnDestroy();

    // Assert
  });

  it('should getCurrentAgents assigned to interactions', (done) => {
    // Arrange
    const interaction = new PhoneInteraction();
    service.addAgents(2);
    const subscriber = service.getActiveAgentsOnInteractions$().subscribe(
      // Assert
      (activeAgents) => {
        expect(activeAgents.length).toEqual(1);
      }
    );

    // Act
    service.queueNewInteraction(interaction);


  })
});
