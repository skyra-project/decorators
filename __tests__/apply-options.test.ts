import { Command, CommandOptions } from 'klasa';
import { ApplyOptions } from '../src';
import { MockCommandStore, MockClient } from '../__mocks__/class-mocks';

test('ApplyOptions Decorator', () => {
	expect.assertions(3);

	@ApplyOptions<CommandOptions>({
		name: 'test',
		aliases: ['t'],
		cooldown: 10
	})
	class TestPiece extends Command {

		public getName() {
			return this.name;
		}

	}

	const instance = new TestPiece(new MockCommandStore('name', new MockClient()), [__filename], __dirname);
	expect(instance.name).toBe('test');
	expect(instance.cooldown).toBe(10);
	expect(instance.aliases).toStrictEqual(['t']);
});
