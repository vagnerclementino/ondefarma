import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import StaticPageLayout from '@/components/templates/StaticPageLayout';

interface SobreProps {
  content: string;
}

export default function Sobre({ content }: SobreProps) {
  return <StaticPageLayout content={content} showContactSection />;
}

export const getStaticProps: GetStaticProps<SobreProps> = async () => {
  const filePath = path.join(process.cwd(), 'content', 'sobre.md');
  const content = fs.readFileSync(filePath, 'utf-8');

  return {
    props: {
      content,
    },
  };
};
