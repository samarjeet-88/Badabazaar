import type { RedisClientType } from "redis"
import { RedisClient } from "./BaseRedis"
import logger from "../../config/log.config"

export class RedisService{

    private redisClient=RedisClient.getInstance()
    private client=this.redisClient.getClient()

    constructor(){
        this.redisClient.connect().catch(err=>logger.error("Error redis",err))
    }

    async get(key:string):Promise<string|null>{
        const data=await this.client.get(key)
        return (data?data:null)
    }

    async set(key:string,data:string,expiryInSeconds:number=120){
        await this.client.set(key,data,{EX:expiryInSeconds})
        logger.info(`Redis data set with key as ${key} and value as ${data}`)
    }

    async del(key:string){
        await this.client.del(key)
    }
}