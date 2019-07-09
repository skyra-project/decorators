/**
 * Utility to make a method decorator with lighter syntax and inferred types.
 * @since 0.0.1
 * @param fn The method to decorate
 * @example
 * // Enumerable function
 * function enumerable(value: boolean) {
 *   return createMethodDecorator((_target, _propertyKey, descriptor) => {
 *     descriptor.enumerable = value;
 *   });
 * }
 */
export function createMethodDecorator(fn: MethodDecorator) {
	return fn;
}

/**
 * Utility to make function inhibitors.
 * @since 0.0.1
 * @param inhibitor The function that defines whether or not the function should be run, returning the returned value from fallback
 * @param fallback The fallback value that defines what the method should return in case the inhibitor fails
 * @example
 * // No fallback (returns undefined)
 * function requiresPermission(value: number) {
 *   return createFunctionInhibitor((message: KlasaMessage) =>
 *     message.hasAtLeastPermissionLevel(value));
 * }
 *
 * @example
 * // With fallback
 * function requiresPermission(
 *   value: number,
 *   fallback: () => unknown = () => undefined
 * ) {
 *   return createFunctionInhibitor((message: KlasaMessage) =>
 *     message.hasAtLeastPermissionLevel(value), fallback);
 * }
 */
export function createFunctionInhibitor(this: any, inhibitor: Inhibitor, fallback: Fallback = () => undefined) {
	return createMethodDecorator((_target, _propertyKey, descriptor) => {
		const method = descriptor.value;
		if (!method) throw new Error('Function inhibitors require a [[value]].');
		if (typeof method !== 'function') throw new Error('Function inhibitors can only be applied to functions.');

		descriptor.value = (async (...args: any[]) => {
			const canRun = await inhibitor(...args);
			return canRun ? method.call(this, ...args) : fallback.call(this, ...args);
		}) as unknown as undefined;
	});
}

/**
 * Requires a permission, this decorator requires the first argument to be a `KlasaMessage` instance
 * @since 0.0.1
 * @param value The minimum permission level for this inhibitor to pass
 * @param fallback The fallback value passed to `createFunctionInhibitor`
 */
export function requiresPermission(value: number, fallback: Fallback = () => undefined) {
	return createFunctionInhibitor((message: any) => message.hasAtLeastPermissionLevel(value), fallback);
}

/**
 * Requires the message to be run in a guild context, this decorator requires the first argument to be a `KlasaMessage` instance
 * @since 0.0.1
 * @param fallback The fallback value passed to `createFunctionInhibitor`
 */
export function requiresGuildContext(fallback: Fallback = () => undefined) {
	return createFunctionInhibitor((message: any) => message.guild !== null, fallback);
}

/**
 * Requires the message to be run in a dm context, this decorator requires the first argument to be a `KlasaMessage` instance
 * @since 0.0.1
 * @param fallback The fallback value passed to `createFunctionInhibitor`
 */
export function requiresDMContext(fallback: Fallback = () => undefined) {
	return createFunctionInhibitor((message: any) => message.guild === null, fallback);
}

/**
 * The inhibitor interface
 */
export interface Inhibitor {
	/**
	 * The arguments passed to the class' method
	 */
	(...args: any[]): boolean | Promise<boolean>;
}

/**
 * The fallback interface, this is called when the inhibitor returns or resolves with a falsy value
 */
export interface Fallback {
	/**
	 * The arguments passed to the class' method
	 */
	(...args: any[]): unknown;
}
