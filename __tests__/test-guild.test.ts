import { requiresGuildContext } from '../src';
import { Guild, Message } from '../__mocks__/class-mocks';

test('Test Guild (Required)', async () => {
	expect.assertions(2);

	class Test {

		@requiresGuildContext()
		public async getName(message: Message) {
			return message.guild!.name;
		}

	}

	const instance = new Test();
	{
		const guild = new Guild('Guild');
		const message = new Message('Hello World', guild, 5);
		const name = await instance.getName(message);
		expect(name).toBe('Guild');
	}

	{
		const guild = null;
		const message = new Message('Hello World', guild, 5);
		const name = await instance.getName(message);
		expect(name).toBe(undefined);
	}
});
