import { requiresPermission } from '../src';
import { Message } from '../__mocks__/class-mocks';

test('Test Permissions (Existent)', async () => {
	expect.assertions(1);

	class Test {

		@requiresPermission(5)
		public async getContent(message: Message) {
			return message.content;
		}

	}

	const instance = new Test();
	const message = new Message('Hello World', null, 5);
	const content = await instance.getContent(message);
	expect(content).toBe('Hello World');
});

test('Test Permissions (Existent)', async () => {
	expect.assertions(1);

	class Test {

		@requiresPermission(5)
		public async getContent(message: Message) {
			return message.content;
		}

	}

	const instance = new Test();
	const message = new Message('Hello World', null, 4);
	const content = await instance.getContent(message);
	expect(content).toBe(undefined);
});
