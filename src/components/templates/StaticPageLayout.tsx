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
      <main className="app-container page-content static-page-container">
        <div className="surface-card static-page-card">
          <MarkdownContent content={content} className="legacy-static-markdown" />

          {showContactSection && (
            <div className="static-page-socials">
              <a href="https://www.clementino.me" target="_blank" rel="noopener noreferrer" className="static-social-btn static-social-web" aria-label="Website"><Globe className="h-5 w-5" /></a>
              <a href="https://www.linkedin.com/in/vclementino" target="_blank" rel="noopener noreferrer" className="static-social-btn static-social-linkedin" aria-label="LinkedIn"><Linkedin className="h-5 w-5" /></a>
              <a href="https://www.twitter.com/vclementino" target="_blank" rel="noopener noreferrer" className="static-social-btn static-social-twitter" aria-label="Twitter"><Twitter className="h-5 w-5" /></a>
              <a href="https://www.github.com/vagnerclementino" target="_blank" rel="noopener noreferrer" className="static-social-btn static-social-github" aria-label="GitHub"><Github className="h-5 w-5" /></a>
            </div>
          )}

          <div className="static-page-cta-row">
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Button variant="contained" size="large" className="static-page-cta">
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
