import ava from 'ava';
import { requiresGuildContext } from '../src';
import { Guild, Message } from './lib/class-mocks';

class Test {
	@requiresGuildContext()
	public getName(message: Message) {
		return message.guild!.name;
	}
}

const instance = new Test();

ava('Test Guild (Required)', async test => {
	const guild = new Guild('Guild');
	const message = new Message('Hello World', guild, 5);
	const name = await instance.getName(message);
	test.is(name, 'Guild');
});

ava('Test Guild (Non-Existant)', async test => {
	const guild = null;
	const message = new Message('Hello World', guild, 5);
	const name = await instance.getName(message);
	test.is(name, undefined);
});
