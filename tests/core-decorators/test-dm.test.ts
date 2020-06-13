import { Guild, Message } from '@mocks/MockInstances';
import { requiresDMContext } from '@src/core-decorators';

class Test {
	@requiresDMContext()
	public inGuild(message: Message) {
		return message.guild === null;
	}
}

const instance = new Test();

test('Test DM (Required)', async () => {
	const guild = new Guild('Guild');
	const message = new Message('Hello World', guild, 5);
	const inGuild = await instance.inGuild(message);
	expect(inGuild).toBe(undefined);
});

test('Test DM (Non-Existant)', async () => {
	const guild = null;
	const message = new Message('Hello World', guild, 5);
	const inGuild = await instance.inGuild(message);
	expect(inGuild).toBe(true);
});
