describe('Filtros', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.wait(3000); // Aguarda carregamento inicial
  });

  it('deve carregar a página inicial com filtros padrão', () => {
    // Verifica se os filtros estão visíveis
    cy.get('[data-testid="state-select"]').should('exist');
    cy.get('[data-testid="city-select"]').should('exist');
    cy.get('[data-testid="neighborhood-select"]').should('exist');
    
    // Verifica se há farmácias carregadas
    cy.get('[data-testid="pharmacy-card"]', { timeout: 10000 }).should('exist');
  });

  it('deve filtrar por bairro', () => {
    // Aguarda o carregamento dos bairros
    cy.wait(2000);
    
    // Seleciona um bairro
    cy.get('[data-testid="neighborhood-select"]').should('not.be.disabled');
    cy.get('[data-testid="neighborhood-select"]').click();
    cy.get('li[role="option"]').not(':contains("Todos os bairros")').first().click();
    
    // Aguarda o carregamento
    cy.wait(2000);
    
    // Verifica se a URL foi atualizada
    cy.url().should('include', 'neighborhood=');
    
    // Verifica se há farmácias carregadas
    cy.get('[data-testid="pharmacy-card"]', { timeout: 10000 }).should('exist');
  });

  it('deve limpar filtro de bairro', () => {
    // Seleciona um bairro
    cy.wait(2000);
    cy.get('[data-testid="neighborhood-select"]').should('not.be.disabled');
    cy.get('[data-testid="neighborhood-select"]').click();
    cy.get('li[role="option"]').not(':contains("Todos os bairros")').first().click();
    cy.wait(1000);
    
    // Verifica que o botão de limpar apareceu
    cy.get('[data-testid="clear-neighborhood"]', { timeout: 5000 }).should('exist');
    
    // Limpa o filtro
    cy.get('[data-testid="clear-neighborhood"]').click();
    
    // Aguarda
    cy.wait(1000);
    
    // Verifica se o filtro foi limpo
    cy.url().should('not.include', 'neighborhood=');
  });

  it('deve exibir farmácias após aplicar filtros', () => {
    // Seleciona um bairro
    cy.wait(2000);
    cy.get('[data-testid="neighborhood-select"]').should('not.be.disabled');
    cy.get('[data-testid="neighborhood-select"]').click();
    cy.get('li[role="option"]').not(':contains("Todos os bairros")').first().click();
    
    // Aguarda o carregamento
    cy.wait(2000);
    
    // Verifica se há farmácias carregadas
    cy.get('[data-testid="pharmacy-card"]', { timeout: 10000 }).should('exist');
  });
});
