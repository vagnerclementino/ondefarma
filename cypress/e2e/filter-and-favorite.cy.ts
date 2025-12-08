describe('Filter and Favorite Pharmacy', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.wait(3000);
  });

  it('should filter by Castelo neighborhood, favorite a pharmacy and view it on favorites page', () => {
    cy.get('[data-testid="pharmacy-card"]', { timeout: 10000 }).should('exist');
    
    cy.log('Filtering by Castelo neighborhood');
    
    cy.get('[data-testid="neighborhood-select"]', { timeout: 10000 }).should('not.be.disabled');
    
    cy.get('[data-testid="neighborhood-select"]').click();
    
    cy.get('li[role="option"]').contains('CASTELO').click({ force: true });
    
    cy.wait(3000);
    
    cy.url().should('include', 'neighborhood=CASTELO');
    
    cy.get('[data-testid="pharmacy-card"]', { timeout: 10000 }).should('exist');
    
    cy.log('Adding first pharmacy to favorites');
    
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
      cy.log(`Favorite saved: ${favorites[0]}`);
    });
    
    cy.log('Navigating to favorites page');
    
    cy.contains('a', 'Favoritos').click();
    
    cy.url().should('include', '/favorites');
    
    cy.wait(5000);
    
    cy.log('Verifying pharmacy on favorites page');
    
    cy.get('[data-testid="pharmacy-card"]', { timeout: 15000 }).should('exist');
    
    cy.get('[data-testid="pharmacy-card"]')
      .first()
      .find('[aria-label="Remover dos favoritos"]')
      .should('exist');
  });
});
