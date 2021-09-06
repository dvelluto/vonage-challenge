import { TestBed } from '@angular/core/testing';
import { Agent, Manager, Supervisor } from '@libs/agents';
import { InteractionInterface, MessageInteraction, PhoneInteraction } from '@libs/interactions';
import { pipe } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ContactCenterService } from './contact-center.service';

describe('ContactCenterService', () => {
  let service: ContactCenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactCenterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should assign a phone interaction to the first available agent', () => {
    // Arrange
    const agent = new Agent();
    const interaction = new PhoneInteraction();
    service['agents'] = [agent];

    // Act
    service.queueNewInteraction(interaction);

    // Assert
    expect(agent.isBusy()).toBeTruthy();
    expect(agent.isAvailableForPhones()).toBeFalsy();
    expect(agent.isAvailableForMessages()).toBeFalsy();
  })

  it('should assign a phone interaction to the next available agent', () => {
    // Arrange
    const agentBusy = new Agent();
    const agentFree = new Agent();
    const interaction = new PhoneInteraction();
    const agentBusyMock = jest.spyOn(agentBusy, 'isBusy').mockReturnValue(true)
    service['agents'] = [agentBusy, agentFree];

    // Act
    service.queueNewInteraction(interaction);

    // Assert
    expect(agentBusyMock).toHaveBeenCalled();
    expect(agentFree.isBusy()).toBeTruthy();
    expect(agentFree.isAvailableForPhones()).toBeFalsy();
    expect(agentFree.isAvailableForMessages()).toBeFalsy();
  })

  it('should assign a message interaction to the next available agent', () => {
    // Arrange
    const agentBusy = new Agent();
    const agentFree = new Agent();
    const interaction = new MessageInteraction();
    const agentBusyMock = jest.spyOn(agentBusy, 'isBusy').mockReturnValue(true)
    service['agents'] = [agentBusy, agentFree];

    // Act
    service.queueNewInteraction(interaction);

    // Assert
    expect(agentBusyMock).toHaveBeenCalled();
    expect(agentFree.isBusy()).toBeFalsy();
    expect(agentFree.isAvailableForPhones()).toBeFalsy();
    expect(agentFree.isAvailableForMessages()).toBeTruthy();
  })

  it('should assign a message interaction to the next available supervisor', () => {
    // Arrange
    const agentBusy = new Agent();
    const supervisor = new Supervisor();
    const interaction = new MessageInteraction();
    const agentBusyMock = jest.spyOn(agentBusy, 'isBusy').mockReturnValue(true)
    service['agents'] = [agentBusy];
    service['supervisors'] = [supervisor];

    // Act
    service.queueNewInteraction(interaction);

    // Assert
    expect(agentBusyMock).toHaveBeenCalled();
    expect(supervisor.isBusy()).toBeFalsy();
    expect(supervisor.isAvailableForPhones()).toBeFalsy();
    expect(supervisor.isAvailableForMessages()).toBeTruthy();
  })

  it('should assign a phone interaction to the next available supervisor', () => {
    // Arrange
    const agentBusy = new Agent();
    const supervisorBusy = new Supervisor();
    const supervisor = new Supervisor();
    const interaction = new PhoneInteraction();
    const agentBusyMock = jest.spyOn(agentBusy, 'isBusy').mockReturnValue(true)
    const supervisorBusyMock = jest.spyOn(supervisorBusy, 'isBusy').mockReturnValue(true)
    service['agents'] = [agentBusy];
    service['supervisors'] = [supervisorBusy, supervisor];

    // Act
    service.queueNewInteraction(interaction);

    // Assert
    expect(agentBusyMock).toHaveBeenCalled();
    expect(supervisorBusyMock).toHaveBeenCalled();
    expect(supervisor.isBusy()).toBeTruthy();
    expect(supervisor.isAvailableForPhones()).toBeFalsy();
    expect(supervisor.isAvailableForMessages()).toBeFalsy();
  })

  it('should assign a phone interaction to the manager if available', () => {
    // Arrange
    const agentBusy = new Agent();
    const supervisorBusy = new Supervisor();
    const manager = new Manager();
    const interaction = new PhoneInteraction();
    const agentBusyMock = jest.spyOn(agentBusy, 'isBusy').mockReturnValue(true)
    const supervisorBusyMock = jest.spyOn(supervisorBusy, 'isBusy').mockReturnValue(true)
    service['agents'] = [agentBusy];
    service['supervisors'] = [supervisorBusy];
    service['managers'] = [manager];

    // Act
    service.queueNewInteraction(interaction);

    // Assert
    expect(agentBusyMock).toHaveBeenCalled();
    expect(supervisorBusyMock).toHaveBeenCalled();
    expect(manager.isBusy()).toBeTruthy();
    expect(manager.isAvailableForPhones()).toBeFalsy();
    expect(manager.isAvailableForMessages()).toBeFalsy();
  })

  it('should assign a message interaction to the manager if available', () => {
    // Arrange
    const agentBusy = new Agent();
    const supervisorBusy = new Supervisor();
    const manager = new Manager();
    const interaction = new MessageInteraction();
    const agentBusyMock = jest.spyOn(agentBusy, 'isBusy').mockReturnValue(true)
    const supervisorBusyMock = jest.spyOn(supervisorBusy, 'isBusy').mockReturnValue(true)
    service['agents'] = [agentBusy];
    service['supervisors'] = [supervisorBusy];
    service['managers'] = [manager];

    // Act
    service.queueNewInteraction(interaction);

    // Assert
    expect(agentBusyMock).toHaveBeenCalled();
    expect(supervisorBusyMock).toHaveBeenCalled();
    expect(manager.isBusy()).toBeTruthy();
    expect(manager.isAvailableForPhones()).toBeFalsy();
    expect(manager.isAvailableForMessages()).toBeFalsy();
  })

  it('should discard the interaction if no one is available', () => {
    // Arrange
    const agentBusy = new Agent();
    const supervisorBusy = new Supervisor();
    const managerBusy = new Manager();
    const interaction = new MessageInteraction();
    const agentBusyMock = jest.spyOn(agentBusy, 'isBusy').mockReturnValue(true)
    const supervisorBusyMock = jest.spyOn(supervisorBusy, 'isBusy').mockReturnValue(true)
    const managerBusyMock = jest.spyOn(managerBusy, 'isBusy').mockReturnValue(true)
    service['agents'] = [agentBusy];
    service['supervisors'] = [supervisorBusy];
    service['managers'] = [managerBusy];

    // Act
    service.queueNewInteraction(interaction);

    // Assert
    expect(agentBusyMock).toHaveBeenCalled();
    expect(supervisorBusyMock).toHaveBeenCalled();
    expect(managerBusyMock).toHaveBeenCalled();
  })

  it('should discard an interaction not handlable by agents', () => {
    // Arrange
    const unknownInteraction = { type: NaN } as InteractionInterface;
    const agentFree = new Agent();
    service['agents'] = [agentFree];
    // Act
    service.queueNewInteraction(unknownInteraction);

    // Assert
    expect(agentFree.isBusy()).toBeFalsy();
  });

  it('should add a new Agent', () => {
    // Arrange
    const oldMaxSupervisors = service['maxSupervisors'];

    // Act 
    service.addAgents();

    // Assert
    expect(service['agents'].length).toEqual(1);
    expect(service['maxSupervisors']).toBeGreaterThan(oldMaxSupervisors);
  });

  it('should remove an Agent', () => {
    // Arrange
    service.addAgents();
    const oldMaxSupervisors = service['maxSupervisors'];

    // Act 
    service.addAgents(-1);

    // Assert
    expect(service['agents'].length).toEqual(0);
    expect(service['maxSupervisors']).toBeLessThan(oldMaxSupervisors);
  });

  it('should add a new Supervisor', () => {
    // Arrange
    service.addAgents();

    // Act 
    service.addSupervisors();

    // Assert
    expect(service['supervisors'].length).toEqual(1);
  });

  it('should remove a Supervisor', () => {
    // Arrange
    service.addAgents();
    service.addSupervisors();

    // Act 
    service.addSupervisors(-1);

    // Assert
    expect(service['supervisors'].length).toEqual(0);
  });


  it('should add a new Manager', () => {
    // Arrange

    // Act 
    service.addManagers();

    // Assert
    expect(service['managers'].length).toEqual(1);
  });

  it('should remove a Manager', () => {
    // Arrange

    // Act 
    service.addManagers(-1);

    // Assert
    expect(service['managers'].length).toEqual(0);
  });

  it('should remove a Supervisor if removing an Agent reduce the max number of supervisors', () => {
    // Arrange
    service.addAgents(2);
    service.addSupervisors(2);

    // Act
    service.addAgents(-1);

    // Assert
    expect(service['supervisors'].length).toBeLessThan(2);
  });

  it('should not remove more Agents/Supervisors/Managers than available', () => {
    // Arrange
    service.addAgents(3);

    // Act
    service.addAgents(-4);

    // Assert
    expect(service['agents'].length).toEqual(0);
  });

  it('should remove interaction when ended', () => {
    // Arrange
    const agent = new Agent();
    const interaction = new PhoneInteraction();
    service['agents'] = [agent];
    service.queueNewInteraction(interaction);

    // Act
    interaction.start();

    // Assert
    interaction.hasEnded().pipe(filter(e => !!e)).subscribe(_ => {

      expect(agent.isBusy()).toBeFalsy();
      expect(agent.isAvailableForPhones()).toBeTruthy();
      expect(agent.isAvailableForMessages()).toBeTruthy();
    });
  });

  it('should unsubscribe on ngOnDestroy', () => {
    // Arrange

    // Act
    service.ngOnDestroy();

    // Assert
  });
});
