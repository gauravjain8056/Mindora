import { Code2, FileText, Globe, ImageIcon, MessageSquare, Mic, MicOff, Paperclip, Presentation, Send, X, Zap } from 'lucide-react'
import React, { useEffect, useState, useRef } from 'react'
import sendMessage from '../features/sendMessage'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage, setArtifacts, setIsLoading, setMessages } from '../redux/messageSlice'
import { createConversation } from '../features/createConversation'
import { addConversation, setConvTitle, setSelectedConversation } from '../redux/conversationSlice'
import { updateConversation } from '../features/updateConversation'

function ChatInput() {
  const [value, setValue] = useState("")
  const [selectedAgent, setSelectedAgent] = useState("Auto")
  const { selectedConversation } = useSelector(state => state.conversation)
  const { isLoading } = useSelector(state => state.message)
  const [selectedFile, setSelectedFile] = useState(null)
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)
  const fileRef = useRef(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.interimResults = true
    recognition.continuous = true

    recognition.onresult = (event) => {
      let transcript = ""
      for (let index = event.resultIndex; index < event.results.length; index++) {
        transcript += event.results[index][0].transcript
      }
      setValue(transcript)
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognitionRef.current = recognition
  }, [])

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.")
      return
    }
    if (listening) {
      recognitionRef.current.stop()
      setListening(false)
    } else {
      recognitionRef.current.start()
      setListening(true)
    }
  }

  const handleSendMessage = async () => {
    if (!value.trim() && !selectedFile) return

    dispatch(setIsLoading(true))
    let conversation = selectedConversation
    if (!conversation) {
      dispatch(setMessages([]))
      const conv = await createConversation()
      dispatch(setSelectedConversation(conv))
      dispatch(addConversation(conv))
      conversation = conv
    }

    if (conversation.title === "New Chat") {
      await updateConversation({ id: conversation?._id, title: value.trim() })
      dispatch(setConvTitle({ conversationId: conversation?._id, title: value.slice(0, 40) }))
    }

    const formData = new FormData()
    formData.append("prompt", value.trim())
    formData.append("conversationId", conversation?._id)
    formData.append("agent", selectedAgent.toLowerCase())
    if (selectedFile) {
      formData.append("file", selectedFile)
    }

    dispatch(addMessage({ role: "user", content: value.trim() }))
    setValue("")
    const fileToSend = selectedFile
    setSelectedFile(null)

    try {
      const data = await sendMessage(formData)
      dispatch(setIsLoading(false))
      dispatch(setArtifacts(data?.artifacts || []))
      dispatch(addMessage({ role: "assistant", content: data?.answer, images: data?.images }))
    } catch (err) {
      dispatch(setIsLoading(false))
      console.error(err)
    }
  }

  const agents = [
    { id: "auto", icon: Zap, label: "Auto" },
    { id: "chat", icon: MessageSquare, label: "Chat" },
    { id: "coding", icon: Code2, label: "Coding" },
    { id: "pdf", icon: FileText, label: "PDF" },
    { id: "ppt", icon: Presentation, label: "PPT" },
    { id: "vision", icon: ImageIcon, label: "Vision" },
    { id: "search", icon: Globe, label: "Search" }
  ]

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className='w-full overflow-hidden px-3 md:px-8 py-4 border-t border-[#191A23]/15 bg-white shrink-0'>
      <div className='max-w-4xl mx-auto flex flex-col gap-2.5 bg-[#F3F3F3] border-2 border-[#191A23] rounded-2xl px-4 pt-3.5 pb-3 shadow-[3px_3px_0px_#191A23] transition-all focus-within:shadow-[4px_4px_0px_#191A23]'>
        
        {/* Agent Pills */}
        <div className='flex gap-1.5 flex-wrap items-center'>
          {agents.map((agent) => {
            const isActive = selectedAgent === agent.label
            const Icon = agent.icon
            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => setSelectedAgent(agent.label)}
                className={`
                  cursor-pointer
                  inline-flex
                  items-center
                  gap-1.5
                  px-2.5
                  py-1
                  rounded-lg
                  text-xs
                  font-bold
                  border
                  transition-all
                  duration-150
                  ${isActive
                    ? "bg-[#B9FF66] text-[#191A23] border-[#191A23] shadow-[1.5px_1.5px_0px_#191A23]"
                    : "bg-white text-[#191A23]/70 border-[#191A23]/20 hover:text-[#191A23] hover:border-[#191A23]"
                  }
                `}
              >
                <Icon size={12} strokeWidth={2.5} />
                <span>{agent.label}</span>
              </button>
            )
          })}
        </div>

        {/* Selected File Preview */}
        {selectedFile && (
          <div className='my-1'>
            <div className='inline-flex items-center gap-2 rounded-xl border-2 border-[#191A23] bg-white px-3 py-2 shadow-[2px_2px_0px_#191A23]'>
              {selectedFile?.type === "application/pdf" ? (
                <FileText size={16} className="text-red-500" />
              ) : selectedFile.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="preview"
                  className="h-9 w-9 rounded-lg object-cover border border-[#191A23]"
                />
              ) : null}

              <div>
                <p className='text-xs font-bold text-[#191A23] truncate max-w-[200px]'>
                  {selectedFile?.name}
                </p>
                <p className='text-[10px] text-[#767676]'>
                  {Math.ceil(selectedFile.size / 1024)} KB
                </p>
              </div>

              <button
                className='ml-2 text-[#767676] hover:text-[#191A23] cursor-pointer bg-transparent border-none'
                onClick={() => {
                  setSelectedFile(null)
                  if (fileRef.current) fileRef.current.value = ""
                }}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Text Area */}
        <textarea
          placeholder='Ask anything, brainstorm ideas, generate code...'
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          value={value}
          className="w-full bg-transparent outline-none resize-none text-[14.5px] text-[#191A23] placeholder:text-[#767676] leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50 mt-1"
          rows={3}
        />

        {/* Bottom Actions */}
        <div className='flex items-center justify-between pt-1 border-t border-[#191A23]/10'>
          <div className='flex items-center gap-1.5'>
            <input
              type="file"
              accept='.pdf,image/*'
              hidden
              ref={fileRef}
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) {
                  setSelectedFile(file)
                }
              }}
            />

            <button
              className='flex items-center justify-center w-8 h-8 rounded-lg text-[#191A23] hover:bg-white border border-transparent hover:border-[#191A23]/30 transition-all duration-150 bg-transparent cursor-pointer'
              onClick={() => fileRef.current?.click()}
              title="Attach document or image"
            >
              <Paperclip size={16} />
            </button>

            <button
              onClick={toggleMic}
              title={listening ? "Listening... click to stop" : "Voice input"}
              className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-150 cursor-pointer ${
                listening
                  ? "bg-red-500 text-white border-[#191A23] shadow-[1.5px_1.5px_0px_#191A23]"
                  : "text-[#191A23] border-transparent hover:bg-white hover:border-[#191A23]/30 bg-transparent"
              }`}
            >
              {listening ? <Mic size={16} /> : <MicOff size={16} />}
            </button>
          </div>

          <button
            disabled={!value.trim() && !selectedFile || isLoading}
            onClick={handleSendMessage}
            className={`flex items-center justify-center w-9 h-9 rounded-xl border-2 transition-all duration-150 ${
              value.trim() || selectedFile
                ? "bg-[#191A23] hover:bg-[#B9FF66] hover:text-[#191A23] text-white border-[#191A23] shadow-[2px_2px_0px_#191A23] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
                : "bg-white text-[#9CA3AF] border-[#191A23]/20 cursor-not-allowed"
            }`}
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInput
