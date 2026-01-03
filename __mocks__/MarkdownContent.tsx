import React from 'react';

// Mock do componente MarkdownContent para testes
export default function MarkdownContent({ content }: { content: string }) {
  return <div data-testid="markdown-content">{content}</div>;
}
