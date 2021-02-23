import { Service, Inject } from 'typedi';

import { Context } from '../@types/context';
@Service()
export class Logger {
	constructor(@Inject('context') private readonly context: Context) {
		console.log('Logger created!');
	}

	log(...messages: any[]) {
		console.log(`(ID ${this.context.requestId}):`, ...messages);
	}
}
