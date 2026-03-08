describe('Responsive Layout', () => {
  const waitForCards = () =>
    cy.get('[data-testid="pharmacy-card"]', { timeout: 10000 }).should('exist');

  /**
   * Count grid columns from computed grid-template-columns.
   * Handles both resolved ("350px 350px") and unresolved ("repeat(2, minmax(0, 1fr))") values.
   */
  const expectGridColumns = (selector: string, count: number) => {
    cy.get(selector).then(($el) => {
      const raw = window.getComputedStyle($el[0]).gridTemplateColumns;

      // If resolved to pixel values like "350.5px 350.5px"
      const pxValues = raw.match(/[\d.]+px/g);
      if (pxValues && pxValues.length > 1) {
        expect(pxValues.length).to.eq(count);
        return;
      }

      // If unresolved like "repeat(3, minmax(0, 1fr))" or "repeat(2, minmax(0px, 1fr))"
      const repeatMatch = raw.match(/repeat\((\d+)/);
      if (repeatMatch) {
        expect(Number(repeatMatch[1])).to.eq(count);
        return;
      }

      // Single column: just one value like "343px" or "1fr"
      const tokens = raw.trim().split(/\s+/);
      if (tokens.length === 1) {
        expect(1).to.eq(count);
        return;
      }

      // Fallback: count space-separated pixel values
      expect(tokens.filter((t: string) => /^\d/.test(t)).length || 1).to.eq(count);
    });
  };

  describe('Mobile (375x812)', () => {
    beforeEach(() => {
      cy.viewport(375, 812);
      cy.visit('/');
      waitForCards();
    });

    it('should render header at correct height', () => {
      cy.get('header').should('be.visible').invoke('outerHeight').should('be.lte', 60);
    });

    it('should render filter panel within container bounds', () => {
      cy.get('main').then(($main) => {
        const mainPadding = window.getComputedStyle($main[0]);
        const paddingLeft = parseFloat(mainPadding.paddingLeft);
        const paddingRight = parseFloat(mainPadding.paddingRight);
        expect(paddingLeft + paddingRight).to.be.gte(16);
      });
    });

    it('should render form fields in single column', () => {
      expectGridColumns('.form-grid', 1);
    });

    it('should render pharmacy cards in single column', () => {
      expectGridColumns('.grid-cards', 1);
    });

    it('should not have horizontal overflow', () => {
      cy.document().then((doc) => {
        const body = doc.body;
        expect(body.scrollWidth).to.be.lte(body.clientWidth + 1);
      });
    });

    it('should render footer stacked vertically', () => {
      cy.get('.site-footer-inner')
        .invoke('css', 'flex-direction')
        .should('eq', 'column');
    });

    it('should show navigation buttons in header', () => {
      cy.get('nav[aria-label="Navegação principal"]').should('be.visible');
      cy.get('a[aria-label="Início"]').should('be.visible');
      cy.get('a[aria-label="Favoritos"]').should('be.visible');
    });
  });

  describe('Tablet (768x1024)', () => {
    beforeEach(() => {
      cy.viewport(768, 1024);
      cy.visit('/');
      waitForCards();
    });

    it('should render pharmacy cards in two columns', () => {
      expectGridColumns('.grid-cards', 2);
    });

    it('should render form fields in single column', () => {
      expectGridColumns('.form-grid', 1);
    });

    it('should not have horizontal overflow', () => {
      cy.document().then((doc) => {
        const body = doc.body;
        expect(body.scrollWidth).to.be.lte(body.clientWidth + 1);
      });
    });
  });

  describe('Desktop (1280x720)', () => {
    beforeEach(() => {
      cy.viewport(1280, 720);
      cy.visit('/');
      waitForCards();
    });

    it('should render pharmacy cards in three columns', () => {
      expectGridColumns('.grid-cards', 3);
    });

    it('should render form fields in three columns', () => {
      expectGridColumns('.form-grid', 3);
    });

    it('should constrain content to max-width', () => {
      cy.get('.app-container').first().then(($el) => {
        const width = $el[0].offsetWidth;
        expect(width).to.be.lte(1160);
      });
    });

    it('should render header with navigation text labels', () => {
      cy.get('a[aria-label="Início"]').should('contain.text', 'Início');
      cy.get('a[aria-label="Favoritos"]').should('contain.text', 'Favoritos');
    });
  });

  describe('Favorites page layout', () => {
    beforeEach(() => {
      cy.visit('/');
      waitForCards();
      cy.get('[data-testid="pharmacy-card"]')
        .first()
        .find('[aria-label="Adicionar aos favoritos"]')
        .click();
      cy.get('a[aria-label="Favoritos"]').click();
      cy.url().should('include', '/favorites');
      cy.get('[data-testid="pharmacy-card"]', { timeout: 10000 }).should('exist');
    });

    it('should render cards in single column on mobile', () => {
      cy.viewport(375, 812);
      expectGridColumns('.grid-cards', 1);
    });

    it('should not have horizontal overflow on mobile', () => {
      cy.viewport(375, 812);
      cy.document().then((doc) => {
        const body = doc.body;
        expect(body.scrollWidth).to.be.lte(body.clientWidth + 1);
      });
    });
  });
});
