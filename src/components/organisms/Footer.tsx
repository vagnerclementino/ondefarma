import React from 'react';
import NextLink from 'next/link';
import { DataUpdateInfo } from '@/components/atoms';

export interface FooterProps {
  version?: string;
  buildHash?: string;
}

const Footer: React.FC<FooterProps> = ({
  version = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  buildHash = process.env.NEXT_PUBLIC_BUILD_HASH || 'dev',
}) => {
  return (
    <footer className="site-footer">
      <div className="app-container site-footer-inner">
        <div className="text-xs text-muted-foreground">
          <p className="m-0">v{version}</p>
          <p className="m-0">Build: {buildHash}</p>
        </div>

        <DataUpdateInfo />

        <div className="flex flex-col items-center sm:items-end gap-1">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <NextLink href="/sobre" className="hover:underline">Sobre</NextLink>
            <NextLink href="/termos-de-uso" className="hover:underline">Termos de Uso</NextLink>
          </div>
          <p className="m-0 text-xs font-semibold text-muted-foreground">Site não oficial do Governo do Brasil</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
