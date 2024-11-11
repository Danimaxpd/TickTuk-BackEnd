declare module 'ioredis-json' {
  import Redis from 'ioredis';
  export default class RedisJSON extends Redis {}
}
