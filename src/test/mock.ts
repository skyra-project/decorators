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
