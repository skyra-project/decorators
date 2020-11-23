import { Command, CommandStore, KlasaClient } from 'klasa';

export const client = new KlasaClient({ language: 'en-GB' });

export class Message {
	public content: string;
	public guild: Guild | null;
	private permission: number;

	public constructor(content: string, guild: Guild | null, permission: number) {
		this.content = content;
		this.guild = guild;
		this.permission = permission;
	}

	public hasAtLeastPermissionLevel(level: number): boolean {
		return this.permission >= level;
	}
}

export class Guild {
	public name: string;

	public constructor(name: string) {
		this.name = name;
	}
}

export class MockClient extends KlasaClient {
	public constructor() {
		super();
	}
}

export class MockCommand extends Command {
	public constructor(store: CommandStore, file: string[], directory: string) {
		super(store, file, directory);
	}
}

export class MockCommandStore extends CommandStore {
	public constructor(_: string, client?: KlasaClient, name?: string, holds?: typeof Command) {
		super(client!, name!, holds!);
	}
}
