import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NextLink from 'next/link';

export interface FooterProps {
  version?: string;
  buildHash?: string;
}

/**
 * Footer organism - Rodapé da aplicação
 * Exibe informações de copyright, build e links
 */
const Footer: React.FC<FooterProps> = ({ 
  version = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  buildHash = process.env.NEXT_PUBLIC_BUILD_HASH || 'dev'
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: 2,
          }}
        >
          {/* Coluna esquerda - Copyright e autor */}
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              © {currentYear} Ache uma Farmácia Popular
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', sm: 'flex-start' },
                gap: 0.5,
              }}
            >
              Feito com{' '}
              <FavoriteIcon
                sx={{
                  fontSize: 16,
                  color: 'error.main',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': {
                      transform: 'scale(1)',
                    },
                    '50%': {
                      transform: 'scale(1.1)',
                    },
                  },
                }}
              />{' '}
              por{' '}
              <Link
                href="https://www.clementino.me"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                underline="hover"
              >
                Vagner Clementino
              </Link>
            </Typography>
          </Box>

          {/* Coluna central - Build info */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              v{version}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Build: {buildHash}
            </Typography>
          </Box>

          {/* Coluna direita - Links */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', sm: 'flex-end' },
              gap: 0.5,
            }}
          >
            <NextLink href="/termos-de-uso" passHref legacyBehavior>
              <Link color="text.secondary" underline="hover" variant="body2">
                Termos de Uso
              </Link>
            </NextLink>
            <Typography variant="caption" color="text.secondary">
              Site não oficial do Governo do Brasil
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
