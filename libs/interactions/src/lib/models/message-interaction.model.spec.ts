import { MessageInteraction } from './message-interaction.model';

describe('message-interaction tests', () => {
  it('should start the interaction and emit when resolve after 5s', () => {
    // Arrange
    const messageInteraction = new MessageInteraction();
    messageInteraction.start();

    // Act
    const result = messageInteraction.hasEnded();

    // Assert
    result.subscribe(res => expect(res).toBeTruthy());
  });
});
