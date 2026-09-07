import Conversation from "../models/coversation.model.js"
import Message from "../models/message.model.js"

export const createConversation=async (req,res) => {
  try {
    const userId=req.headers["x-user-id"]
    console.log("userId",userId)
    const conversation=await Conversation.create({
        userId:userId
    })

    return res.status(200).json(conversation)
  } catch (error) {
     return res.status(500).json({message:`create conversation error ${error}`})
  }
}

export const getConversations=async (req,res) => {
  try {
    const userId=req.headers["x-user-id"]
    const conversations=await Conversation.find({
        userId:userId
    }).sort({updatedAt:-1}).limit(50).lean()

    return res.status(200).json(conversations)
  } catch (error) {
     return res.status(500).json({message:`get conversation error ${error}`})
  }
}

export const updateConversation=async (req,res) => {
  try {
    const {id,title}=req.body
    const conversation=await Conversation.findByIdAndUpdate(id,{
        title
    })

    return res.status(200).json(conversation)
  } catch (error) {
     return res.status(500).json({message:`update conversation error ${error}`})
  }
}

export const saveMessage=async (req,res) => {
    try {
        const {conversationId,role,content,images,artifacts}=req.body
        const message=await Message.create({
            conversationId,
            content,
            role,
            images,
            artifacts
        })
        return res.status(200).json(message)
    } catch (error) {
        return res.status(500).json({message:`save message error ${error}`})
    }
}

export const getMessages=async (req,res) => {
    try {
        const { before, limit = 30 } = req.query
        const query = { conversationId: req.params.conversationId }
        if (before) {
            query._id = { $lt: before }
        }
        const messages = await Message.find(query)
            .sort({ _id: -1 })
            .limit(Number(limit) + 1)
            .lean()

        const hasMore = messages.length > Number(limit)
        if (hasMore) messages.pop()
        messages.reverse()

        return res.status(200).json({ messages, hasMore })
    } catch (error) {
        return res.status(500).json({message:`get messages error ${error}`})
    }
}


