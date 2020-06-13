import { Message } from '@mocks/MockInstances';
import { requiresPermission } from '../../src';

class Test {
	@requiresPermission(5)
	public getContent(message: Message) {
		return message.content;
	}
}

test('Test Permissions (Existent)', async () => {
	const instance = new Test();
	const message = new Message('Hello World', null, 5);
	const content = await instance.getContent(message);
	expect(content).toBe('Hello World');
});

test('Test Permissions (Non-Existent)', async () => {
	const instance = new Test();
	const message = new Message('Hello World', null, 4);
	const content = await instance.getContent(message);
	expect(content).toBe(undefined);
});
