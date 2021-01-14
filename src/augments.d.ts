import 'discord.js';
import type { TFunction } from 'i18next';

declare interface TextBasedExtensions {
	fetchT(): Promise<TFunction>;
}

declare module 'discord.js' {
	interface Message extends TextBasedExtensions {}

	interface Constructor<C> {
		new (...args: any[]): C;
	}
}
