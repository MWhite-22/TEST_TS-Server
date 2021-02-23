import type { ApolloServerPlugin } from 'apollo-server-plugin-base';
import { Context } from '../../../@types/context';

export const RequestTimerPlugin: ApolloServerPlugin<Context> = {
	requestDidStart: ({ context, request }) => {
		console.log(
			`\n-------------------- Request Started: ${context.requestId} | ${request.operationName} --------------------`
		);
		console.time(context.requestId);

		return {
			willSendResponse: ({ context }) => {
				console.log('\nTOTAL REQUEST TIME: ');
				console.timeEnd(context.requestId);
				console.log(`-------------------- Request End --------------------\n`);
			},
		};
	},
};
