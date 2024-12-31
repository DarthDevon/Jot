describe('template spec', () => {
  beforeEach(() => {
    // Visit the application before each test
    cy.visit('http://localhost:5210'); // Replace with your actual URL
  });
  
  it('should save notes and reload them', () => {
    cy.get('#customer-background').type('Customer details');
    cy.get('#special-notes').type('Important notes');
    cy.reload();
    cy.get('#customer-background').should('have.value', 'Customer details');
    cy.get('#special-notes').should('have.value', 'Important notes');
});

})