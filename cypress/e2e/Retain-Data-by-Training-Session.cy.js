describe('Retention of Entered Data by Training Session', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5210'); // Replace with your app's running URL
  });

  it('should retain data specific to each training session', () => {
    // Enable Edit Mode and add a topic in Session 1
    cy.get('#edit-mode-toggle').click();
    cy.get('#add-topic').click();
    cy.get('.editable-topic').type('Session 1 Topic');

    // Save Session 1 data by switching to Session 2
    cy.get('.session-btn[data-session="2"]').click();

    // Verify Session 2 starts empty
    cy.get('#to-cover-list').children().should('have.length', 0);


    // Return to Session 1 and verify its data
    cy.get('.session-btn[data-session="1"]').click();
    cy.get('#to-cover-list')
      .children()
      .should('have.length', 1)
      .and('contain.text', 'Session 1 Topic');
  });
});
