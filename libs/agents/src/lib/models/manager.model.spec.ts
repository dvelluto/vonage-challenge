import { Manager } from "./manager.model";
import { MessageInteraction, PhoneInteraction } from "@libs/interactions";


describe('manager tests', () => {
  describe('when calling isBusy', () => {
    it('should return false when no interactions in manager', () => {
      // Arrange
      const manager = new Manager();

      // Act
      const result = manager.isBusy();

      // Assert
      expect(result).toBeFalsy();
    });

    it('should return true when 1 message interaction in manager', () => {
      // Arrange
      const manager = new Manager();
      const interaction = new MessageInteraction();

      manager.activeInteractions = [interaction];

      // Act
      const result = manager.isBusy();

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return true when 1 phone interaction in manager', () => {
      // Arrange
      const manager = new Manager();
      const interaction = new PhoneInteraction();

      manager.activeInteractions = [interaction];

      // Act
      const result = manager.isBusy();

      // Assert
      expect(result).toBeTruthy();
    });
  })

  describe('when calling isAvailableForMessages', () => {
    it('should return false when 1 phone interaction in manager', () => {
      // Arrange
      const manager = new Manager();
      const interaction = new PhoneInteraction();

      manager.activeInteractions = [interaction];

      // Act
      const result = manager.isAvailableForMessages();

      // Assert
      expect(result).toBeFalsy();
    });

    it('should return true when no interaction in manager', () => {
      // Arrange
      const manager = new Manager();

      manager.activeInteractions = [];

      // Act
      const result = manager.isAvailableForMessages();

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when 1 message interaction in manager', () => {
      // Arrange
      const manager = new Manager();
      const interaction = new MessageInteraction();

      manager.activeInteractions = [interaction];

      // Act
      const result = manager.isAvailableForMessages();

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('when calling isAvailableFoPhones', () => {
    it('should return false when 1 phone interaction in manager', () => {
      // Arrange
      const manager = new Manager();
      const interaction = new PhoneInteraction();

      manager.activeInteractions = [interaction];

      // Act
      const result = manager.isAvailableForPhones();

      // Assert
      expect(result).toBeFalsy();
    });

    it('should return true when no interaction in manager', () => {
      // Arrange
      const manager = new Manager();

      manager.activeInteractions = [];

      // Act
      const result = manager.isAvailableForPhones();

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when 1 message interaction in manager', () => {
      // Arrange
      const manager = new Manager();
      const interaction = new MessageInteraction();

      manager.activeInteractions = [interaction];

      // Act
      const result = manager.isAvailableForPhones();

      // Assert
      expect(result).toBeFalsy();
    });
  });

});
