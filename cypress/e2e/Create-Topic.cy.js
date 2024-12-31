describe('Create Topic Test', () => {
  beforeEach(() => {
    // Visit the application before each test
    cy.visit('http://localhost:5210'); // Replace with your actual URL
  });

  it('should add a new topic to the "Topics to Cover" list', () => {
    // Enable edit mode by clicking the "Edit Mode" toggle
    cy.get('#edit-mode-toggle').click();

    // Confirm that the "Add Topic" button is now visible
    cy.get('#add-topic').should('be.visible');

    // Click the "Add Topic" button
    cy.get('#add-topic').click();

    // Verify that a new topic is added to the list
    cy.get('#to-cover-list')
      .children()
      .should('have.length', 1)
      .and('contain.text', 'New Topic');
  });
});
