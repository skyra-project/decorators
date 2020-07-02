import { Cache } from '@klasa/cache';
import { client, MockCommandStore } from '@mocks/MockInstances';
import { ApplyOptions } from '@src/core-decorators';
import { CreateResolver } from '@src/starlight-decorators';
import { Command, CommandOptions, CustomUsageArgument } from 'klasa';

describe('CreateResolver Decorator', () => {
	const mockCommandStore = new MockCommandStore('name', client);
	const receivedResolvers = new Cache<string, CustomUsageArgument>([
		[
			'key',
			(arg, _possible, message, [action]) => {
				if (action === 'show' || arg) return arg || '';
				throw message.language.get('COMMAND_CONF_NOKEY');
			}
		]
	]);

	test('Applies Resolver to a command', () => {
		@CreateResolver('key', (arg, _possible, message, [action]) => {
			if (action === 'show' || arg) return arg || '';
			throw message.language.get('COMMAND_CONF_NOKEY');
		})
		class TestCommand extends Command {}

		const instance = new TestCommand(mockCommandStore, __dirname, [__filename]);

		expect(instance.usage.customResolvers.firstValue).toEqual(expect.any(Function));
		expect(instance.usage.customResolvers.firstKey).toEqual(receivedResolvers.firstKey);

		expect(instance.usage.customResolvers.size).toEqual(1);
	});

	test('Is compatible with @ApplyOptions', () => {
		@ApplyOptions<CommandOptions>({
			name: 'test',
			cooldown: 10
		})
		@CreateResolver('key', (arg, _possible, message, [action]) => {
			if (action === 'show' || arg) return arg || '';
			throw message.language.get('COMMAND_CONF_NOKEY');
		})
		class TestCommand extends Command {}

		const instance = new TestCommand(mockCommandStore, __dirname, [__filename]);

		expect(instance.name).toEqual('test');
		expect(instance.usage.customResolvers.firstValue).toEqual(expect.any(Function));
		expect(instance.usage.customResolvers.firstKey).toEqual(receivedResolvers.firstKey);

		expect(instance.usage.customResolvers.size).toEqual(1);
	});
});
