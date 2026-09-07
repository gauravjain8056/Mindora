import Redis from "ioredis"

const redis=new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 1 })

redis.on("connect",()=>{
    console.log("redis connected")
})

export default redis