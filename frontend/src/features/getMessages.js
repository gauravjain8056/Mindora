import api from '../../utils/axios'

async function getMessages(id, before = null) {
    try {
        const params = { limit: 30 }
        if (before) params.before = before
        const { data } = await api.get(`/api/chat/get-messages/${id}`, { params })
        return data
    } catch (error) {
        console.log(error)
        return { messages: [], hasMore: false }
    }
}

export default getMessages
