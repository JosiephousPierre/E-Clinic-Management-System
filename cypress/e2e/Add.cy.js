describe('Add functionality', () => {
    beforeEach(() => {
        cy.visit('http://localhost:5173/');
    });

    it('Add a student', () => {
        // Log in
        cy.get('#username').type('admin1');
        cy.get('#password').type('admin1');
        cy.get('#login-b').click();
        cy.url().should('include', '/home');

        // Navigate to the Manage page
        cy.contains('a', 'Manage').click();
        cy.url().should('include', '/manage');

        // Click the Add button
        cy.contains('button', 'Add').click();

        // Wait for alert message
        cy.on('window:alert', (alertText) => {
            if (alertText.includes('Successfully added')) {

                // Click on the Consultation link
                cy.contains('a', 'Consultation').click();
                // If student is successfully added
                cy.url().should('include', '/consultation');
                
                // Verify if the added student is displayed in the table on the consultation page
                cy.get('.p-datatable-tbody tr').should('have.length.above', 0).then(($rows) => {
                    // Extract the added student's information and verify if it is present in the table
                    const studentId = $rows.first().find('td').eq(0).text().trim();
                    expect(studentId).to.not.be.empty;
                });
            }
            
        });
    });

    it('Handle already added student', () => {
        // Log in
        cy.get('#username').type('admin1');
        cy.get('#password').type('admin1');
        cy.get('#login-b').click();
        cy.url().should('include', '/home');

        // Navigate to the Manage page
        cy.contains('a', 'Manage').click();
        cy.url().should('include', '/manage');

        // Click the Add button
        cy.contains('button', 'Add').click();

        // Wait for alert message
        cy.on('window:alert', (alertText) => {
            if (alertText.includes('Already Added')) {

                // Click on the Consultation link
                cy.contains('a', 'Consultation').click();
                // If student is already added
                cy.url().should('include', '/consultation');
                
                // Verify if the already added student is displayed in the table on the consultation page
                cy.get('.p-datatable-tbody tr').should('have.length.above', 0).then(($rows) => {
                    // Extract the already added student's information and verify if it is present in the table
                    const studentId = $rows.first().find('td').eq(0).text().trim();
                    expect(studentId).to.not.be.empty;
                });
            }
            
        });
    });

    it('Add two different students', () => {
        // Log in
        cy.get('#username').type('admin1');
        cy.get('#password').type('admin1');
        cy.get('#login-b').click();
        cy.url().should('include', '/home');
    
        // Navigate to the Manage page
        cy.contains('a', 'Manage').click();
        cy.url().should('include', '/manage');
    
        // Click the Add button for the first student
        cy.contains('button', 'Add').click();

        // Navigate to the Manage page
        cy.contains('a', 'Manage').click();
        cy.url().should('include', '/manage');
    
        // Click the Add button again for adding the second student
        cy.get('.p-datatable-tbody tr').eq(1).should('not.be.empty').contains('button', 'Add').click();
    
        // Click on the Consultation link
        cy.contains('a', 'Consult').click();
        cy.url().should('include', '/consultation');
    
        // Verify if both students are displayed in the table on the consultation page
        cy.get('.p-datatable-tbody tr').should('have.length', 2).then(($rows) => {
            // Ensure that the first and second rows have been filled with students
            cy.wrap($rows.eq(0).find('td').eq(0)).should('not.be.empty');
            cy.wrap($rows.eq(1).find('td').eq(0)).should('not.be.empty');
        });
    });
    
    
});
