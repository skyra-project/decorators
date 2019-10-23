import { Command, KlasaClient, CommandStore } from 'klasa';

export class Message {

	public content: string;
	public guild: Guild | null;
	private permission: number;

	public constructor(content: string, guild: Guild | null, permission: number) {
		this.content = content;
		this.guild = guild;
		this.permission = permission;
	}

	public async hasAtLeastPermissionLevel(level: number) {
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

	public constructor(prop: string, client?: KlasaClient, name?: string, holds?: typeof Command) {
		super(client!, name!, holds!);
	}

}
