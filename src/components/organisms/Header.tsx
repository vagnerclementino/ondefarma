import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Heart, Home, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'Ache uma Farmácia Popular' }) => {
  const router = useRouter();
  const isActive = (pathname: string) => router?.pathname === pathname;

  return (
    <header className="site-header">
      <div className="app-container site-header-inner">
        <Link href="/" className="brand-link" aria-label="Início">
          <Pill className="h-7 w-7" />
          <h1 className="m-0 text-sm sm:text-xl font-extrabold">{title}</h1>
        </Link>

        <nav className="header-actions" aria-label="Navegação principal">
          <Button
            asChild
            variant="outline"
            className={cn(
              'border-white/90 bg-transparent text-white hover:bg-white/15 hover:text-white',
              isActive('/') && 'bg-white text-[#0847aa] hover:bg-white/95 hover:text-[#0847aa]'
            )}
          >
            <Link href="/" aria-label="Início">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Início</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className={cn(
              'border-white/90 bg-transparent text-white hover:bg-white/15 hover:text-white',
              isActive('/favorites') && 'bg-white text-[#0847aa] hover:bg-white/95 hover:text-[#0847aa]'
            )}
          >
            <Link href="/favorites" aria-label="Favoritos">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Favoritos</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
