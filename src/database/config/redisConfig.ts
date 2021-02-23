import Redis from 'ioredis';
import { REDIS_URL } from '../../constants';

export const RedisClient = new Redis(REDIS_URL);

RedisClient.on('error', (error) => {
	console.log('Redis Error:', error);
});

RedisClient.on('connect', () => {
	console.log('Redis Connected');
});
