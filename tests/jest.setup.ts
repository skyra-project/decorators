import { client } from '@mocks/MockInstances';
import type { KlasaClient } from 'klasa';

afterAll(() => {
	(client as KlasaClient).destroy().finally(() => undefined);
});
