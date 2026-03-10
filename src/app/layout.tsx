import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  applicationName: "Ache uma Farmacia Popular",
  appleWebApp: {
    title: "Ache uma Farmacia Popular",
  },
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="apple-mobile-web-app-title" content="Ache uma Farmacia Popular" />
      </head>
      <body>{children}</body>
    </html>
  );
}
