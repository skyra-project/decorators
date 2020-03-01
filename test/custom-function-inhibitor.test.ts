import ava from 'ava';
import { createFunctionInhibitor } from '../src';

ava('Custom Function Inhibitor', async test => {
	class Test {
		public value = Symbol('Test');

		@createFunctionInhibitor(() => true)
		public getValue() {
			return this.value;
		}
	}

	const instance = new Test();
	const result = await instance.getValue();
	test.is(result, instance.value);
});
