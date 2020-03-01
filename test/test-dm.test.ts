import ava from 'ava';
import { requiresDMContext } from '../src';
import { Guild, Message } from './lib/class-mocks';

class Test {
	@requiresDMContext()
	public inGuild(message: Message) {
		return message.guild === null;
	}
}

const instance = new Test();

ava('Test DM (Required)', async test => {
	const guild = new Guild('Guild');
	const message = new Message('Hello World', guild, 5);
	const inGuild = await instance.inGuild(message);
	test.is(inGuild, undefined);
});

ava('Test DM (Non-Existant)', async test => {
	const guild = null;
	const message = new Message('Hello World', guild, 5);
	const inGuild = await instance.inGuild(message);
	test.is(inGuild, true);
});
