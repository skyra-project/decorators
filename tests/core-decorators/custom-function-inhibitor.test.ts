import { createFunctionInhibitor } from '../../src';

test('Custom Function Inhibitor', async () => {
	class Test {
		public value = Symbol('Test');

		@createFunctionInhibitor(() => true)
		public getValue() {
			return this.value;
		}
	}

	const instance = new Test();
	const result = await instance.getValue();
	expect(result).toBe(instance.value);
});
