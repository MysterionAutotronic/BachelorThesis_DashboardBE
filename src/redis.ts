import Redis from 'ioredis';

const redis = new Redis({
    host: process.env.REDIS_HOST || 'redis',
    port: Number(process.env.REDIS_PORT || 6379),
});

export async function setUserIp(username: string, ip: string): Promise<void> {
    await redis.hset('users', username, JSON.stringify({ ip }));
}

export async function getUserIp(username: string): Promise<string | undefined> {
    const raw = await redis.hget('users', username);
    return raw ? JSON.parse(raw).ip : undefined;
}