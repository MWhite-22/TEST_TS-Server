import { Service } from 'typedi';

@Service()
export class Logger {
	constructor() {
		console.log('Logger created!');
	}

	log(...messages: any[]) {
		console.log('[LOGGER - LOG]', ...messages);
	}
}
