import { Piece, PieceOptions, Store } from '@klasa/core';
import { Constructor, KlasaMessage } from 'klasa';

/**
 * Utility to make a method decorator with lighter syntax and inferred types.
 * @since 1.0.0
 * @param fn The method to decorate
 * @example
 * // Enumerable function
 * function enumerable(value: boolean) {
 *   return createMethodDecorator((_target, _propertyKey, descriptor) => {
 *     descriptor.enumerable = value;
 *   });
 * }
 */
export function createMethodDecorator(fn: MethodDecorator): MethodDecorator {
	return fn;
}

/**
 * Utility to make a class decorator with lighter syntax and inferred types.
 * @since 1.0.0
 * @param fn The class to decorate
 * @see {@link ApplyOptions}
 */
export function createClassDecorator<TFunction extends (...args: any[]) => void>(fn: TFunction): ClassDecorator {
	return fn;
}

/**
 * Decorator function that applies given options to any Klasa piece
 * @since 1.0.0
 * @param options The options to pass to the piece constructor
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function ApplyOptions<T extends PieceOptions>(options: T): ClassDecorator {
	return createClassDecorator(
		(target: Constructor<Piece>) =>
			class extends target {
				public constructor(store: Store<Piece>, file: string[], directory: string) {
					super(store, file, directory, options);
				}
			}
	);
}

/**
 * Utility to make function inhibitors.
 * @since 1.0.0
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
export function createFunctionInhibitor(inhibitor: Inhibitor, fallback: Fallback = (): void => undefined): MethodDecorator {
	return createMethodDecorator((_target, _propertyKey, descriptor) => {
		const method = descriptor.value;
		if (!method) throw new Error('Function inhibitors require a [[value]].');
		if (typeof method !== 'function') throw new Error('Function inhibitors can only be applied to functions.');

		descriptor.value = (async function descriptorValue(this: (...args: any[]) => any, ...args: any[]) {
			const canRun = await inhibitor(...args);
			return canRun ? method.call(this, ...args) : fallback.call(this, ...args);
		} as unknown) as undefined;
	});
}

/**
 * Requires a permission, this decorator requires the first argument to be a `KlasaMessage` instance
 * @since 1.0.0
 * @param value The minimum permission level for this inhibitor to pass
 * @param fallback The fallback value passed to `createFunctionInhibitor`
 */
export function requiresPermission(value: number, fallback: Fallback = (): void => undefined): MethodDecorator {
	return createFunctionInhibitor((message: KlasaMessage) => message.hasAtLeastPermissionLevel(value), fallback);
}

/**
 * Requires the message to be run in a guild context, this decorator requires the first argument to be a `KlasaMessage` instance
 * @since 1.0.0
 * @param fallback The fallback value passed to `createFunctionInhibitor`
 */
export function requiresGuildContext(fallback: Fallback = (): void => undefined): MethodDecorator {
	return createFunctionInhibitor((message: KlasaMessage) => message.guild !== null, fallback);
}

/**
 * Requires the message to be run in a dm context, this decorator requires the first argument to be a `KlasaMessage` instance
 * @since 1.0.0
 * @param fallback The fallback value passed to `createFunctionInhibitor`
 */
export function requiresDMContext(fallback: Fallback = (): void => undefined): MethodDecorator {
	return createFunctionInhibitor((message: KlasaMessage) => message.guild === null, fallback);
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
