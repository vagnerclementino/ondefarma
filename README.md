# Ache uma Farmácia Popular

[![CI/CD Pipeline](https://github.com/vagnerclementino/achefarmaciapopular/actions/workflows/ci.yml/badge.svg)](https://github.com/vagnerclementino/achefarmaciapopular/actions/workflows/ci.yml)
[![Deploy](https://github.com/vagnerclementino/achefarmaciapopular/actions/workflows/deploy.yml/badge.svg)](https://github.com/vagnerclementino/achefarmaciapopular/actions/workflows/deploy.yml)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.3-black.svg)](https://nextjs.org/)

Uma aplicação web moderna e responsiva para localizar farmácias credenciadas no Programa Farmácia Popular do Governo Federal Brasileiro.

**⚠️ Projeto independente e não oficial** - Para informações oficiais, consulte o [Portal do Ministério da Saúde](https://www.gov.br/saude/pt-br/acesso-a-informacao/acoes-e-programas/farmacia-popular).

## Funcionalidades

- **Busca Inteligente**: Filtros cascata por estado, cidade e bairro
- **Sistema de Favoritos**: Salve farmácias para acesso rápido
- **Design Responsivo**: Interface mobile-first otimizada
- **Performance**: SSR com Next.js e cache inteligente com SWR
- **Acessibilidade**: Componentes Material-UI acessíveis

## Início Rápido

```bash
# Clone o repositório
git clone https://github.com/vagnerclementino/achefarmaciapopular.git
cd achefarmaciapopular

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Stack Tecnológica

- **Frontend**: Next.js 15.1.3, React 18.3, TypeScript 5.7
- **UI**: Material-UI v6 com tema customizado
- **Data**: SWR para cache, CSV para dados estáticos
- **Testes**: Jest + React Testing Library (71/71 ✅)
- **Qualidade**: ESLint, Husky, TypeScript strict mode

## Estrutura

```
src/
├── components/         # Atomic Design (atoms/molecules/organisms)
├── pages/             # Páginas Next.js e API routes
├── hooks/             # Custom React hooks
├── types/             # Definições TypeScript
├── lib/               # Funções utilitárias
└── data/              # Dados estáticos (CSV)
```

## Scripts

```bash
npm run dev            # Desenvolvimento
npm run build          # Build de produção
npm test               # Executar testes unitários
npm run test:e2e       # Executar testes E2E (headless)
npm run test:e2e:open  # Executar testes E2E (interativo)
npm run lint           # Verificar código
npm run validate       # Lint + testes + type-check
```

### Testes E2E

Os testes end-to-end usam Cypress e cobrem:
- Sistema de favoritos (adicionar/remover/navegar)
- Filtros cascata (estado/cidade/bairro)
- Persistência de dados no localStorage
- Responsividade e navegação

Executam automaticamente na CI/CD pipeline.

## Demo

![Demo da aplicação](frontpage.gif)

## Contribuindo

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

## Autor

**Vagner Clementino**
- GitHub: [@vagnerclementino](https://github.com/vagnerclementino)
- LinkedIn: [vclementino](https://linkedin.com/in/vclementino)
- Portfolio: [clementino.me](https://clementino.me)

---

**Feito com ❤️ para ajudar cidadãos brasileiros a encontrar farmácias do Programa Farmácia Popular**
