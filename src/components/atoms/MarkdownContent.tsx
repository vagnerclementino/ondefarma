import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  const LinkRenderer = ({ href, children, ...props }: any) => {
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

  return (
    <article className="markdown-body prose prose-slate max-w-none prose-headings:text-primary prose-a:text-primary">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: LinkRenderer }}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
