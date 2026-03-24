import { createClient, type RedisClientType } from "redis";
import envConfig from "../../config/env.config";
import logger from "../../config/log.config";

export class RedisClient{
    private static instance:RedisClient;
    private client:RedisClientType;
    private isConnected:boolean=false;
    private constructor(){
        this.client=createClient({url:envConfig.redis.redisUrl})

        this.client.on("error",(err)=>{
            logger.error("Redis error",err)
        })
    }

    static getInstance():RedisClient{
        if(!RedisClient.instance){
            RedisClient.instance=new RedisClient()
        }return RedisClient.instance
    }

    async connect(){
        if(!this.isConnected){
            await this.client.connect()
            this.isConnected=true;
            logger.info("Redis connected")
        }
    }

    getClient(){
        return this.client;
    }
}