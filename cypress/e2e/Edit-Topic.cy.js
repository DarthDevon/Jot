describe('Editing Topics Functionality', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5210'); // Replace with your app's running URL
  });

  it('should allow editing of a topic in Edit Mode', () => {
    // Enable Edit Mode
    cy.get('#edit-mode-toggle').click();

    // Add a topic
    cy.get('#add-topic').click();

    // Verify the topic is editable and update its content
    cy.get('.editable-topic')
      .should('have.attr', 'contenteditable', 'true')
      .clear()
      .type('Updated Topic');

    // Exit Edit Mode
    cy.get('#edit-mode-toggle').click();

    // Verify the topic retains the updated content
    cy.get('.editable-topic').should('contain.text', 'Updated Topic');
  });
});
