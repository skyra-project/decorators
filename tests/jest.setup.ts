import { client } from '@mocks/MockInstances';
import { KlasaClient } from 'klasa';

afterAll(() => {
	(client as KlasaClient).destroy().finally(() => undefined);
});
