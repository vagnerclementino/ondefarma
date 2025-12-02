import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Link from 'next/link';
import { Header, Footer } from '../components/organisms';
import { Button, ScrollToTop } from '../components/atoms';

export default function TermosDeUso() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="md" sx={{ flex: 1, py: 4 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            Termos de Uso
          </Typography>

          <Typography variant="body2" color="text.secondary" paragraph>
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              1. Sobre o Site
            </Typography>
            <Typography variant="body1" paragraph>
              O site &quot;Ache uma Farmácia Popular&quot; é uma plataforma independente e{' '}
              <strong>não oficial</strong> que tem como objetivo facilitar a busca por
              farmácias credenciadas no Programa Farmácia Popular do Governo Federal
              Brasileiro.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              2. Isenção de Responsabilidade
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Este site não é oficial do Governo do Brasil.</strong> Os dados
              apresentados são obtidos de fontes públicas e podem conter imprecisões,
              estar desatualizados ou incompletos.
            </Typography>
            <Typography variant="body1" paragraph>
              O autor deste site <strong>não se responsabiliza</strong> por:
            </Typography>
            <Box component="ul" sx={{ pl: 4 }}>
              <li>
                <Typography variant="body1">
                  Erros, omissões ou imprecisões nas informações apresentadas
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  Alterações nos dados das farmácias credenciadas
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  Disponibilidade de medicamentos nas farmácias listadas
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  Funcionamento, horários ou serviços prestados pelas farmácias
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  Qualquer dano ou prejuízo decorrente do uso das informações deste site
                </Typography>
              </li>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              3. Fonte dos Dados
            </Typography>
            <Typography variant="body1" paragraph>
              Os dados das farmácias são obtidos de fontes públicas disponibilizadas pelo
              Governo Federal. Recomendamos que os usuários confirmem as informações
              diretamente com as farmácias ou através dos canais oficiais do Programa
              Farmácia Popular.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              4. Uso do Site
            </Typography>
            <Typography variant="body1" paragraph>
              Ao utilizar este site, você concorda que:
            </Typography>
            <Box component="ul" sx={{ pl: 4 }}>
              <li>
                <Typography variant="body1">
                  Utilizará as informações por sua própria conta e risco
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  Verificará as informações através de fontes oficiais quando necessário
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  Não responsabilizará o autor do site por eventuais problemas
                  decorrentes do uso das informações
                </Typography>
              </li>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              5. Privacidade
            </Typography>
            <Typography variant="body1" paragraph>
              Este site utiliza localStorage do navegador para armazenar suas preferências
              (como farmácias favoritas). Nenhum dado pessoal é coletado, armazenado em
              servidores externos ou compartilhado com terceiros.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              6. Modificações
            </Typography>
            <Typography variant="body1" paragraph>
              Estes termos de uso podem ser atualizados a qualquer momento sem aviso
              prévio. Recomendamos que você revise esta página periodicamente.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              7. Contato
            </Typography>
            <Typography variant="body1" paragraph>
              Para dúvidas ou sugestões sobre este site, entre em contato através do site{' '}
              <Link
                href="https://www.clementino.me"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
              >
                www.clementino.me
              </Link>
              .
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              8. Canais Oficiais
            </Typography>
            <Typography variant="body1" paragraph>
              Para informações oficiais sobre o Programa Farmácia Popular, acesse:
            </Typography>
            <Box component="ul" sx={{ pl: 4 }}>
              <li>
                <Typography variant="body1">
                  Site oficial:{' '}
                  <Link
                    href="https://www.gov.br/saude/pt-br/acesso-a-informacao/acoes-e-programas/farmacia-popular"
                    target="_blank"
                    rel="noopener noreferrer"
                    color="primary"
                  >
                    Portal do Ministério da Saúde
                  </Link>
                </Typography>
              </li>
              <li>
                <Typography variant="body1">Telefone: 136 (Disque Saúde)</Typography>
              </li>
            </Box>
          </Box>

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
