import { TestBed } from '@angular/core/testing';
import { InteractionStatus, MessageInteraction, PhoneInteraction } from '@libs/interactions';

import { InteractionsService } from './interactions-service.service';

describe('InteractionsServiceService', () => {
  let service: InteractionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InteractionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add interaction to active interactions', () => {
    // Arrange
    const interaction = new PhoneInteraction();

    // Act
    const result = service.addInteractionToActive(interaction);

    // Assert
    expect(result.includes(interaction)).toBeTruthy();
  });

  it('should remove interaction from active list', () => {
    // Arrange
    const interaction = new PhoneInteraction();
    service.addInteractionToActive(interaction);

    // Act
    const result = service.removeInteractionFromActiveById(interaction.id);

    // Assert
    expect(result.length).toBe(0);

  })

  it('should retrieve the list of interaction given the list of ids', () => {
    // Arrange
    const phoneInteraction = new PhoneInteraction();
    const messageInteraction = new MessageInteraction();
    service.addInteractionToActive(phoneInteraction);
    service.addInteractionToActive(messageInteraction);

    // Act
    const result = service.getInteractionsById([phoneInteraction.id, messageInteraction.id]);

    // Assert
    expect(result.phoneInteractions.includes(phoneInteraction)).toBeTruthy();
    expect(result.messageInteractions.includes(messageInteraction)).toBeTruthy();
  });

  it('should start an interaction', () => {
    // Arrange
    jest.useFakeTimers();

    const phoneInteraction = new PhoneInteraction();

    // Act
    const result = service.startInteraction(phoneInteraction);

    // Assert
    const subscriber = result.subscribe((status: InteractionStatus) => {
      expect(status.hasStarted).toBeTruthy();
      expect(status.hasEnded).toBeTruthy();
    });
  });
});
