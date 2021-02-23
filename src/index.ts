// ============================================================
// 			REQUIRED TOP LEVEL IMPORTS
// ============================================================
import 'reflect-metadata';
import 'dotenv-safe/config';
import { Server } from './server';

async function startServer() {
	const server = new Server();
	await server.start();
}

startServer().catch((err) => console.error(err));
