import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Link from 'next/link';
import { Header, Footer } from '../components/organisms';
import { Button, ScrollToTop, MarkdownContent } from '../components/atoms';

interface SobreProps {
  content: string;
}

export default function Sobre({ content }: SobreProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="md" sx={{ flex: 1, py: 4 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <MarkdownContent content={content} />

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

export const getStaticProps: GetStaticProps<SobreProps> = async () => {
  const filePath = path.join(process.cwd(), 'content', 'sobre.md');
  const content = fs.readFileSync(filePath, 'utf-8');

  return {
    props: {
      content,
    },
  };
};
