describe('Favorites', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.get('[data-testid="pharmacy-card"]', { timeout: 10000 }).should('exist');
  });

  it('should add a pharmacy to favorites', () => {
    cy.get('[data-testid="pharmacy-card"]')
      .first()
      .find('[aria-label="Adicionar aos favoritos"]')
      .click();
    
    cy.get('[data-testid="pharmacy-card"]')
      .first()
      .find('[aria-label="Remover dos favoritos"]')
      .should('exist');
    
    cy.window().then((win) => {
      const favorites = JSON.parse(win.localStorage.getItem('farmacia-popular-favorites') || '[]');
      expect(favorites).to.have.length.at.least(1);
    });
  });

  it('should remove a pharmacy from favorites', () => {
    cy.get('[data-testid="pharmacy-card"]')
      .first()
      .find('[aria-label="Adicionar aos favoritos"]')
      .click();
    
    cy.get('[data-testid="pharmacy-card"]')
      .first()
      .find('[aria-label="Remover dos favoritos"]')
      .click();
    
    cy.get('[data-testid="pharmacy-card"]')
      .first()
      .find('[aria-label="Adicionar aos favoritos"]')
      .should('exist');
    
    cy.window().then((win) => {
      const favorites = JSON.parse(win.localStorage.getItem('farmacia-popular-favorites') || '[]');
      expect(favorites).to.have.length(0);
    });
  });

  it('should keep favorites after filtering by neighborhood', () => {
    cy.get('[data-testid="pharmacy-card"]')
      .first()
      .find('[aria-label="Adicionar aos favoritos"]')
      .click();
    
    cy.window().then((win) => {
      const favorites = JSON.parse(win.localStorage.getItem('farmacia-popular-favorites') || '[]');
      expect(favorites).to.have.length.at.least(1);
    });
    
    cy.get('[data-testid="neighborhood-select"]').should('not.be.disabled');
    cy.get('[data-testid="neighborhood-select"]').click();
    cy.get('li[role="option"]').not(':contains("Todos os bairros")').first().click();
    
    cy.get('[data-testid="pharmacy-card"]', { timeout: 10000 }).should('exist');
    
    cy.window().then((win) => {
      const favorites = JSON.parse(win.localStorage.getItem('farmacia-popular-favorites') || '[]');
      expect(favorites).to.have.length.at.least(1);
    });
  });

  it('should add multiple favorites', () => {
    cy.get('[data-testid="pharmacy-card"]').eq(0).find('[aria-label="Adicionar aos favoritos"]').click();
    cy.get('[data-testid="pharmacy-card"]').eq(1).find('[aria-label="Adicionar aos favoritos"]').click();
    cy.get('[data-testid="pharmacy-card"]').eq(2).find('[aria-label="Adicionar aos favoritos"]').click();
    
    cy.window().then((win) => {
      const favorites = JSON.parse(win.localStorage.getItem('farmacia-popular-favorites') || '[]');
      expect(favorites).to.have.length(3);
    });
  });

  it('should navigate to favorites page and view pharmacy', () => {
    cy.get('[data-testid="pharmacy-card"]')
      .first()
      .find('[aria-label="Adicionar aos favoritos"]')
      .click();
    
    cy.contains('a', 'Favoritos').click();
    cy.url().should('include', '/favorites');
    
    cy.get('[data-testid="pharmacy-card"]', { timeout: 10000 }).should('exist');
    cy.get('[data-testid="pharmacy-card"]')
      .first()
      .find('[aria-label="Remover dos favoritos"]')
      .should('exist');
  });
});
