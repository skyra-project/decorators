import { createFunctionInhibitor } from '../src';

test('Custom Function Inhibitor', async () => {
	expect.assertions(1);

	class Test {

		public value = Symbol('Test');

		@createFunctionInhibitor(() => true)
		public async getValue() {
			return this.value;
		}

	}

	const instance = new Test();
	const result = await instance.getValue();
	expect(result).toBe(instance.value);
});
