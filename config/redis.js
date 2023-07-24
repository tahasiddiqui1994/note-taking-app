import Redis from 'ioredis';

const client = new Redis({ host: 'redis-17477.c261.us-east-1-4.ec2.cloud.redislabs.com', port: 17477, username: 'default', password: 'TTzyMKSngyoYpVI4p6gxAZjG3HJK7lg0' });

client.on('connect', () => {
  console.log('Connected to Redis');
});

client.on('error', (err) => {
  console.error('Error connecting to Redis:', err);
});

export default client;