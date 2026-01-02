import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import HomeIcon from '@mui/icons-material/Home';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '../atoms';

export interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'Ache uma Farmácia Popular' }) => {
  const router = useRouter();
  
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });
  
  const isActive = (pathname: string) => router?.pathname === pathname;

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
                  fontSize: { xs: '0.9rem', sm: '1.25rem' },
                  color: 'white',
                }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  {title}
                </Box>
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                  Farmácia Popular
                </Box>
              </Typography>
            </Box>
          </Link>

          <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 } }}>
            <Link href="/" passHref style={{ textDecoration: 'none' }}>
              <Button
                variant={isActive('/') ? 'contained' : 'outlined'}
                aria-label="Início"
                sx={{
                  color: isActive('/') ? 'primary.main' : 'white',
                  backgroundColor: isActive('/') ? 'white' : 'transparent',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: isActive('/') ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:active': {
                    backgroundColor: isActive('/') ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.2)',
                  },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1, sm: 2 },
                  py: { xs: 0.75, sm: 1 },
                  minWidth: { xs: '40px', sm: 'auto' },
                  minHeight: { xs: '36px', sm: '40px' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: { xs: 0, sm: 1 },
                }}
              >
                <HomeIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.25rem' } }} />
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  Início
                </Box>
              </Button>
            </Link>
            <Link href="/favorites" passHref style={{ textDecoration: 'none' }}>
              <Button
                variant={isActive('/favorites') ? 'contained' : 'outlined'}
                aria-label="Favoritos"
                sx={{
                  color: isActive('/favorites') ? 'primary.main' : 'white',
                  backgroundColor: isActive('/favorites') ? 'white' : 'transparent',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: isActive('/favorites') ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:active': {
                    backgroundColor: isActive('/favorites') ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.2)',
                  },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1, sm: 2 },
                  py: { xs: 0.75, sm: 1 },
                  minWidth: { xs: '40px', sm: 'auto' },
                  minHeight: { xs: '36px', sm: '40px' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: { xs: 0, sm: 1 },
                }}
              >
                <FavoriteIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.25rem' } }} />
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
