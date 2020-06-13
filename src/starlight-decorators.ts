/**
 * MIT License
 *
 * Copyright (c) 2020 Gryffon Bellish
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import type { PieceConstructor } from '@klasa/core';
import type { Command, CommandOptions, CommandStore, CustomUsageArgument } from 'klasa';
import { createClassDecorator } from './utils';

/**
 * Applies a set of custom resolvers to a command through a decorator
 * @since 2.1.0
 * @copyright 2020 Gryffon Bellish
 * @license MIT
 * @param resolvers Array of custom resolvers to apply to a command
 * @example
 *	CreateResolvers([
 *		[
 *			'key',
 *			(arg, _possible, message, [action]) => {
 *				if (action === 'show' || arg) return arg || '';
 *				throw message.language.get('COMMAND_CONF_NOKEY');
 *			}
 *		]
 *	])
 *	export default class extends Command {}
 */
export function CreateResolvers(resolvers: [string, CustomUsageArgument][]): ClassDecorator {
	return createClassDecorator(
		(target: PieceConstructor<Command>): PieceConstructor<Command> =>
			(class extends target {
				public constructor(store: CommandStore, directory: string, files: readonly string[], options: CommandOptions) {
					super(store, directory, files, options);

					for (const resolver of resolvers) this.createCustomResolver(...resolver);
				}
			} as unknown) as PieceConstructor<Command>
	);
}

// TODO: Add SetRoute decorator when KDH has been updated to support @klasa/core and klasa >= 0.6.0
