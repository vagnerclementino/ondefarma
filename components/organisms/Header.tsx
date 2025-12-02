import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Link from 'next/link';
import { Button } from '../atoms';

export interface HeaderProps {
  title?: string;
}

/**
 * Header organism - Cabeçalho da aplicação flutuante
 * Inclui logo, título e navegação para favoritos
 * Fica fixo no topo ao fazer scroll
 */
const Header: React.FC<HeaderProps> = ({ title = 'Ache uma Farmácia Popular' }) => {
  // Detecta quando o usuário faz scroll para adicionar sombra
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return (
    <AppBar
      position="sticky"
      elevation={trigger ? 4 : 2}
      sx={{
        transition: 'box-shadow 0.3s ease-in-out',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 1,
          }}
        >
          {/* Logo e Título */}
          <Link href="/" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              <LocalPharmacyIcon
                sx={{
                  fontSize: { xs: 28, sm: 32 },
                  color: 'white',
                }}
              />
              <Typography
                variant="h6"
                component="h1"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  color: 'white',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="h6"
                component="h1"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: 'white',
                  display: { xs: 'block', sm: 'none' },
                }}
              >
                Farmácia Popular
              </Typography>
            </Box>
          </Link>

          {/* Navegação */}
          <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 } }}>
            <Link href="/favorites" passHref style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                startIcon={<FavoriteIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:active': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Better touch feedback
                  },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1, sm: 2 },
                  py: { xs: 0.75, sm: 1 }, // Better touch target size
                  minHeight: { xs: '36px', sm: '40px' }, // Minimum touch target
                }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  Favoritos
                </Box>
              </Button>
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
