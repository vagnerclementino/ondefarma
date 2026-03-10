import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  metadataBase: new URL("https://achefarmarciapopular.clementino.me"),
  title: {
    default: "Ache uma Farmacia Popular",
    template: "%s | Ache uma Farmacia Popular",
  },
  description:
    "Encontre farmacias credenciadas no Programa Farmacia Popular com filtros por estado, cidade e bairro.",
  applicationName: "Ache uma Farmacia Popular",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon-dark-32x32.png",
        sizes: "32x32",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
      { url: "/icon.png", sizes: "any", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  appleWebApp: {
    capable: true,
    title: "Ache uma Farmacia Popular",
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "Ache uma Farmacia Popular",
    description:
      "Encontre farmacias credenciadas no Programa Farmacia Popular com filtros por estado, cidade e bairro.",
    siteName: "Ache uma Farmacia Popular",
  },
  twitter: {
    card: "summary",
    title: "Ache uma Farmacia Popular",
    description:
      "Encontre farmacias credenciadas no Programa Farmacia Popular com filtros por estado, cidade e bairro.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
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
