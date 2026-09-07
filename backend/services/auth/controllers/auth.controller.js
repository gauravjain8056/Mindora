import { getAuth } from "firebase-admin/auth"
import { app } from "../config/firebase.js"
import User from "../models/user.model.js"
import redis from "../../../shared/redis/redis.js"
import crypto from "crypto"

const COST = {
    chat: 1,
    search: 5,
    coding: 10,
    pdf: 10,
    ppt: 10,
    vision: 10
}

const SESSION_TTL = 7 * 24 * 60 * 60

const buildSessionPayload = (user) => JSON.stringify({
    userId: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    plan: user.plan,
    credits: user.credits,
    totalCredits: user.totalCredits,
    planExpiresAt: user.planExpiresAt
})

export const login = async (req, res) => {
    try {
        const { token } = req.body
        const decoded = await getAuth(app).verifyIdToken(token)
        let user = await User.findOne({
            firebaseUid: decoded.uid
        })

        if (!user) {
            user = await User.create({
                firebaseUid: decoded.uid,
                name: decoded.name,
                email: decoded.email,
                avatar: decoded.picture
            })
        }

        const sessionId = crypto.randomUUID()

        await redis.pipeline()
            .set(`user-session-${user._id}`, sessionId, "EX", SESSION_TTL)
            .set(`session-${sessionId}`, buildSessionPayload(user), "EX", SESSION_TTL)
            .exec()

        res.cookie("session", sessionId, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: SESSION_TTL * 1000
        })

        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({ message: `login error ${error}` })
    }
}


export const logOut = async (req, res) => {
    try {
        const sessionId = req.cookies?.session
        await redis.del(`session-${sessionId}`)

        res.clearCookie("session")
        return res.status(200).json({ message: "logout successfully" })
    } catch (error) {
        return res.status(500).json({ message: `logout error ${error}` })
    }
}


export const updateUserPayment = async (req, res) => {
    try {
        const { plan, credits, userId } = req.body
        const user = await User.findByIdAndUpdate(
            userId,
            {
                $set: { plan, planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
                $inc: { credits, totalCredits: credits }
            },
            { new: true }
        )
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const sessionId = await redis.get(`user-session-${user._id}`)
        if (sessionId) {
            await redis.set(`session-${sessionId}`, buildSessionPayload(user), "EX", SESSION_TTL)
        }

        return res.status(200).json({ success: true })

    } catch (error) {
        return res.status(500).json({ message: `update user payment error ${error}` })
    }
}


export const deductCredits = async (req, res) => {
    try {
        const { userId, agent } = req.body

        const requiredCredits = COST[agent] || 1

        const user = await User.findOneAndUpdate(
            { _id: userId, credits: { $gte: requiredCredits } },
            { $inc: { credits: -requiredCredits } },
            { new: true }
        )

        if (!user) {
            const exists = await User.exists({ _id: userId })
            if (!exists) {
                return res.status(400).json({ message: "user not found" })
            }
            return res.status(400).json({ message: "Not enough credits." })
        }

        const sessionId = await redis.get(`user-session-${user._id}`)
        if (sessionId) {
            await redis.set(`session-${sessionId}`, buildSessionPayload(user), "EX", SESSION_TTL)
        }

        return res.status(200).json({ success: true, credits: user.credits })
    } catch (error) {
        return res.status(500).json({ message: `deduct credits error ${error}` })
    }
}