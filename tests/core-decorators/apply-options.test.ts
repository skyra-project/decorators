import { client, MockCommandStore } from '@mocks/MockInstances';
import { ApplyOptions } from '@src/core-decorators';
import { Command, CommandOptions } from 'klasa';

test('ApplyOptions Decorator', () => {
	@ApplyOptions<CommandOptions>({
		name: 'test',
		cooldown: 10
	})
	class TestPiece extends Command {
		public getName() {
			return this.name;
		}
	}

	const instance = new TestPiece(new MockCommandStore('name', client), __dirname, [__filename]);

	expect(instance.name).toBe('test');
	expect(instance.cooldown).toBe(10);
	expect(instance.guarded).toBe(false);
	expect(Object.getOwnPropertyDescriptor(instance.constructor.prototype, 'getName')).toBeDefined();
});
