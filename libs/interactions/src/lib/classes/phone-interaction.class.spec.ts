import { PhoneInteraction } from './phone-interaction.class';

describe('phone-interaction tests', () => {
  it('should start the interaction and emit when resolve after 10s', () => {
    // Arrange
    const phoneInteraction = new PhoneInteraction();
    phoneInteraction.start();

    // Act
    const result = phoneInteraction.hasEnded();

    // Assert
    result.subscribe(res => expect(res).toBeTruthy());
  });
});
