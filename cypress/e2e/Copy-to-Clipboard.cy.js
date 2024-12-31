describe('Copy to Clipboard Functionality', () => {
  beforeEach(() => {
    // Visit the application
    cy.visit('http://localhost:5210'); // Replace with your app's running URL
    localStorage.clear(); // Clear localStorage to ensure a clean state
  });

  it('should copy the correct data to the clipboard', () => {
    // Enable edit mode and add topics
    cy.get('#edit-mode-toggle').click();
    cy.get('#add-topic').click().click(); // Add two topics

    // Move one topic to "Covered"
    cy.get('#to-cover-list li').first().click();

    // Enter text into notes fields
    cy.get('#customer-background').type('Customer info');
    cy.get('#special-notes').type('Important notes');
    cy.get('#next-steps').type('Next action steps');

    // Click the "Copy" button
    cy.get('#copy-covered').click();

    cy.document().then((doc) => {
      doc.hasFocus() || doc.defaultView.focus(); // Ensure the window is focused
    });
    
    // Access the clipboard using `cy.window()`
    cy.window().then((win) => {
      win.navigator.clipboard.readText().then((clipboardText) => {
        // Verify the content of the clipboard
        expect(clipboardText).to.contain('Topics Covered:');
        expect(clipboardText).to.contain('Topics not covered:');
        expect(clipboardText).to.contain('Customer Background:\nCustomer info');
        expect(clipboardText).to.contain('Special Notes:\nImportant notes');
        expect(clipboardText).to.contain('Next Steps:\nNext action steps');
      });
    });
  });
});
