import redis from "../../../shared/redis/redis.js"

const Limits = {
    chat: 20,
    coding: 5,
    pdf: 5,
    ppt: 5,
    image: 5,
    search: 5
}

export const checkAgentLimit = async (userId, agent) => {
    try {
        const max = Limits[agent] || Limits["chat"]
        const key = `rate:${userId}:${agent}`

        const [[, count]] = await redis.pipeline()
            .incr(key)
            .expire(key, 60, "NX")
            .exec()

        if (count > max) {
            const ttl = await redis.ttl(key)
            const minutes = Math.floor(ttl / 60)
            const seconds = (ttl % 60)
            const time = minutes > 0 ? ` ${minutes}m : ${seconds}s` : `${seconds}s`

            const error = new Error(`Rate limit exceeded for ${agent}.`)
            error.status = 429
            error.data = {
                success: false,
                agent,
                limit: max,
                remainingTime: ttl,
                retryAfter: time,
                message: `You have reached the ${agent} limit (${max} requests/minute). Try again in ${time}.`
            }

            throw error
        }

        return {
            remaining: max - count,
            limit: max
        }
    } catch (error) {
        if (error.status === 429) throw error
        return {
            remaining: 1,
            limit: 10
        }
    }
}