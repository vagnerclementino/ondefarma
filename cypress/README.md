# Testes E2E com Cypress

Este diretório contém os testes end-to-end (E2E) da aplicação usando Cypress.

## Estrutura

```
cypress/
├── e2e/              # Testes E2E
│   ├── favorites.cy.ts   # Testes de favoritos
│   └── filters.cy.ts     # Testes de filtros
├── fixtures/         # Dados de teste
├── support/          # Comandos customizados e configurações
│   ├── commands.ts
│   └── e2e.ts
└── README.md
```

## Executar Testes

### Modo Interativo (com interface)
```bash
npm run test:e2e:open
```

### Modo Headless (CI/CD)
```bash
npm run test:e2e
```

### Apenas Cypress (sem servidor)
```bash
# Abrir interface
npm run cypress:open

# Executar em headless
npm run cypress:run
```

## Cenários de Teste

### Favoritos (`favorites.cy.ts`)
- ✅ Adicionar farmácia aos favoritos
- ✅ Remover farmácia dos favoritos
- ✅ Manter favoritos após filtragem
- ✅ Adicionar múltiplos favoritos
- ✅ Navegar para página de favoritos

### Filtros (`filters.cy.ts`)
- ✅ Carregar página com filtros padrão
- ✅ Filtrar por estado
- ✅ Filtrar por cidade
- ✅ Filtrar por bairro
- ✅ Limpar filtro de bairro
- ✅ Manter filtros ao recarregar página
- ✅ Exibir mensagem quando não há resultados

## Pipeline CI/CD

Os testes E2E são executados automaticamente na pipeline do GitHub Actions em cada Pull Request.

O workflow está configurado em `.github/workflows/quality.yml` e inclui:
- Build da aplicação
- Execução dos testes E2E
- Upload de screenshots em caso de falha
- Upload de vídeos dos testes

## Comandos Customizados

### `cy.clearLocalStorage()`
Limpa o localStorage antes de cada teste para garantir estado limpo.

Exemplo:
```typescript
beforeEach(() => {
  cy.clearLocalStorage();
  cy.visit('/');
});
```

## Boas Práticas

1. **Use data-testid**: Sempre use `data-testid` para selecionar elementos nos testes
2. **Aguarde carregamento**: Use `cy.wait()` quando necessário para aguardar carregamento de dados
3. **Limpe estado**: Use `cy.clearLocalStorage()` antes de cada teste
4. **Teste isolado**: Cada teste deve ser independente e não depender de outros
5. **Assertions claras**: Use assertions descritivas e específicas

## Troubleshooting

### Testes falhando localmente
1. Certifique-se de que a aplicação está rodando em `http://localhost:3000`
2. Limpe o cache do Cypress: `npx cypress cache clear`
3. Reinstale o Cypress: `npm install cypress --force`

### Timeout errors
Aumente o timeout nas configurações do Cypress em `cypress.config.ts`:
```typescript
defaultCommandTimeout: 10000,
requestTimeout: 10000,
```
