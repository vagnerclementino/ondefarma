import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export default function MarkdownContent({ content, className }: MarkdownContentProps) {
  const LinkRenderer: Components['a'] = ({ href, children, ...props }) => {
    const isExternal = href &&
      (href.startsWith('http://') || href.startsWith('https://')) &&
      (typeof window === 'undefined' || !href.startsWith(window.location.origin)) &&
      !href.startsWith('mailto:') &&
      !href.startsWith('tel:');

    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      );
    }

    return <a href={href} {...props}>{children}</a>;
  };

  const components: Components = {
    h1: ({ children }) => <h1 className="text-3xl font-extrabold leading-tight mb-5">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold leading-tight mt-8 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold leading-tight mt-6 mb-3">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg font-semibold leading-tight mt-5 mb-2">{children}</h4>,
    p: ({ children }) => <p className="text-base leading-7 mb-4">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
    li: ({ children }) => <li className="leading-7">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#0b4aa8]/30 pl-4 italic my-5 text-muted-foreground">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-8 border-border" />,
    a: LinkRenderer,
    strong: ({ children }) => <strong className="font-extrabold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  };

  return (
    <article className={className ? `markdown-body ${className}` : 'markdown-body'}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
