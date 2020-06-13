import type { PermissionStrings } from './utils';

declare module 'klasa' {
	interface Language {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		PERMISSIONS: PermissionStrings;
	}
}
