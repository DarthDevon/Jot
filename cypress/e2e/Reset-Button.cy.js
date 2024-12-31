describe('Reset Button Functionality', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5210'); // Replace with your app's running URL
  });

  it('should reset topics and clear notes', () => {
    // Enable Edit Mode, add a topic, and move it to "Covered"
    cy.get('#edit-mode-toggle').click();
    cy.get('#add-topic').click();
    cy.get('#edit-mode-toggle').click();
    cy.get('#to-cover-list li').click(); // Move topic to "Covered"

    // Add text to notes
    cy.get('#customer-background').type('Customer details');
    cy.get('#special-notes').type('Special notes');
    cy.get('#next-steps').type('Next steps');

    // Click the "Reset" button
    cy.get('#reset-topics').click();

    // Verify all topics are moved back to "To Be Covered"
    cy.get('#to-cover-list').children().should('have.length', 1);
    cy.get('#covered-list').children().should('have.length', 0);

    // Verify notes are cleared
    cy.get('#customer-background').should('have.value', '');
    cy.get('#special-notes').should('have.value', '');
    cy.get('#next-steps').should('have.value', '');
  });
});
