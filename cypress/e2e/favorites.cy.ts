describe('Favoritos', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.wait(3000); // Aguarda carregamento inicial
  });

  it('deve adicionar uma farmácia aos favoritos', () => {
    // Aguarda o carregamento das farmácias
    cy.get('[data-testid="pharmacy-card"]', { timeout: 10000 }).should('exist');
    
    // Clica no primeiro botão de favorito
    cy.get('[data-testid="pharmacy-card"]')
      .first()
      .find('[aria-label="Adicionar aos favoritos"]')
      .click();
    
    // Verifica se o ícone mudou para favorito preenchido
    cy.get('[data-testid="pharmacy-card"]')
      .first()
      .find('[aria-label="Remover dos favoritos"]')
      .should('exist');
    
    // Verifica se foi salvo no localStorage
    cy.window().then((win) => {
      const favorites = JSON.parse(win.localStorage.getItem('farmacia-popular-favorites') || '[]');
      expect(favorites).to.have.length.at.least(1);
    });
  });

  it('deve remover uma farmácia dos favoritos', () => {
    // Adiciona um favorito primeiro
    cy.get('[data-testid="pharmacy-card"]', { timeout: 10000 }).should('exist');
    cy.get('[data-testid="pharmacy-card"]')
      .first()
      .find('[aria-label="Adicionar aos favoritos"]')
      .click();
    
    cy.get('[data-testid="pharmacy-card"]')
      .first()
      .find('[aria-label="Remover dos favoritos"]')
      .should('exist');
    
    // Remove o favorito
    cy.get('[data-testid="pharmacy-card"]')
      .first()
      .find('[aria-label="Remover dos favoritos"]')
      .click();
    
    // Verifica se o ícone voltou para não favorito
    cy.get('[data-testid="pharmacy-card"]')
      .first()
      .find('[aria-label="Adicionar aos favoritos"]')
      .should('exist');
    
    // Verifica se foi removido do localStorage
    cy.window().then((win) => {
      const favorites = JSON.parse(win.localStorage.getItem('farmacia-popular-favorites') || '[]');
      expect(favorites).to.have.length(0);
    });
  });

  it('deve manter favoritos após filtragem por bairro', () => {
    // Adiciona um favorito
    cy.get('[data-testid="pharmacy-card"]', { timeout: 10000 }).should('exist');
    cy.get('[data-testid="pharmacy-card"]')
      .first()
      .find('[aria-label="Adicionar aos favoritos"]')
      .click();
    
    // Captura o CNPJ da farmácia favoritada
    cy.window().then((win) => {
      const favorites = JSON.parse(win.localStorage.getItem('farmacia-popular-favorites') || '[]');
      expect(favorites).to.have.length.at.least(1);
    });
    
    // Muda o filtro de bairro
    cy.wait(1000);
    cy.get('[data-testid="neighborhood-select"]').should('not.be.disabled');
    cy.get('[data-testid="neighborhood-select"]').click();
    cy.get('li[role="option"]').not(':contains("Todos os bairros")').first().click();
    
    // Aguarda o carregamento
    cy.wait(2000);
    
    // Verifica se o favorito ainda está no localStorage
    cy.window().then((win) => {
      const favorites = JSON.parse(win.localStorage.getItem('farmacia-popular-favorites') || '[]');
      expect(favorites).to.have.length.at.least(1);
    });
  });

  it('deve adicionar múltiplos favoritos', () => {
    cy.get('[data-testid="pharmacy-card"]', { timeout: 10000 }).should('exist');
    
    // Adiciona 3 favoritos
    cy.get('[data-testid="pharmacy-card"]')
      .eq(0)
      .find('[aria-label="Adicionar aos favoritos"]')
      .click();
    
    cy.wait(300);
    
    cy.get('[data-testid="pharmacy-card"]')
      .eq(1)
      .find('[aria-label="Adicionar aos favoritos"]')
      .click();
    
    cy.wait(300);
    
    cy.get('[data-testid="pharmacy-card"]')
      .eq(2)
      .find('[aria-label="Adicionar aos favoritos"]')
      .click();
    
    // Verifica se todos foram salvos
    cy.window().then((win) => {
      const favorites = JSON.parse(win.localStorage.getItem('farmacia-popular-favorites') || '[]');
      expect(favorites).to.have.length(3);
    });
  });

  it('deve navegar para página de favoritos e visualizar farmácia', () => {
    // Adiciona um favorito
    cy.get('[data-testid="pharmacy-card"]', { timeout: 10000 }).should('exist');
    cy.get('[data-testid="pharmacy-card"]')
      .first()
      .find('[aria-label="Adicionar aos favoritos"]')
      .click();
    
    // Navega para página de favoritos
    cy.contains('a', 'Favoritos').click();
    
    // Verifica se está na página correta
    cy.url().should('include', '/favorites');
    
    // Aguarda carregamento
    cy.wait(3000);
    
    // Verifica se o favorito aparece
    cy.get('[data-testid="pharmacy-card"]', { timeout: 10000 }).should('exist');
    
    // Verifica que tem o botão de remover
    cy.get('[data-testid="pharmacy-card"]')
      .first()
      .find('[aria-label="Remover dos favoritos"]')
      .should('exist');
  });
});
