import { Guild, Message } from '@mocks/MockInstances';
import { requiresGuildContext } from '../../src';

class Test {
	@requiresGuildContext()
	public getName(message: Message) {
		return message.guild!.name;
	}
}

const instance = new Test();

test('Test Guild (Required)', async () => {
	const guild = new Guild('Guild');
	const message = new Message('Hello World', guild, 5);
	const name = await instance.getName(message);
	expect(name).toBe('Guild');
});

test('Test Guild (Non-Existant)', async () => {
	const guild = null;
	const message = new Message('Hello World', guild, 5);
	const name = await instance.getName(message);
	expect(name).toBe(undefined);
});
