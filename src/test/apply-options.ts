import ava from 'ava';
import { Command, CommandOptions } from 'klasa';
import { ApplyOptions } from '../';
import { MockCommandStore, MockClient } from './lib/class-mocks';

ava('ApplyOptions Decorator', test => {
	@ApplyOptions<CommandOptions>({
		name: 'test',
		cooldown: 10
	})
	class TestPiece extends Command {

		public getName() {
			return this.name;
		}

	}

	const instance = new TestPiece(new MockCommandStore('name', new MockClient()), [__filename], __dirname);

	test.is(instance.name, 'test', 'Name should be test as specified in ApplyOptions');
	test.is(instance.cooldown, 10, 'Cooldown should be 10 as specified in ApplyOptions');
	test.is(instance.guarded, false, 'Guard should be false as it is not provided');
});
