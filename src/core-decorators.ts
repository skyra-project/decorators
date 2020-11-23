import { Constructor, PermissionResolvable, Permissions, TextChannel } from 'discord.js';
import type { KlasaClient, KlasaMessage, Piece, PieceOptions } from 'klasa';
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
			construct: (ctor, [store, file, directory, baseOptions = {}]) =>
				new ctor(store, file, directory, {
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
	return createFunctionInhibitor((message: KlasaMessage) => message.hasAtLeastPermissionLevel(value), fallback);
}

/**
 * Allows you to set permissions required for individual methods
 * Requires a few steps of setup
 *
 * ```ts
 *	// 1. Module augment Klasa with the following code:
 *	declare module 'klasa' {
 *		interface Language {
 *			PERMISSIONS: PermissionStrings; // Import this interface from this lib
 *		}
 *	}
 *
 *	// 2. In your language file create a property:
 *	public PERMISSIONS = {
 *		ADMINISTRATOR: 'Administrator',
 *		VIEW_AUDIT_LOG: 'View Audit Log',
 *		MANAGE_GUILD: 'Manage Server',
 *		MANAGE_ROLES: 'Manage Roles',
 *		MANAGE_CHANNELS: 'Manage Channels',
 *		KICK_MEMBERS: 'Kick Members',
 *		BAN_MEMBERS: 'Ban Members',
 *		// ..etc
 *	}
 * ```
 * @since 2.1.0
 * @remark In particular useful for subcommand methods
 * @param permissionsResolvable Permissions that the method should have
 */
export const requiredPermissions = (permissionsResolvable: PermissionResolvable): MethodDecorator => {
	const resolved = Permissions.resolve(permissionsResolvable);
	return createFunctionInhibitor(async (message: KlasaMessage) => {
		const missing =
			(message.channel as TextChannel)
				.permissionsFor(message.guild!.me ?? (await message.guild!.members.fetch(message.client.user!.id)))
				?.missing(resolved) ?? [];

		if (missing.length) {
			const language = await message.fetchLanguage();
			const permissions = language.PERMISSIONS;

			throw language.get(
				'inhibitorMissingBotPerms',
				missing.map((permission) => permissions[permission])
			);
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
