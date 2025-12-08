describe('Filtrar e Favoritar Farmácia', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.wait(3000); // Aguarda carregamento inicial
  });

  it('deve filtrar por bairro Castelo, favoritar uma farmácia e visualizar na página de favoritos', () => {
    // Verifica que a página carregou
    cy.get('[data-testid="pharmacy-card"]', { timeout: 10000 }).should('exist');
    
    // Passo 1: Filtrar por bairro Castelo
    cy.log('Filtrando por bairro Castelo');
    
    // Aguarda o select de bairro estar habilitado
    cy.get('[data-testid="neighborhood-select"]', { timeout: 10000 }).should('not.be.disabled');
    
    // Clica no select de bairro
    cy.get('[data-testid="neighborhood-select"]').click();
    
    // Aguarda e seleciona Castelo
    cy.get('li[role="option"]').contains('CASTELO').click({ force: true });
    
    // Aguarda o carregamento das farmácias filtradas
    cy.wait(3000);
    
    // Verifica que a URL foi atualizada com o filtro
    cy.url().should('include', 'neighborhood=CASTELO');
    
    // Verifica que há farmácias no resultado
    cy.get('[data-testid="pharmacy-card"]', { timeout: 10000 }).should('exist');
    
    // Passo 2: Favoritar a primeira farmácia
    cy.log('Favoritando primeira farmácia');
    
    // Clica no botão de favoritar
    cy.get('[data-testid="pharmacy-card"]')
      .first()
      .find('[aria-label="Adicionar aos favoritos"]')
      .click();
    
    // Verifica que o ícone mudou para favorito preenchido
    cy.get('[data-testid="pharmacy-card"]')
      .first()
      .find('[aria-label="Remover dos favoritos"]')
      .should('exist');
    
    // Verifica que foi salvo no localStorage
    cy.window().then((win) => {
      const favorites = JSON.parse(win.localStorage.getItem('farmacia-popular-favorites') || '[]');
      expect(favorites).to.have.length.at.least(1);
      cy.log(`Favorito salvo: ${favorites[0]}`);
    });
    
    // Passo 3: Navegar para página de favoritos
    cy.log('Navegando para página de favoritos');
    
    // Clica no link de favoritos no header
    cy.contains('a', 'Favoritos').click();
    
    // Verifica que está na página de favoritos
    cy.url().should('include', '/favorites');
    
    // Aguarda o carregamento
    cy.wait(5000);
    
    // Passo 4: Verificar que a farmácia favoritada está na lista
    cy.log('Verificando farmácia na página de favoritos');
    
    // Verifica que há pelo menos uma farmácia
    cy.get('[data-testid="pharmacy-card"]', { timeout: 15000 }).should('exist');
    
    // Verifica que o botão de remover favorito está presente
    cy.get('[data-testid="pharmacy-card"]')
      .first()
      .find('[aria-label="Remover dos favoritos"]')
      .should('exist');
  });
});
