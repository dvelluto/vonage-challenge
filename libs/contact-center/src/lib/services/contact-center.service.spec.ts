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
    service.agents = [agent];

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
    service.agents = [agentBusy, agentFree];

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
    service.agents = [agentBusy, agentFree];

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
    service.agents = [agentBusy];
    service.supervisors = [supervisor];

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
    service.agents = [agentBusy];
    service.supervisors = [supervisorBusy, supervisor];

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
    service.agents = [agentBusy];
    service.supervisors = [supervisorBusy];
    service.managers = [manager];

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
    service.agents = [agentBusy];
    service.supervisors = [supervisorBusy];
    service.managers = [manager];

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
    service.agents = [agentBusy];
    service.supervisors = [supervisorBusy];
    service.managers = [managerBusy];

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
    service.agents = [agentFree];
    // Act
    service.queueNewInteraction(unknownInteraction);

    // Assert
    expect(agentFree.isBusy()).toBeFalsy();
  });

  it('should remove interaction when ended', () => {
    // Arrange
    const agent = new Agent();
    const interaction = new PhoneInteraction();
    service.agents = [agent];
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
