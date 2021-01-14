import { Constructor, Message, PermissionResolvable, Permissions, TextChannel } from 'discord.js';
import type { KlasaClient, Piece, PieceOptions } from 'klasa';
import { createClassDecorator, createFunctionInhibitor, createProxy, Fallback } from './utils';

/**
 * Decorator function that applies given options to any Klasa piece
 *
 * ```ts
 *	ApplyOptions<CommandOptions>({
 *		name: 'ping',
 *		cooldown: 10
 *	})
 *	export default class extends Command {}
 * ```
 * @since 1.0.0
 * @param options The options to pass to the piece constructor
 */
export function ApplyOptions<T extends PieceOptions>(optionsOrFn: T | ((client: KlasaClient) => T)): ClassDecorator {
	return createClassDecorator((target: Constructor<Piece>) =>
		createProxy(target, {
			construct: (ctor, [store, files, directory, baseOptions = {}]) =>
				new ctor(store, files, directory, {
					...baseOptions,
					...(typeof optionsOrFn === 'function' ? optionsOrFn(store.client) : optionsOrFn)
				})
		})
	);
}

/**
 * Requires a permission, this decorator requires the first argument to be a `KlasaMessage` instance
 * @since 1.0.0
 * @param value The minimum permission level for this inhibitor to pass
 * @param fallback The fallback value passed to `createFunctionInhibitor`
 */
export function requiresPermission(value: number, fallback: Fallback = (): void => undefined): MethodDecorator {
	return createFunctionInhibitor((message: Message) => message.hasAtLeastPermissionLevel(value), fallback);
}

/**
 * Allows you to set permissions required for individual methods
 * @since 2.1.0
 * @remark In particular useful for subcommand methods
 * @param permissionsResolvable Permissions that the method should have
 */
export const requiredPermissions = (permissionsResolvable: PermissionResolvable): MethodDecorator => {
	const resolved = Permissions.resolve(permissionsResolvable);
	return createFunctionInhibitor(async (message: Message) => {
		const missingPermissions =
			(message.channel as TextChannel)
				.permissionsFor(message.guild!.me ?? (await message.guild!.members.fetch(message.client.user!.id)))
				?.missing(resolved) ?? [];

		if (missingPermissions.length) {
			const t = await message.fetchT();

			throw t('inhibitors:missingBotPerms', { missing: missingPermissions.map((permission) => t(`permissions:${permission}`)) });
		}

		return true;
	});
};

/**
 * Requires the message to be run in a guild context, this decorator requires the first argument to be a `KlasaMessage` instance
 * @since 1.0.0
 * @param fallback The fallback value passed to `createFunctionInhibitor`
 */
export function requiresGuildContext(fallback: Fallback = (): void => undefined): MethodDecorator {
	return createFunctionInhibitor((message: Message) => message.guild !== null, fallback);
}

/**
 * Requires the message to be run in a dm context, this decorator requires the first argument to be a `KlasaMessage` instance
 * @since 1.0.0
 * @param fallback The fallback value passed to `createFunctionInhibitor`
 */
export function requiresDMContext(fallback: Fallback = (): void => undefined): MethodDecorator {
	return createFunctionInhibitor((message: Message) => message.guild === null, fallback);
}
