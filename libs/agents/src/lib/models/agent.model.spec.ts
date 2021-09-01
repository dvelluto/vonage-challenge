import { Agent } from "./agent.model";
import { MessageInteraction, PhoneInteraction } from "@libs/interactions";


describe('agent tests', () => {

  describe('when calling isBusy', () => {
    it('should return false when no interactions in agent', () => {
      // Arrange
      const agent = new Agent();

      // Act
      const result = agent.isBusy();

      // Assert
      expect(result).toBeFalsy();
    });

    it('should return false when 1 message interaction in agent', () => {
      // Arrange
      const agent = new Agent();
      const interaction = new MessageInteraction();

      agent.activeInteractions = [interaction];

      // Act
      const result = agent.isBusy();

      // Assert
      expect(result).toBeFalsy();
    });

    it('should return true when 2 message interaction in agent', () => {
      // Arrange
      const agent = new Agent();
      const interaction = new MessageInteraction();

      agent.activeInteractions = [interaction, interaction];

      // Act
      const result = agent.isBusy();

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return true when 1 phone interaction in agent', () => {
      // Arrange
      const agent = new Agent();
      const interaction = new PhoneInteraction();

      agent.activeInteractions = [interaction];

      // Act
      const result = agent.isBusy();

      // Assert
      expect(result).toBeTruthy();
    });
  })

  describe('when calling isAvailableForMessages', () => {
    it('should return false when 1 phone interaction in agent', () => {
      // Arrange
      const agent = new Agent();
      const interaction = new PhoneInteraction();

      agent.activeInteractions = [interaction];

      // Act
      const result = agent.isAvailableForMessages();

      // Assert
      expect(result).toBeFalsy();
    });

    it('should return true when no interaction in agent', () => {
      // Arrange
      const agent = new Agent();

      agent.activeInteractions = [];

      // Act
      const result = agent.isAvailableForMessages();

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return true when 1 message interaction in agent', () => {
      // Arrange
      const agent = new Agent();
      const interaction = new MessageInteraction();

      agent.activeInteractions = [interaction];

      // Act
      const result = agent.isAvailableForMessages();

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when 2 or more message interaction in agent', () => {
      // Arrange
      const agent = new Agent();
      const interaction = new MessageInteraction();

      agent.activeInteractions = [interaction, interaction];

      // Act
      const result = agent.isAvailableForMessages();

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('when calling isAvailableFoPhones', () => {
    it('should return false when 1 phone interaction in agent', () => {
      // Arrange
      const agent = new Agent();
      const interaction = new PhoneInteraction();

      agent.activeInteractions = [interaction];

      // Act
      const result = agent.isAvailableForPhones();

      // Assert
      expect(result).toBeFalsy();
    });

    it('should return true when no interaction in agent', () => {
      // Arrange
      const agent = new Agent();

      agent.activeInteractions = [];

      // Act
      const result = agent.isAvailableForPhones();

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when 1 message interaction in agent', () => {
      // Arrange
      const agent = new Agent();
      const interaction = new MessageInteraction();

      agent.activeInteractions = [interaction];

      // Act
      const result = agent.isAvailableForPhones();

      // Assert
      expect(result).toBeFalsy();
    });

    it('should return false when 2 or more message interaction in agent', () => {
      // Arrange
      const agent = new Agent();
      const interaction = new MessageInteraction();

      agent.activeInteractions = [interaction, interaction];

      // Act
      const result = agent.isAvailableForPhones();

      // Assert
      expect(result).toBeFalsy();
    });
  });

});
