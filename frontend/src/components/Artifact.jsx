import { Check, Code2, Copy, Eye, PanelRightClose, PanelRightOpen, X } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { AnimatePresence, easeInOut, motion } from "motion/react"
import Editor from '@monaco-editor/react'

function Artifact() {
  const [collapsed, setCollapsed] = useState(false)
  const { artifacts } = useSelector(state => state.message)
  const [tab, setTab] = useState("code")
  const [activeFile, setActiveFile] = useState(0)
  const [copied, setCopied] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!artifacts || artifacts.length === 0) return null

  const file = artifacts[0]?.files?.[activeFile]
  const htmlFile = artifacts[0]?.files?.find(f => f.name === "index.html")
  const cssFile = artifacts[0]?.files?.find(f => f.name === "style.css")
  const jsFile = artifacts[0]?.files?.find(f => f.name === "script.js")

  const canPreview = Boolean(htmlFile)

  const previewDoc = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
       ${cssFile?.content || ""}
      </style>
  </head>
  <body>
   ${htmlFile?.content || ""} 
  <script>
      ${jsFile?.content || ""}
  </script>    
  </body>
  </html>`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(file?.content || "")
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const detectLanguage = (fileName = "") => {
    const name = fileName.toLowerCase()
    if (name.endsWith(".html")) return "html"
    if (name.endsWith(".css")) return "css"
    if (name.endsWith(".js") || name.endsWith(".jsx")) return "javascript"
    if (name.endsWith(".ts") || name.endsWith(".tsx")) return "typescript"
    if (name.endsWith(".json")) return "json"
    if (name.endsWith(".py")) return "python"
    if (name.endsWith(".java")) return "java"
    if (name.endsWith(".cpp") || name.endsWith(".c")) return "cpp"
    return "plaintext"
  }

  const PanelContent = ({ onClose }) => {
    return (
      <>
        {!collapsed ? (
          <div className='flex flex-col h-full bg-[#F3F3F3]'>
            {/* Panel Header */}
            <div className='h-14 px-4 border-b border-[#191A23]/15 bg-white flex items-center gap-2.5 shrink-0'>
              <button
                className='flex items-center justify-center w-7 h-7 rounded-lg text-[#191A23] hover:bg-black/5 transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0'
                onClick={onClose ?? (() => setCollapsed(true))}
                title="Close"
              >
                {onClose ? <X size={16} /> : <PanelRightClose size={16} />}
              </button>

              <div className='flex items-center gap-2 flex-1 min-w-0'>
                <div className='flex items-center justify-center w-6 h-6 rounded-md bg-[#B9FF66] border border-[#191A23] shadow-[1px_1px_0px_#191A23] shrink-0'>
                  <Code2 className="text-[#191A23]" size={13} />
                </div>
                <div className='text-[13px] font-bold font-display text-[#191A23] truncate'>
                  {artifacts[0]?.title || "Artifact"}
                </div>
              </div>

              <div className='flex items-center gap-1.5 shrink-0'>
                <button
                  onClick={handleCopy}
                  title="Copy file contents"
                  className='flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-[#191A23] bg-[#F3F3F3] border border-[#191A23]/20 hover:bg-[#B9FF66] rounded-lg transition-colors duration-150 cursor-pointer'
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  <span className='hidden sm:inline'>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>

              {canPreview && (
                <div className='flex items-center gap-1 bg-[#F3F3F3] border border-[#191A23]/20 p-0.5 rounded-lg'>
                  <button
                    onClick={() => setTab("code")}
                    className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md transition-all duration-150 cursor-pointer border-none ${
                      tab === "code"
                        ? "bg-[#191A23] text-white"
                        : "bg-transparent text-[#191A23]/70 hover:text-[#191A23]"
                    }`}
                  >
                    <Code2 size={12} /> Code
                  </button>
                  <button
                    onClick={() => setTab("preview")}
                    className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md transition-all duration-150 cursor-pointer border-none ${
                      tab === "preview"
                        ? "bg-[#B9FF66] text-[#191A23] border border-[#191A23]"
                        : "bg-transparent text-[#191A23]/70 hover:text-[#191A23]"
                    }`}
                  >
                    <Eye size={12} /> Preview
                  </button>
                </div>
              )}
            </div>

            {/* File Tabs */}
            {tab === "code" && (
              <div className='flex h-auto border-b border-[#191A23]/15 bg-white overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0'>
                {artifacts[0]?.files?.map((f, index) => (
                  <button
                    key={f?.name || index}
                    onClick={() => setActiveFile(index)}
                    className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-colors duration-150 border-r border-[#191A23]/10 relative cursor-pointer ${
                      activeFile === index
                        ? "bg-[#F3F3F3] text-[#191A23]"
                        : "bg-white text-[#767676] hover:text-[#191A23]"
                    }`}
                  >
                    {f?.name}
                    {activeFile === index && (
                      <div className='absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#191A23]' />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Editor or Preview Pane */}
            <div className='flex-1 overflow-hidden bg-white'>
              {tab === "preview" && canPreview ? (
                <div className='w-full h-full'>
                  <iframe
                    title='preview'
                    srcDoc={previewDoc}
                    sandbox='allow-scripts'
                    className='w-full h-full bg-white border-none'
                  />
                </div>
              ) : (
                <div className='w-full h-full'>
                  <Editor
                    theme='vs-dark'
                    language={detectLanguage(file?.name)}
                    value={file?.content || ""}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 13,
                      wordWrap: "on",
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                      padding: { top: 16 },
                      lineNumbers: "on",
                      renderLineHighlight: "none",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className='hidden lg:flex h-full border-l border-[#191A23]/15 bg-[#F3F3F3] flex-col items-center py-4 gap-3 shrink-0'>
            <button
              className='flex items-center justify-center w-7 h-7 rounded-lg text-[#191A23] hover:bg-white border border-transparent hover:border-[#191A23]/20 transition-all duration-150 cursor-pointer shrink-0'
              onClick={() => setCollapsed(false)}
              title="Expand artifact"
            >
              <PanelRightOpen size={16} />
            </button>
            <div className='flex items-center gap-2 flex-1 min-w-0'>
              <div
                className='text-[11px] font-bold text-[#191A23] tracking-widest uppercase whitespace-nowrap font-display'
                style={{
                  writingMode: "vertical-lr",
                  transform: "rotate(180deg)"
                }}
              >
                {artifacts[0]?.title}
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-24 right-4 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#191A23] hover:bg-[#B9FF66] hover:text-[#191A23] text-white text-xs font-bold border-2 border-[#191A23] shadow-[3px_3px_0px_#191A23] cursor-pointer transition-all duration-150"
      >
        <Code2 size={14} />
        View Artifact
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-[#191A23]/40"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="lg:hidden fixed inset-y-0 right-0 z-50 w-[88vw] max-w-[420px] border-l-2 border-[#191A23] shadow-2xl overflow-hidden"
            >
              <PanelContent onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ width: 420 }}
        animate={{ width: collapsed ? 48 : 420 }}
        transition={{ duration: 0.2, ease: easeInOut }}
        className='hidden lg:flex h-full border-l border-[#191A23]/15 flex-col overflow-hidden shrink-0'
      >
        <PanelContent />
      </motion.div>
    </>
  )
}

export default Artifact
