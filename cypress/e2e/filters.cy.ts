describe('Filters', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.wait(3000);
  });

  it('should load initial page with default filters', () => {
    cy.get('[data-testid="state-select"]').should('exist');
    cy.get('[data-testid="city-select"]').should('exist');
    cy.get('[data-testid="neighborhood-select"]').should('exist');
    
    cy.get('[data-testid="pharmacy-card"]', { timeout: 10000 }).should('exist');
  });

  it('should filter by neighborhood', () => {
    cy.wait(2000);
    
    cy.get('[data-testid="neighborhood-select"]').should('not.be.disabled');
    cy.get('[data-testid="neighborhood-select"]').click();
    cy.get('li[role="option"]').not(':contains("Todos os bairros")').first().click();
    
    cy.wait(2000);
    
    cy.url().should('include', 'neighborhood=');
    
    cy.get('[data-testid="pharmacy-card"]', { timeout: 10000 }).should('exist');
  });

  it('should clear neighborhood filter', () => {
    cy.wait(2000);
    cy.get('[data-testid="neighborhood-select"]').should('not.be.disabled');
    cy.get('[data-testid="neighborhood-select"]').click();
    cy.get('li[role="option"]').not(':contains("Todos os bairros")').first().click();
    cy.wait(1000);
    
    cy.get('[data-testid="clear-neighborhood"]', { timeout: 5000 }).should('exist');
    
    cy.get('[data-testid="clear-neighborhood"]').click();
    
    cy.wait(1000);
    
    cy.url().should('not.include', 'neighborhood=');
  });

  it('should display pharmacies after applying filters', () => {
    cy.wait(2000);
    cy.get('[data-testid="neighborhood-select"]').should('not.be.disabled');
    cy.get('[data-testid="neighborhood-select"]').click();
    cy.get('li[role="option"]').not(':contains("Todos os bairros")').first().click();
    
    cy.wait(2000);
    
    cy.get('[data-testid="pharmacy-card"]', { timeout: 10000 }).should('exist');
  });
});
