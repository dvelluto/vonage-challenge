import { TestBed } from '@angular/core/testing';
import { AgentTypes } from '@libs/agents';

import { AgentsService } from './agents-service.service';

describe('AgentsService', () => {
  let service: AgentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a new Agent', () => {
    // Arrange

    // Act
    service.addAgents(1);

    // Assert
    expect(service.getAgents(AgentTypes.Agent).length).toEqual(1);
  });

  it('should remove an Agent', () => {
    // Arrange
    service.addAgents(1);

    // Act
    service.addAgents(-1);

    // Assert
    expect(service.getAgents(AgentTypes.Agent).length).toEqual(0);
  });

  it('should not add/remove an Agent if 0 requested', () => {
    // Arrange
    service.addAgents(1);

    // Act
    service.addAgents(0);

    // Assert
    expect(service.getAgents(AgentTypes.Agent).length).toEqual(1);
  });

  it('should add a new Supervisor', () => {
    // Arrange

    // Act
    service.addSupervisors(1);

    // Assert
    expect(service.getAgents(AgentTypes.Supervisor).length).toEqual(1);
  });

  it('should remove a Supervisor', () => {
    // Arrange
    service.addSupervisors(1);

    // Act
    service.addSupervisors(-1);

    // Assert
    expect(service.getAgents(AgentTypes.Supervisor).length).toEqual(0);
  });

  it('should not add/remove a Supervisor if 0 requested', () => {
    // Arrange
    service.addSupervisors(1);

    // Act
    service.addSupervisors(0);

    // Assert
    expect(service.getAgents(AgentTypes.Supervisor).length).toEqual(1);
  });

  it('should add a new Manager', () => {
    // Arrange

    // Act
    service.addManagers(1);

    // Assert
    expect(service.getAgents(AgentTypes.Manager).length).toEqual(1);
  });

  it('should remove a Manager', () => {
    // Arrange
    service.addManagers(1);

    // Act
    service.addManagers(-1);

    // Assert
    expect(service.getAgents(AgentTypes.Manager).length).toEqual(0);
  });

  it('should not add/remove a Manager if 0 requested', () => {
    // Arrange
    service.addManagers(1);

    // Act
    service.addManagers(0);

    // Assert
    expect(service.getAgents(AgentTypes.Manager).length).toEqual(1);
  });

  it('should remove all BaseAgents if a number > available Agents is passed', () => {
    // Arrange
    const availableAgents = 10;
    const requiredRemoved = availableAgents + 1;
    service.addAgents(availableAgents);

    // Act
    service.addAgents(- requiredRemoved);

    // Assert
    expect(service.getAgents(AgentTypes.Agent).length).toEqual(0);
  });

  it('should get the list of available Agents', () => {
    // Arrange
    service.addAgents(2);

    // Act
    const result = service.getAgents(AgentTypes.Agent);

    // Assert
    expect(result.length).toEqual(2);
  });

  it('should get the list of available Supervisors', () => {
    // Arrange
    service.addSupervisors(2);

    // Act
    const result = service.getAgents(AgentTypes.Supervisor);

    // Assert
    expect(result.length).toEqual(2);
  });

  it('should get the list of available Managers', () => {
    // Arrange
    service.addManagers(2);

    // Act
    const result = service.getAgents(AgentTypes.Manager);

    // Assert
    expect(result.length).toEqual(2);
  });

  it('should get an Agent by ID', () => {
    // Arrange
    service.addAgents(2);
    const testAgent = service.getAgents(AgentTypes.Agent)[0];

    // Act
    const result = service.getAgent(testAgent.id);

    // Assert
    expect(result).toBe(testAgent);
  });

  it('should get a Supervisor by ID', () => {
    // Arrange
    service.addSupervisors(2);
    const testSupervisor = service.getAgents(AgentTypes.Supervisor)[0];

    // Act
    const result = service.getAgent(testSupervisor.id);

    // Assert
    expect(result).toBe(testSupervisor);
  });

  it('should get a Manager by ID', () => {
    // Arrange
    service.addManagers(2);
    const testManager = service.getAgents(AgentTypes.Manager)[0];

    // Act
    const result = service.getAgent(testManager.id);

    // Assert
    expect(result).toBe(testManager);
  });

  it('should return undefined for unknown ID', () => {
    // Arrange
    service.addManagers(2);

    // Act
    const result = service.getAgent("unknownId");

    // Assert
    expect(result).toBeUndefined();
  });

  it('should add an interaction id to an agent', () => {
    // Arrange
    const interactionId = "testId";
    service.addAgents(1);
    const testAgent = service.getAgents(AgentTypes.Agent)[0];

    // Act
    service.addInteractionToAgent(testAgent.id, interactionId);

    // Assert
    expect(testAgent.idActiveInteractions).toContain(interactionId);
  });

  it('should remove an interaction id from an agent', () => {
    // Arrange
    const interactionId = "testId";
    service.addAgents(1);
    const testAgent = service.getAgents(AgentTypes.Agent)[0];
    service.addInteractionToAgent(testAgent.id, interactionId);

    // Act
    service.removeInteractionFromAgent(testAgent.id, interactionId);

    // Assert
    expect(testAgent.idActiveInteractions).not.toContain(interactionId);
  });

  it('should add an interaction id to an unknown agent', () => {
    // Arrange
    const interactionId = "testId";
    service.addAgents(1);

    // Act
    service.addInteractionToAgent("unknown", interactionId);

    // Assert
    expect(service.getAgents(AgentTypes.Agent).some(a => a.idActiveInteractions.includes(interactionId))).toBeFalsy();
  });

  it('should not remove an interaction id from an unknown agent', () => {
    // Arrange
    const interactionId = "testId";
    service.addAgents(1);
    const testAgent = service.getAgents(AgentTypes.Agent)[0];
    service.addInteractionToAgent(testAgent.id, interactionId);

    // Act
    service.removeInteractionFromAgent("unknown", interactionId);

    // Assert
    expect(testAgent.idActiveInteractions).toContain(interactionId);
  });
});
