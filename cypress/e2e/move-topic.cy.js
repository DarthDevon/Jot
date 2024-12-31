describe('Moving Topics Between Lists', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5210'); // Replace with your app's running URL
  });

  it('should move topics between "To Be Covered" and "Covered" lists', () => {
    // Enable Edit Mode and add a topic
    cy.get('#edit-mode-toggle').click();
    cy.get('#add-topic').click();
    cy.get('#edit-mode-toggle').click();

    // Move the topic to "Covered"
    cy.get('#to-cover-list li').click();
    cy.get('#covered-list')
      .children()
      .should('have.length', 1)
      .and('contain.text', 'New Topic');
    cy.get('#to-cover-list').children().should('have.length', 0);

    // Move the topic back to "To Be Covered"
    cy.get('#covered-list li').click();
    cy.get('#to-cover-list')
      .children()
      .should('have.length', 1)
      .and('contain.text', 'New Topic');
    cy.get('#covered-list').children().should('have.length', 0);
  });
});
