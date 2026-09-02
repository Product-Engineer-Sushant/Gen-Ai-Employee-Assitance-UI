
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaExternalLinkAlt } from "react-icons/fa";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  return (
    <div
      className={`
        text-sm leading-7 text-gray-700
        ${className}
      `}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // =========================
          // HEADINGS
          // =========================

          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-2">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-gray-900 mb-3 mt-6">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-5">
              {children}
            </h3>
          ),

          h4: ({ children }) => (
            <h4 className="text-base font-semibold text-gray-800 mb-2 mt-4">
              {children}
            </h4>
          ),

          // =========================
          // PARAGRAPH
          // =========================

          p: ({ children }) => (
            <p className="mb-3 last:mb-0">
              {children}
            </p>
          ),

          // =========================
          // BOLD / ITALIC
          // =========================

          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">
              {children}
            </strong>
          ),

          em: ({ children }) => (
            <em className="italic text-gray-600">
              {children}
            </em>
          ),

          // =========================
          // UNORDERED LIST
          // =========================

          ul: ({ children }) => (
            <ul className="list-disc pl-6 space-y-1.5 mb-4">
              {children}
            </ul>
          ),

          // =========================
          // ORDERED LIST
          // =========================

          ol: ({ children }) => (
            <ol className="list-decimal pl-6 space-y-1.5 mb-4">
              {children}
            </ol>
          ),

          // =========================
          // LIST ITEM
          // =========================

          li: ({ children }) => (
            <li className="pl-1">
              {children}
            </li>
          ),

          // =========================
          // LINKS
          // =========================

          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-1
                text-blue-600
                font-medium
                hover:text-blue-700
                hover:underline
                transition
              "
            >
              {children}
              <FaExternalLinkAlt size={10} />
            </a>
          ),

          // =========================
          // BLOCKQUOTE
          // =========================

          blockquote: ({ children }) => (
            <blockquote
              className="
                my-4
                border-l-4
                border-blue-500
                bg-blue-50
                px-4
                py-3
                rounded-r-lg
                text-gray-700
                italic
              "
            >
              {children}
            </blockquote>
          ),

          // =========================
          // HORIZONTAL LINE
          // =========================

          hr: () => (
            <hr className="my-5 border-gray-200" />
          ),

          // =========================
          // INLINE CODE
          // =========================

          code: ({ className, children }) => {
            const isCodeBlock = className?.includes("language-");

            if (isCodeBlock) {
              return (
                <code className={className}>
                  {children}
                </code>
              );
            }

            return (
              <code
                className="
                  bg-gray-100
                  text-pink-600
                  px-1.5
                  py-0.5
                  rounded
                  text-[13px]
                  font-mono
                "
              >
                {children}
              </code>
            );
          },

          // =========================
          // CODE BLOCK
          // =========================

          pre: ({ children }) => (
            <pre
              className="
                my-4
                overflow-x-auto
                rounded-xl
                bg-gray-900
                p-4
                text-sm
                leading-6
                text-gray-100
                shadow-sm
                scrollbar-thin
                scrollbar-thumb-gray-600
                scrollbar-track-transparent
              "
            >
              {children}
            </pre>
          ),

          // =========================
          // TABLE
          // =========================

          table: ({ children }) => (
            <div className="my-5 overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm text-left">
                {children}
              </table>
            </div>
          ),

          thead: ({ children }) => (
            <thead className="bg-gray-100 text-gray-800">
              {children}
            </thead>
          ),

          tbody: ({ children }) => (
            <tbody className="divide-y divide-gray-200 bg-white">
              {children}
            </tbody>
          ),

          tr: ({ children }) => (
            <tr className="hover:bg-gray-50 transition">
              {children}
            </tr>
          ),

          th: ({ children }) => (
            <th className="px-4 py-3 font-semibold whitespace-nowrap">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="px-4 py-3">
              {children}
            </td>
          ),

          // =========================
          // IMAGE
          // =========================

          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt || ""}
              className="
                max-w-full
                rounded-xl
                border
                border-gray-200
                my-4
              "
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}