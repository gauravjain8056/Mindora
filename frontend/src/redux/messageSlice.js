import { createSlice } from "@reduxjs/toolkit";

const messageSlice=createSlice({
    name:"message",
    initialState:{
      messages:[],
      artifacts:[],
      isLoading:false,
      hasMore:false
    },
    reducers:{
       setMessages:(state,action)=>{
        state.messages=action.payload
       },
       prependMessages:(state,action)=>{
        state.messages=[...action.payload,...state.messages]
       },
       addMessage:(state,action)=>{
        state.messages.push(action.payload)
       },
       setArtifacts:(state,action)=>{
        state.artifacts=action.payload
       },
       setIsLoading:(state,action)=>{
        state.isLoading=action.payload
       },
       setHasMore:(state,action)=>{
        state.hasMore=action.payload
       }
    }
})

export const {setMessages,prependMessages,addMessage,setArtifacts,setIsLoading,setHasMore}=messageSlice.actions
export default messageSlice.reducer
