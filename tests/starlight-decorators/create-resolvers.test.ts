import { client, MockCommandStore } from '@mocks/MockInstances';
import { ApplyOptions } from '@src/core-decorators';
import { CreateResolvers } from '@src/starlight-decorators';
import { Command, CommandOptions } from 'klasa';

describe('CreateResolvers Decorator', () => {
	const mockCommandStore = new MockCommandStore('name', client);

	test('Applies Resolvers to a command', () => {
		@CreateResolvers([
			[
				'key',
				async (arg, _possible, message, [action]) => {
					if (action === 'show' || arg) return arg || '';
					throw await message.fetchLocale('commandConfNoKey');
				}
			],
			[
				'value',
				async (arg, possible, message, [action]) => {
					if (!['set', 'remove'].includes(action as string)) return null;
					if (arg) return message.client.arguments.get('...string')!.run(arg, possible, message);
					throw await message.fetchLocale('commandConfNoValue');
				}
			]
		])
		class TestCommand extends Command {}

		const instance = new TestCommand(mockCommandStore, [__filename], __dirname);
		const customResolvers = [...Object.entries(instance.usage.customResolvers)];

		expect(customResolvers[0][0]).toEqual('key');
		expect(customResolvers[0][1]).toEqual(expect.any(Function));

		expect(customResolvers[1][0]).toEqual('value');
		expect(customResolvers[1][1]).toEqual(expect.any(Function));

		expect(customResolvers.length).toEqual(2);
	});

	test('Is compatible with @ApplyOptions', () => {
		@ApplyOptions<CommandOptions>({
			name: 'test',
			cooldown: 10
		})
		@CreateResolvers([
			[
				'key',
				async (arg, _possible, message, [action]) => {
					if (action === 'show' || arg) return arg || '';
					throw await message.fetchLocale('commandConfNoKey');
				}
			]
		])
		class TestCommand extends Command {}

		const instance = new TestCommand(mockCommandStore, [__filename], __dirname);
		const customResolvers = [...Object.entries(instance.usage.customResolvers)];

		expect(instance.name).toEqual('test');
		expect(instance.cooldown).toEqual(10);

		expect(customResolvers[0][0]).toEqual('key');
		expect(customResolvers[0][1]).toEqual(expect.any(Function));

		expect(customResolvers.length).toEqual(1);
	});
});
