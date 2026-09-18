import { Check, Copy, ExternalLink, X } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

function MessageBubble({ role, content, images }) {
  const isUser = role === "user"
  const [lightBox, setLightBox] = useState(null)
  const [copiedCode, setCopiedCode] = useState("")

  const copyCode = async (code) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => {
      setCopiedCode("")
    }, 2000)
  }

  const markdownComponents = useMemo(() => ({
    h1: ({ children }) => (
      <h1 className='font-display text-2xl font-bold mt-5 mb-3 tracking-tight'>{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className='font-display text-xl font-bold mt-4 mb-2 tracking-tight'>{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className='font-display text-lg font-bold mt-3 mb-2 tracking-tight'>{children}</h3>
    ),
    p: ({ children }) => (
      <p className='mb-3 leading-relaxed whitespace-pre-wrap break-words'>{children}</p>
    ),
    ul: ({ children }) => (
      <ul className='list-disc pl-5 space-y-1.5 my-2.5'>{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className='list-decimal pl-5 space-y-1.5 my-2.5'>{children}</ol>
    ),
    table: ({ children }) => (
      <div className='overflow-x-auto my-4 rounded-xl border-2 border-[#191A23] shadow-[2px_2px_0px_#191A23]'>
        <table className='min-w-full text-sm divide-y divide-[#191A23]/20'>
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className='bg-[#191A23] text-white px-3.5 py-2.5 text-left font-display font-bold text-xs uppercase tracking-wider'>
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className='border-t border-[#191A23]/10 px-3.5 py-2 text-sm bg-white'>
        {children}
      </td>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`font-semibold underline decoration-[#B9FF66] decoration-2 underline-offset-2 inline-flex items-center gap-1 ${
          isUser ? "text-white" : "text-[#191A23] hover:text-black"
        }`}
      >
        {children}
        <ExternalLink size={13} />
      </a>
    ),
    code: ({ className, children }) => {
      const value = String(children).trim()

      if (!className) {
        return (
          <code
            className={`px-1.5 py-0.5 rounded font-mono text-[12.5px] border ${
              isUser
                ? "bg-white/15 border-white/20 text-white"
                : "bg-white border-[#191A23]/20 text-[#191A23]"
            }`}
          >
            {value}
          </code>
        )
      }

      const language = className.replace("language-", "")

      return (
        <div className='my-4 overflow-hidden rounded-xl border-2 border-[#191A23] bg-[#191A23] shadow-[3px_3px_0px_#191A23]'>
          <div className='flex items-center justify-between bg-[#191A23] border-b border-[#292A32] px-4 py-2.5'>
            <span className='font-display uppercase text-[11px] font-bold tracking-wider text-[#B9FF66]'>
              {language}
            </span>
            <button
              className='flex items-center gap-1.5 text-xs font-medium text-white/80 hover:text-[#B9FF66] transition-colors cursor-pointer bg-transparent border-none'
              onClick={() => copyCode(value)}
            >
              {copiedCode === value ? (
                <>
                  <Check size={14} className="text-[#B9FF66]" />
                  <span className='text-[#B9FF66] font-semibold'>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <SyntaxHighlighter
            language={language}
            style={oneDark}
            wrapLongLines
            showLineNumbers
            customStyle={{
              margin: 0,
              padding: "16px",
              background: "#121319",
              fontSize: "13px",
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            }}
          >
            {value}
          </SyntaxHighlighter>
        </div>
      )
    },
    img: ({ src }) => {
      if (!src) return null
      return (
        <img
          src={src}
          onClick={() => setLightBox(src)}
          loading="lazy"
          onError={(e) => e.currentTarget.remove()}
          className="w-44 h-32 rounded-xl object-cover border-2 border-[#191A23] shadow-[2px_2px_0px_#191A23] cursor-zoom-in hover:opacity-90 transition-opacity"
        />
      )
    }
  }), [copiedCode, isUser])

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`w-fit max-w-[92vw] md:max-w-[75%] px-5 py-3.5 rounded-2xl break-words overflow-hidden leading-relaxed text-[14.5px] ${
          isUser
            ? "bg-[#191A23] text-white rounded-tr-sm border-2 border-[#191A23] shadow-[3px_3px_0px_rgba(25,26,35,0.15)]"
            : "bg-[#F3F3F3] text-[#191A23] rounded-tl-sm border border-[#191A23]/15 shadow-[2px_2px_0px_rgba(25,26,35,0.06)]"
        }`}
      >
        {images.length > 0 && (
          <div className='flex flex-wrap gap-3 mb-3'>
            {images.map((img, i) => (
              <img
                key={img || i}
                src={img}
                onClick={() => setLightBox(img)}
                loading="lazy"
                onError={(e) => e.currentTarget.remove()}
                className="w-44 h-32 rounded-xl object-cover border-2 border-[#191A23] shadow-[2px_2px_0px_#191A23] cursor-zoom-in hover:opacity-90 transition-opacity"
              />
            ))}
          </div>
        )}

        <Markdown
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >
          {content}
        </Markdown>
      </div>

      {lightBox && (
        <div className='fixed inset-0 z-50 bg-[#191A23]/70 flex items-center justify-center p-6'>
          <button
            className='absolute top-5 right-5 text-white bg-[#191A23] border-2 border-white rounded-full p-2 cursor-pointer hover:bg-[#B9FF66] hover:text-[#191A23] hover:border-[#191A23] transition-colors'
            onClick={() => setLightBox(null)}
          >
            <X size={20} />
          </button>
          <img
            src={lightBox}
            className="max-w-[90vw] max-h-[85vh] rounded-2xl border-4 border-[#191A23] shadow-[8px_8px_0px_#191A23] object-contain bg-white"
          />
        </div>
      )}
    </div>
  )
}

export default React.memo(MessageBubble)
