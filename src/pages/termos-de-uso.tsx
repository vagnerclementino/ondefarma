import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import StaticPageLayout from '@/components/templates/StaticPageLayout';

interface TermosDeUsoProps {
  content: string;
  lastUpdated: string;
}

export default function TermosDeUso({ content }: TermosDeUsoProps) {
  return <StaticPageLayout content={content} showContactSection/>;
}

export const getStaticProps: GetStaticProps<TermosDeUsoProps> = async () => {
  const filePath = path.join(process.cwd(), 'content', 'termos-de-uso.md');
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract the date from the markdown content
  const dateMatch = content.match(/\*\*Última atualização:\*\* (.+)/);
  const lastUpdated = dateMatch ? dateMatch[1] : new Date().toLocaleDateString('pt-BR');

  return {
    props: {
      content,
      lastUpdated,
    },
  };
};
