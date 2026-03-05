import Link from 'next/link';
import { Github, Globe, Linkedin, Twitter } from 'lucide-react';
import { Header, Footer } from '@/components/organisms';
import { Button, ScrollToTop, MarkdownContent } from '@/components/atoms';

interface StaticPageLayoutProps {
  content: string;
  showContactSection?: boolean;
}

export default function StaticPageLayout({ content, showContactSection = false }: StaticPageLayoutProps) {
  return (
    <div className="page-shell">
      <Header />
      <main className="app-container page-content">
        <div className="surface-card p-5 sm:p-8">
          <MarkdownContent content={content} />

          {showContactSection && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <a href="https://www.clementino.me" target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="Website"><Globe className="h-4 w-4" /></a>
              <a href="https://www.linkedin.com/in/vclementino" target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="LinkedIn"><Linkedin className="h-4 w-4" /></a>
              <a href="https://www.twitter.com/vclementino" target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="Twitter"><Twitter className="h-4 w-4" /></a>
              <a href="https://www.github.com/vagnerclementino" target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="GitHub"><Github className="h-4 w-4" /></a>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Button variant="contained" size="large">
                Voltar para a Página Principal
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
