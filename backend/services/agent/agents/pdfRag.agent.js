import fs from "fs/promises"
import { PDFParse } from "pdf-parse"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { vectorStore } from "../config/vectorDb.js"
import { getModel } from "../config/llmModels.js"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { deductCredits } from "../utils/deductCredits.js"
import { checkAgentLimit } from "../config/agentLimit.js"
export const pdfRag=async (state)=>{
   let store;
   let collectionName;
   try {
    await checkAgentLimit(state.userId,"pdf")
      const buffer=await fs.readFile(state.file.path)
      const parser = new PDFParse({ data: buffer })
      const { text } = await parser.getText()
      await parser.destroy()

      if (!text || !text.trim()) {
        return {
          ...state,
          aiResponse: "The uploaded PDF does not contain extractable text (it may be a scanned image or empty)."
        }
      }

      const spilliter=new RecursiveCharacterTextSplitter({
        chunkSize:1000,
        chunkOverlap:200
      })

      const docs=await spilliter.createDocuments([text])
      collectionName=`pdf-${Date.now()}`;
      store=await vectorStore(docs,collectionName)

      const query = state.prompt?.trim() || "Summarize this document and its key points"
      const relevantDocs=await store.similaritySearch(query,5)
      
      const context=relevantDocs.map(d=>d.pageContent).join("\n\n")
      
      const llm=await getModel("pdf-rag")

       const messages=[
        new SystemMessage(`You are Mindora AI PDF Assistant.

Rules:

- Answer ONLY from the uploaded PDF.

- Never make up information.

- If the answer is not present in the PDF, reply:

"I couldn't find this information in the uploaded PDF."

- Use Markdown formatting.
`),

new HumanMessage(`
    Context:${context}
     Question:${query}
    `)
       ]


      const response=await llm.invoke(messages)
      await deductCredits(state.userId,"pdf")
      console.log(response)
      return {
        ...state,
        aiResponse:response.content
      }



   } catch (error) {
    console.log(error)
         return {
            ...state,
            aiResponse:error?.data?.message || "failed to analyze pdf"
        }
   }finally{
         await fs.unlink(state.file.path).catch(()=>{})
         if (store && collectionName) {
           await store.client.deleteCollection(collectionName).catch(()=>{})
         }
   }


}