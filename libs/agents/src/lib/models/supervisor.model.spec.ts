import { Supervisor } from "./supervisor.model";
import { MessageInteraction, PhoneInteraction } from "@libs/interactions";


describe('supervisor tests', () => {

  describe('when calling isBusy', () => {
    it('should return false when no interactions in supervisor', () => {
      // Arrange
      const supervisor = new Supervisor();

      // Act
      const result = supervisor.isBusy();

      // Assert
      expect(result).toBeFalsy();
    });

    it('should return false when 1 message interaction in supervisor', () => {
      // Arrange
      const supervisor = new Supervisor();
      const interaction = new MessageInteraction();

      supervisor.activeInteractions = [interaction];

      // Act
      const result = supervisor.isBusy();

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return true when 1 phone interaction in supervisor', () => {
      // Arrange
      const supervisor = new Supervisor();
      const interaction = new PhoneInteraction();

      supervisor.activeInteractions = [interaction];

      // Act
      const result = supervisor.isBusy();

      // Assert
      expect(result).toBeTruthy();
    });
  })

  describe('when calling isAvailableForMessages', () => {
    it('should return false when 1 phone interaction in supervisor', () => {
      // Arrange
      const supervisor = new Supervisor();
      const interaction = new PhoneInteraction();

      supervisor.activeInteractions = [interaction];

      // Act
      const result = supervisor.isAvailableForMessages();

      // Assert
      expect(result).toBeFalsy();
    });

    it('should return true when no interaction in supervisor', () => {
      // Arrange
      const supervisor = new Supervisor();

      supervisor.activeInteractions = [];

      // Act
      const result = supervisor.isAvailableForMessages();

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return true when 1 message interaction in supervisor', () => {
      // Arrange
      const supervisor = new Supervisor();
      const interaction = new MessageInteraction();

      supervisor.activeInteractions = [interaction];

      // Act
      const result = supervisor.isAvailableForMessages();

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('when calling isAvailableFoPhones', () => {
    it('should return false when 1 phone interaction in supervisor', () => {
      // Arrange
      const supervisor = new Supervisor();
      const interaction = new PhoneInteraction();

      supervisor.activeInteractions = [interaction];

      // Act
      const result = supervisor.isAvailableForPhones();

      // Assert
      expect(result).toBeFalsy();
    });

    it('should return true when no interaction in supervisor', () => {
      // Arrange
      const supervisor = new Supervisor();

      supervisor.activeInteractions = [];

      // Act
      const result = supervisor.isAvailableForPhones();

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when 1 message interaction in supervisor', () => {
      // Arrange
      const supervisor = new Supervisor();
      const interaction = new MessageInteraction();

      supervisor.activeInteractions = [interaction];

      // Act
      const result = supervisor.isAvailableForPhones();

      // Assert
      expect(result).toBeFalsy();
    });
  });

});
