import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import NextLink from 'next/link';
import { DataUpdateInfo } from '../atoms';

export interface FooterProps {
  version?: string;
  buildHash?: string;
}

const Footer: React.FC<FooterProps> = ({ 
  version = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  buildHash = process.env.NEXT_PUBLIC_BUILD_HASH || 'dev'
}) => {
  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 1, sm: 3 },
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
            gap: { xs: 0.5, sm: 2 },
          }}
        >
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="caption" color="text.secondary" display="block">
              v{version}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Build: {buildHash}
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <DataUpdateInfo />
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', sm: 'flex-end' },
              gap: { xs: 0.25, sm: 0.5 },
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <NextLink href="/sobre" passHref legacyBehavior>
                <Link color="text.secondary" underline="hover" variant="body2">
                  Sobre
                </Link>
              </NextLink>
              <NextLink href="/termos-de-uso" passHref legacyBehavior>
                <Link color="text.secondary" underline="hover" variant="body2">
                  Termos de Uso
                </Link>
              </NextLink>
            </Box>
            <Typography variant="caption" color="text.secondary" fontWeight="bold">
              Site não oficial do Governo do Brasil
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
