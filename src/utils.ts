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

/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Discord permissions for [[requiredPermissions]]
 * This is a list of strings of permissions so you can apply your own i18n over each
 */
export interface PermissionStrings {
	ADMINISTRATOR: string;
	VIEW_AUDIT_LOG: string;
	MANAGE_GUILD: string;
	MANAGE_ROLES: string;
	MANAGE_CHANNELS: string;
	KICK_MEMBERS: string;
	BAN_MEMBERS: string;
	CREATE_INSTANT_INVITE: string;
	CHANGE_NICKNAME: string;
	MANAGE_NICKNAMES: string;
	MANAGE_EMOJIS: string;
	MANAGE_WEBHOOKS: string;
	VIEW_CHANNEL: string;
	SEND_MESSAGES: string;
	SEND_TTS_MESSAGES: string;
	MANAGE_MESSAGES: string;
	EMBED_LINKS: string;
	ATTACH_FILES: string;
	READ_MESSAGE_HISTORY: string;
	MENTION_EVERYONE: string;
	USE_EXTERNAL_EMOJIS: string;
	ADD_REACTIONS: string;
	CONNECT: string;
	SPEAK: string;
	STREAM: string;
	MUTE_MEMBERS: string;
	DEAFEN_MEMBERS: string;
	MOVE_MEMBERS: string;
	USE_VAD: string;
	PRIORITY_SPEAKER: string;
	VIEW_GUILD_INSIGHTS: string;
}
/* eslint-enable @typescript-eslint/naming-convention */

/**
 * Utility to make a method decorator with lighter syntax and inferred types.
 *
 * ```ts
 * // Enumerable function
 *	function enumerable(value: boolean) {
 *		return createMethodDecorator((_target, _propertyKey, descriptor) => {
 *			descriptor.enumerable = value;
 *		});
 *	}
 * ```
 * @since 1.0.0
 * @param fn The method to decorate
 */
export function createMethodDecorator(fn: MethodDecorator): MethodDecorator {
	return fn;
}

/**
 * Utility to make a class decorator with lighter syntax and inferred types.
 * @since 1.0.0
 * @param fn The class to decorate
 * @see [[ApplyOptions]]
 */
export function createClassDecorator<TFunction extends (...args: any[]) => void>(fn: TFunction): ClassDecorator {
	return fn;
}

/**
 * Utility to make function inhibitors.
 *
 * ```ts
 *	// No fallback (returns undefined)
 *	function requiresPermission(value: number) {
 *		return createFunctionInhibitor((message: KlasaMessage) =>
 *			message.hasAtLeastPermissionLevel(value));
 *	}
 *
 *	// With fallback
 *	function requiresPermission(
 *		value: number,
 *		fallback: () => unknown = () => undefined
 *	) {
 *		return createFunctionInhibitor((message: KlasaMessage) =>
 *			message.hasAtLeastPermissionLevel(value), fallback);
 *	}
 * ```
 * @since 1.0.0
 * @param inhibitor The function that defines whether or not the function should be run, returning the returned value from fallback
 * @param fallback The fallback value that defines what the method should return in case the inhibitor fails
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
 * Creates a new proxy to efficiently add properties to class without creating subclasses
 * @param target The constructor of the class to modify
 * @param handler The handler function to modify the constructor behaviour for the target
 * @hidden
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function createProxy<T extends object>(target: T, handler: Omit<ProxyHandler<T>, 'get'>): T {
	return new Proxy(target, {
		...handler,
		get: (target, property) => {
			const value = Reflect.get(target, property);
			return typeof value === 'function' ? (...args: readonly unknown[]) => value.apply(target, args) : value;
		}
	});
}
