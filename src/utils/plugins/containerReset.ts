import type { ApolloServerPlugin } from 'apollo-server-plugin-base';
import { Container, ContainerInstance } from 'typedi';
import { Context } from '../../@types/context';

export const containerResetPlugin: ApolloServerPlugin<Context> = {
	requestDidStart: ({ context, request }) => {
		if (request.operationName == 'IntrospectionQuery') {
			Container.reset(context.requestId);
			return {};
		}

		console.log(`----------Request Started: ${context.requestId}----------`);
		console.log('Request Name: ', request.operationName);
		return {
			willSendResponse({ context }) {
				console.log('\n~~CONTEXT CONTAINER~~');
				console.dir(context.container, { depth: 4 });

				// remember to dispose the scoped container to prevent memory leaks
				Container.reset(context.requestId);

				// for developers curiosity purpose, here is the logging of current scoped container instances
				// we can make multiple parallel requests to see in console how this works
				const instancesIds = ((Container as any).instances as ContainerInstance[]).map(
					(instance) => instance.id
				);
				console.log('instances left in memory:', instancesIds);
				console.log('------------------------------\n');
			},
		};
	},
};
