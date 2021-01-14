import { client, MockCommandStore } from '@mocks/MockInstances';
import { ApplyOptions } from '@src/core-decorators';
import { CreateResolver } from '@src/starlight-decorators';
import { Command, CommandOptions } from 'klasa';

describe('CreateResolver Decorator', () => {
	const mockCommandStore = new MockCommandStore('name', client);

	test('Applies Resolver to a command', () => {
		@CreateResolver('key', async (arg, _possible, message, [action]) => {
			if (action === 'show' || arg) return arg || '';
			const t = await message.fetchT();
			throw t('commands/admin:confNoKey');
		})
		class TestCommand extends Command {}

		const instance = new TestCommand(mockCommandStore, [__filename], __dirname);
		const customResolvers = [...Object.entries(instance.usage.customResolvers)];

		expect(customResolvers[0][0]).toEqual('key');
		expect(customResolvers[0][1]).toEqual(expect.any(Function));

		expect(customResolvers.length).toEqual(1);
	});

	test('Is compatible with @ApplyOptions', () => {
		@ApplyOptions<CommandOptions>({
			name: 'test',
			cooldown: 10
		})
		@CreateResolver('key', async (arg, _possible, message, [action]) => {
			if (action === 'show' || arg) return arg || '';
			const t = await message.fetchT();
			throw t('commands/admin:confNoKey');
		})
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
