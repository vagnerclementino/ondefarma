import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import { Header, Footer } from '@/components/organisms';
import { Button, ScrollToTop, MarkdownContent } from '@/components/atoms';
import { Language, LinkedIn, Twitter, GitHub } from '@mui/icons-material';

interface StaticPageLayoutProps {
  content: string;
  showContactSection?: boolean;
}

export default function StaticPageLayout({ content, showContactSection = false }: StaticPageLayoutProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="md" sx={{ flex: 1, py: 4 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <MarkdownContent content={content} />

          {showContactSection && (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', my: 3 }}>
              <IconButton 
                component="a" 
                href="https://www.clementino.me" 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ color: 'primary.main' }}
              >
                <Language />
              </IconButton>
              <IconButton 
                component="a" 
                href="https://www.linkedin.com/in/vclementino" 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ color: '#0077B5' }}
              >
                <LinkedIn />
              </IconButton>
              <IconButton 
                component="a" 
                href="https://www.twitter.com/vclementino" 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ color: '#1DA1F2' }}
              >
                <Twitter />
              </IconButton>
              <IconButton 
                component="a" 
                href="https://www.github.com/vagnerclementino" 
                target="_blank" 
                rel="noopener noreferrer"
                sx={{ color: '#333' }}
              >
                <GitHub />
              </IconButton>
            </Box>
          )}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Link href="/" passHref style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="primary" size="large">
                Voltar para a Página Principal
              </Button>
            </Link>
          </Box>
        </Paper>
      </Container>
      <Footer />
      <ScrollToTop />
    </Box>
  );
}
