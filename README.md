
# Ache uma Farmácia Popular

Uma aplicação web moderna e responsiva para localizar farmácias credenciadas no Programa Farmácia Popular do Governo Federal Brasileiro. O site facilita a busca por farmácias através de filtros por estado, cidade e bairro, além de permitir que usuários salvem suas farmácias favoritas.

## 📋 Sobre o Projeto

O Programa Farmácia Popular disponibiliza dados de farmácias credenciadas em formato XLSX proprietário, dificultando o acesso e a busca por parte dos cidadãos. Este projeto converte esses dados para um formato acessível e oferece uma interface web intuitiva e mobile-first para facilitar a localização de farmácias próximas à residência do usuário.

**⚠️ Aviso Importante:** Este é um projeto independente e **não oficial**. Não possui vínculo com o Governo Federal. Para informações oficiais, consulte o [Portal do Ministério da Saúde](https://www.gov.br/saude/pt-br/acesso-a-informacao/acoes-e-programas/farmacia-popular).

## ✨ Funcionalidades

### MVP - Phase 1 (Implementado)

- ✅ **Listagem de Farmácias**: Visualização de todas as farmácias credenciadas com informações detalhadas
- ✅ **Filtros Cascata**: Filtros inteligentes por estado, cidade e bairro com atualização automática
- ✅ **Sistema de Favoritos**: Salve farmácias favoritas no localStorage para acesso rápido
- ✅ **Interface Responsiva**: Design mobile-first com Material-UI para excelente experiência em todos os dispositivos
- ✅ **Performance Otimizada**: Server-Side Rendering (SSR) com Next.js para carregamento rápido
- ✅ **Cache Inteligente**: Utiliza SWR para cache automático e revalidação de dados

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js 16.x ou superior
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/vagnerclementino/achefarmaciapopular.git
cd achefarmaciapopular
```

2. Instale as dependências:
```bash
npm install
```

3. Configure os Git hooks (Husky):
```bash
npx husky install
```

### Executando em Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000)

### Build de Produção

```bash
# Criar build otimizado
npm run build

# Executar em modo produção
npm start
```

### Executando Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch
```

## 📁 Estrutura do Projeto

O projeto segue a metodologia **Atomic Design** para organização de componentes e utiliza o diretório `src/` para melhor organização:

```
achefarmaciapopular/
├── src/                    # Código fonte da aplicação
│   ├── components/         # Componentes React organizados por Atomic Design
│   │   ├── atoms/         # Elementos básicos (Button, Input, Icon, etc.)
│   │   ├── molecules/     # Composições simples (FilterPanel, PharmacyCard)
│   │   └── organisms/     # Seções complexas (Header, Footer, PharmacyList)
│   ├── pages/             # Páginas Next.js e API routes
│   │   ├── api/           # API routes do Next.js
│   │   │   └── pharmacies/ # Endpoints de farmácias (states, cities, neighborhoods)
│   │   ├── index.tsx      # Página principal
│   │   ├── favorites.tsx  # Página de favoritos
│   │   └── termos-de-uso.tsx # Termos de uso
│   ├── hooks/             # Custom React hooks
│   │   ├── useFavorites.ts # Hook para gerenciar favoritos
│   │   └── usePharmacies.ts # Hook para buscar farmácias com SWR
│   ├── types/             # Definições TypeScript
│   │   ├── pharmacy.ts    # Interface Pharmacy
│   │   └── queryParams.ts # Tipos de parâmetros de query
│   ├── lib/               # Funções utilitárias
│   │   └── pharmacyData.ts # Processamento de dados CSV
│   ├── data/              # Dados estáticos
│   │   └── pharmacies.csv # Base de dados de farmácias
│   └── theme/             # Configuração do tema Material-UI
├── __tests__/             # Testes unitários e de integração
├── __mocks__/             # Mocks para testes
└── public/                # Arquivos estáticos

```

### Arquitetura

- **Frontend**: Next.js 15.1.3 com React 18.3 e TypeScript 5.7
- **UI Library**: Material-UI v6 (MUI) com tema customizado
- **State Management**: React hooks (useState, useEffect) + SWR para cache
- **Data Fetching**: SWR (stale-while-revalidate) para cache automático
- **Storage**: localStorage para persistência de favoritos
- **Testing**: Jest + React Testing Library com mocks do Next.js router
- **Code Quality**: ESLint + Husky (pre-push hooks)
- **Path Aliases**: Imports limpos com `@/*` apontando para `src/*`

## 🎨 Atomic Design

A estrutura de componentes segue o padrão Atomic Design dentro do diretório `src/components/`:

- **Atoms** (`src/components/atoms/`): Elementos básicos indivisíveis
  - Button, TextField, Select, IconButton, ScrollToTop, MarkdownContent
  
- **Molecules** (`src/components/molecules/`): Composições simples de atoms
  - FilterPanel, PharmacyCard
  
- **Organisms** (`src/components/organisms/`): Seções complexas da UI
  - Header, Footer, PharmacyList

### Path Aliases

O projeto utiliza path aliases para imports mais limpos:

```typescript
// Antes da migração
import { Pharmacy } from '../../../types/pharmacy';
import { Header } from '../../components/organisms';

// Depois da migração
import { Pharmacy } from '@/types/pharmacy';
import { Header } from '@/components/organisms';
```

Todos os imports utilizam o prefixo `@/` que aponta para o diretório `src/`.

## 🛠️ Tecnologias Utilizadas

### Core
- **Next.js 15.1.3** - Framework React com SSR e API routes
- **React 18.3.1** - Biblioteca UI
- **TypeScript 5.7.2** - Superset JavaScript com tipagem estática

### UI & Styling
- **Material-UI v6** (@mui/material, @mui/icons-material) - Sistema de design
- **Emotion** (@emotion/react, @emotion/styled) - CSS-in-JS

### Data & State
- **SWR 2.3.7** - Hook para data fetching com cache
- **csv-parser 3.0.0** - Parser de arquivos CSV

### Testing
- **Jest 29.7.0** - Framework de testes
- **React Testing Library** - Testes de componentes React
- **jest-fetch-mock** - Mock de requisições fetch
- **Next.js Router Mock** - Mock global do router para testes

### Development Tools
- **Husky 9.1.7** - Git hooks
- **ESLint 8.57.1** - Linter JavaScript/TypeScript
- **Path Aliases** - Imports limpos com `@/*`

## 🧪 Testes

O projeto possui cobertura de testes para:

- ✅ Componentes React (FilterPanel, PharmacyCard, DataUpdateInfo)
- ✅ API routes (pharmacies, states, cities, neighborhoods, by-cnpj)
- ✅ Custom hooks (useFavorites)
- ✅ Páginas (index, com mock do Next.js router)
- ✅ Property-based testing (com fast-check)

### Configuração de Testes

Os testes utilizam:
- **Jest** com configuração para path aliases (`@/*`)
- **Mock global do Next.js router** no `jest.setup.js`
- **jsdom** para ambiente de testes
- **@testing-library/react** para testes de componentes

Execute os testes com:
```bash
npm test                    # Executa todos os testes
npm run test:watch         # Executa em modo watch
npm run test:coverage      # Executa com cobertura
```

**Status atual**: ✅ 71/71 testes passando

## 📋 Qualidade de Código

### Política de Sem Comentários

Este projeto adota uma **política de código sem comentários inline**. O código deve ser auto-explicativo através de:
- Nomes descritivos de variáveis e funções
- Funções pequenas e focadas
- Constantes nomeadas
- Tipos TypeScript claros

Veja [docs/NO_COMMENTS_POLICY.md](docs/NO_COMMENTS_POLICY.md) para detalhes.

### ESLint

O ESLint está configurado para:
- ❌ Proibir comentários inline no código de produção
- ❌ Proibir comentários TODO, FIXME, HACK
- ✅ Permitir comentários apenas em testes
- ✅ Permitir JSDoc para documentação de APIs

```bash
npm run lint              # Verifica código
npm run lint:fix          # Corrige problemas automaticamente
npm run type-check        # Verifica tipos TypeScript
npm run validate          # Executa lint + type-check + tests
```

### CI/CD Pipeline

O projeto usa GitHub Actions para:
- ✅ Lint automático em PRs
- ✅ Testes automáticos
- ✅ Build verification
- ✅ Type checking
- ✅ Deploy automático para produção

Os workflows estão em `.github/workflows/`.

## 📝 Decisões Técnicas

### Por que Material-UI?
- Sistema de design maduro e bem documentado
- Componentes acessíveis e responsivos out-of-the-box
- Tema customizável e consistente
- Excelente suporte a TypeScript

### Por que SWR?
- Cache automático e revalidação inteligente
- Reduz requisições desnecessárias ao servidor
- Melhora significativa na performance percebida
- API simples e intuitiva

### Por que localStorage para Favoritos?
- Simplicidade: não requer autenticação ou banco de dados
- Performance: acesso instantâneo aos dados
- Privacidade: dados permanecem no dispositivo do usuário
- Adequado para MVP: validação rápida do conceito

### Por que CSV em vez de Banco de Dados?
- MVP simplificado: foco na validação do conceito
- Dados estáticos: farmácias não mudam frequentemente
- Sem custos de infraestrutura
- Fácil atualização: basta substituir o arquivo CSV
- Localização: dados ficam em `src/data/pharmacies.csv`

### Por que Diretório src/?
- **Organização moderna**: Separação clara entre código fonte e configuração
- **Padrão da indústria**: Seguindo convenções estabelecidas
- **Path aliases**: Imports mais limpos com `@/*`
- **Melhor navegação**: Estrutura lógica e intuitiva
- **Compatibilidade**: Suporte nativo do Next.js 13+

## 🔄 Git Hooks

O projeto utiliza Husky para garantir qualidade do código:

- **pre-push**: Executa todos os testes antes de fazer push
  - Garante que código quebrado não seja enviado ao repositório
  - Mantém a branch principal sempre estável

## 🚀 Migração Recente

O projeto foi recentemente migrado para uma estrutura mais moderna:

### ✅ **Atualizações Realizadas**
- **Next.js**: 13.0.0 → 15.1.3 (última versão estável)
- **React**: 18.0.0 → 18.3.1
- **TypeScript**: 5.2.2 → 5.7.2
- **Estrutura src/**: Todo código movido para diretório `src/`
- **Path Aliases**: Implementados imports com `@/*`
- **Testes**: Configuração atualizada com mocks do Next.js router
- **TypeScript Strict**: Modo estrito habilitado para maior segurança

### 📈 **Benefícios da Migração**
- **Performance**: Melhorias do Next.js 15 (Turbopack, cache otimizado)
- **Organização**: Estrutura mais limpa com separação clara
- **Manutenibilidade**: Imports mais legíveis e refatoração facilitada
- **Qualidade**: TypeScript strict mode para maior segurança de tipos
- **Testes**: Configuração robusta com 71/71 testes passando

Para detalhes completos da migração, veja [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md).

## 📸 Demo

![The landing page](frontpage.png)

## 🗺️ Roadmap - Próximas Features (Phase 2)

Features planejadas para versões futuras:

- 🔐 **Autenticação OAuth**: Login com Google e Facebook
- 🗄️ **Banco de Dados**: Migração para PostgreSQL com Prisma
- 📍 **Geolocalização**: Ordenação por distância usando localização do usuário
- 🗺️ **Mapas Interativos**: Visualização de farmácias em mapa com Leaflet
- 💊 **Disponibilidade de Medicamentos**: Usuários podem reportar medicamentos disponíveis
- ⚡ **Cache Distribuído**: Redis para melhor performance
- 📱 **PWA**: Suporte offline e instalação como app

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ⚠️ Disclaimer

Este é um projeto independente e **não oficial**. Não possui vínculo com o Governo Federal Brasileiro. Os dados podem conter imprecisões ou estar desatualizados. Para informações oficiais, consulte:

- 🌐 [Portal do Ministério da Saúde](https://www.gov.br/saude/pt-br/acesso-a-informacao/acoes-e-programas/farmacia-popular)
- 📞 Disque Saúde: 136

## 👨‍💻 Autor

**Vagner Clementino**

- GitHub: [@vagnerclementino](https://www.github.com/vagnerclementino)
- LinkedIn: [vclementino](https://www.linkedin.com/in/vclementino)
- Twitter: [@vclementino](https://www.twitter.com/vclementino)
- Portfolio: [clementino.me](https://clementino.me)

Desenvolvedor de software experiente com paixão por criar código excepcional e empoderar pessoas. Com experiência desde 2010 em Java, Kotlin, Python, Go, Node.js e Lua. Mestre em Engenharia de Software, atualmente Staff Engineer, com foco em desenvolvimento de pessoas tanto quanto em desenvolvimento de software.

## 🙏 Agradecimentos

- Dados fornecidos pelo [Ministério da Saúde do Brasil](https://www.gov.br/saude)
- Comunidade open source pelas excelentes ferramentas e bibliotecas

---

## 📊 Badges

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/vagnerclementino/achefarmaciapopular?utm_source=oss&utm_medium=github&utm_campaign=vagnerclementino%2Fachefarmaciapopular&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

**Feito com ❤️ para ajudar cidadãos brasileiros a encontrar farmácias do Programa Farmácia Popular**
