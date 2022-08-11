Cypress.Commands.add('getTlesAPI', (id, parameters) => {
  cy.request({
    failOnStatusCode: false,
    method: 'GET',
    url: `/v1/satellites/${id}/tles`,
    qs: parameters
  })
})
