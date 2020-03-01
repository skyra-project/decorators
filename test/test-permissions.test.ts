import ava from 'ava';
import { requiresPermission } from '../src';
import { Message } from './lib/class-mocks';

class Test {
	@requiresPermission(5)
	public getContent(message: Message) {
		return message.content;
	}
}

ava('Test Permissions (Existent)', async test => {
	const instance = new Test();
	const message = new Message('Hello World', null, 5);
	const content = await instance.getContent(message);
	test.is(content, 'Hello World');
});

ava('Test Permissions (Non-Existent)', async test => {
	const instance = new Test();
	const message = new Message('Hello World', null, 4);
	const content = await instance.getContent(message);
	test.is(content, undefined);
});
