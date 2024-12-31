describe('Toggle Edit Mode Functionality', () => {
  beforeEach(() => {
    // Visit the application
    cy.visit('http://localhost:5210'); // Replace with your app's running URL
  });

  it('should enable and disable edit mode correctly', () => {
    // Verify initial state (edit mode disabled)
    cy.get('#add-topic').should('not.be.visible');
   
    
    cy.get('#edit-mode-toggle').should('contain.text', 'Edit Mode');

    // Enable edit mode
    cy.get('#edit-mode-toggle').click();

    // Verify state when edit mode is enabled
    cy.get('#add-topic').should('be.visible');
    
    
    cy.get('#edit-mode-toggle').should('contain.text', 'Save');

    // Disable edit mode again
    cy.get('#edit-mode-toggle').click();

    // Verify state when edit mode is disabled
    cy.get('#add-topic').should('not.be.visible');
    
    cy.get('#edit-mode-toggle').should('contain.text', 'Edit Mode');
  });
});
 