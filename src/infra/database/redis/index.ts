import {
  createClient,
  RedisClientOptions,
} from "redis";

import { Maybe } from "../../../types/helpers";
import { InMemoryMethods } from "../types/in-memory";

export type RedisInstance = ReturnType<typeof createClient>
export type RedisClientOptionsWithCustom = RedisClientOptions & {
  environment?: string;
}

export let maxAttemptsToReconnect = 3
export const socketOptions = {
  socket: {
    reconnectStrategy: (attempts: number) => {
        if (attempts === maxAttemptsToReconnect) {
          console.log(`[Redis] exiting after ${maxAttemptsToReconnect} attemps without success`);
          return false
        }
        console.log(`[Redis] reconnecting attempt ${attempts + 1}`);
        return 5000
    },  
  },
}

let _redis: Maybe<RedisInstance>
let _redisOptions: RedisClientOptionsWithCustom

export const startInMemory = (options: RedisClientOptions): RedisInstance | null => {
  try {
    _redisOptions = {...options, ...socketOptions}
    _redis = createClient(_redisOptions)
    _redis?.connect()
      .catch(e => {
        console.log(e)
      })
    return _redis;
  } catch (err) {
    console.error(err)
    return null
  }
}

export const useInMemory = <V>(): InMemoryMethods<V> => {

  const remove = async (key: string): Promise<void> => {
    try {
      await _redis?.del(key)
    } catch (err) {
      console.error(err)
    }
  }

  const expire = async (key: string, expiresIn?: number): Promise<void> => {
    try {
      await _redis?.expire(key, expiresIn || 600)
    } catch (err) {
      console.error(err)
    }
  }

  const create = async (key: string, value: V | any, expiresIn?: number): Promise<void> => {
      try {
        await _redis?.set(key, JSON.stringify(value))
        await expire(key, expiresIn)
      } catch (err) {
        console.error(err)
      }
  }

  const get = async (key: string): Promise<V | null> => {
     try {      
      const rawData = await _redis?.get(key)          
      const parsedData = rawData ? JSON.parse(rawData) : null
      return parsedData
     } catch (err) {
      console.error(err)
      return null
     } 
  }

  const generateKey = (text: string, replaceBaseUrl = true): string => {
    let prefix = ''
    if (_redisOptions.environment) {
      prefix = _redisOptions.environment
    }
    return Buffer
      .from(prefix + text.replace(replaceBaseUrl ? '/api' : '', ''))
      .toString('base64')
  }

  return {
    get,
    create,
    remove,
    generateKey
  }

}

