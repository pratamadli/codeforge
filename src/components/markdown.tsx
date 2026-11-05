import type { ReactNode } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function headingText(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(headingText).join("");
  return "";
}

function tipClass(text: string): string | undefined {
  const t = text.toLowerCase();
  if (t.includes("tips")) return "tip-blue";
  if (t.includes("sudut pandang") || t.includes("senior")) return "tip-yellow";
  if (t.includes("kesalahan")) return "tip-red";
  return undefined;
}

const components: Components = {
  h2({ children, ...props }) {
    const klass = tipClass(headingText(children));
    return (
      <h2 className={klass} {...props}>
        {children}
      </h2>
    );
  },
};

export function Markdown({ content }: { content: string }) {
  return (
    <div className="md">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
