import { Cache } from '@klasa/cache';
import { client, MockCommandStore } from '@mocks/MockInstances';
import { CreateResolvers } from '@src/starlight-decorators';
import { Command, CommandOptions, CustomUsageArgument } from 'klasa';
import { ApplyOptions } from '../../dist';

describe('CreateResolvers Decorator', () => {
	const mockCommandStore = new MockCommandStore('name', client);
	const receivedResolvers = new Cache<string, CustomUsageArgument>([
		[
			'key',
			(arg, _possible, message, [action]) => {
				if (action === 'show' || arg) return arg || '';
				throw message.language.get('COMMAND_CONF_NOKEY');
			}
		],
		[
			'value',
			(arg, possible, message, [action]) => {
				if (!['set', 'remove'].includes(action as string)) return null;
				if (arg) return message.client.arguments.get('...string')!.run(arg, possible, message);
				throw message.language.get('COMMAND_CONF_NOVALUE');
			}
		]
	]);

	test('Applies Resolvers to a command', () => {
		@CreateResolvers([
			[
				'key',
				(arg, _possible, message, [action]) => {
					if (action === 'show' || arg) return arg || '';
					throw message.language.get('COMMAND_CONF_NOKEY');
				}
			],
			[
				'value',
				(arg, possible, message, [action]) => {
					if (!['set', 'remove'].includes(action as string)) return null;
					if (arg) return message.client.arguments.get('...string')!.run(arg, possible, message);
					throw message.language.get('COMMAND_CONF_NOVALUE');
				}
			]
		])
		class TestCommand extends Command {}

		const instance = new TestCommand(mockCommandStore, __dirname, [__filename]);

		expect(instance.usage.customResolvers.firstValue).toEqual(expect.any(Function));
		expect(instance.usage.customResolvers.firstKey).toEqual(receivedResolvers.firstKey);

		expect(instance.usage.customResolvers.lastValue).toEqual(expect.any(Function));
		expect(instance.usage.customResolvers.lastKey).toEqual(receivedResolvers.lastKey);

		expect(instance.usage.customResolvers.size).toEqual(2);
	});

	test('Is compatible with @ApplyOptions', () => {
		@ApplyOptions<CommandOptions>({
			name: 'test',
			cooldown: 10
		})
		@CreateResolvers([
			[
				'key',
				(arg, _possible, message, [action]) => {
					if (action === 'show' || arg) return arg || '';
					throw message.language.get('COMMAND_CONF_NOKEY');
				}
			]
		])
		class TestCommand extends Command {}

		const instance = new TestCommand(mockCommandStore, __dirname, [__filename]);

		expect(instance.name).toEqual('test');
		expect(instance.cooldown).toEqual(10);

		expect(instance.usage.customResolvers.firstValue).toEqual(expect.any(Function));
		expect(instance.usage.customResolvers.firstKey).toEqual(receivedResolvers.firstKey);

		expect(instance.usage.customResolvers.size).toEqual(1);
	});
});
