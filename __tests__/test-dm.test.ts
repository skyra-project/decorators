import { requiresDMContext } from '../src';
import { Guild, Message } from '../__mocks__/class-mocks';

test('Test DM (Required)', async () => {
	expect.assertions(2);

	class Test {

		@requiresDMContext()
		public async inGuild(message: Message) {
			return message.guild === null;
		}

	}

	const instance = new Test();
	{
		const guild = new Guild('Guild');
		const message = new Message('Hello World', guild, 5);
		const inGuild = await instance.inGuild(message);
		expect(inGuild).toBe(undefined);
	}

	{
		const guild = null;
		const message = new Message('Hello World', guild, 5);
		const inGuild = await instance.inGuild(message);
		expect(inGuild).toBe(true);
	}
});
