import { client, MockCommandStore } from '@mocks/MockInstances';
import { ApplyOptions } from '@src/core-decorators';
import { Command, CommandOptions } from 'klasa';

describe('ApplyOptions', () => {
	test('GIVEN options object THEN sets options', () => {
		@ApplyOptions<CommandOptions>({
			name: 'test',
			cooldown: 10
		})
		class TestPiece extends Command {
			public getName() {
				return this.name;
			}
		}

		const instance = new TestPiece(new MockCommandStore('name', client), [__filename], __dirname);

		expect(instance.name).toBe('test');
		expect(instance.cooldown).toBe(10);
		expect(instance.guarded).toBe(false);
	});
});
