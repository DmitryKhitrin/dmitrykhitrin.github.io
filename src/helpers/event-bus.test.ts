import {EventBus} from './event-bus';

const eventBus = new EventBus();

describe('EventBus', () => {
    test('Should emit event', () => {
        const callback = jest.fn();

        eventBus.on('buzz', callback);
        eventBus.emit('buzz');
        expect(callback).toHaveBeenCalled();
    });
});
