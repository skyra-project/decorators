import { requiresPermission, requiresGuildContext, requiresDMContext, createFunctionInhibitor } from '../index';
import * as test from 'tape';
import { Message, Guild } from './mock';

test('Test Permissions (Existent)', async t => {
	t.plan(1);

	class Test {

		@requiresPermission(5)
		public async getContent(message: Message) {
			return message.content;
		}

	}

	const instance = new Test();
	const message = new Message('Hello World', null, 5);
	const content = await instance.getContent(message);
	t.equal(content, 'Hello World');
});

test('Test Permissions (Existent)', async t => {
	t.plan(1);

	class Test {

		@requiresPermission(5)
		public async getContent(message: Message) {
			return message.content;
		}

	}

	const instance = new Test();
	const message = new Message('Hello World', null, 4);
	const content = await instance.getContent(message);
	t.equal(content, undefined);
});

test('Test Guild (Required)', async t => {
	t.plan(2);

	class Test {

		@requiresGuildContext()
		public async getName(message: Message) {
			return message.guild!.name;
		}

	}

	const instance = new Test();
	{
		const guild = new Guild('Guild');
		const message = new Message('Hello World', guild, 5);
		const name = await instance.getName(message);
		t.equal(name, 'Guild');
	}

	{
		const guild = null;
		const message = new Message('Hello World', guild, 5);
		const name = await instance.getName(message);
		t.equal(name, undefined);
	}
});

test('Test DM (Required)', async t => {
	t.plan(2);

	class Test {

		@requiresDMContext()
		public async inGuild(message: Message) {
			return message.guild === null;
		}

	}

	const instance = new Test();
	{
		const guild = new Guild('Guild');
		const message = new Message('Hello World', guild, 5);
		const inGuild = await instance.inGuild(message);
		t.equal(inGuild, undefined);
	}

	{
		const guild = null;
		const message = new Message('Hello World', guild, 5);
		const inGuild = await instance.inGuild(message);
		t.equal(inGuild, true);
	}
});

test('Custom Function Inhibitor', async t => {
	t.plan(1);

	class Test {

		public value = Symbol('Test');

		@createFunctionInhibitor(() => true)
		public async getValue() {
			return this.value;
		}

	}

	const instance = new Test();
	const result = await instance.getValue();
	t.equal(result, instance.value);
});
