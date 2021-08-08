Cypress.Commands.add('getPositionsAPI', (id, parameters) => {
  cy.request({
    failOnStatusCode: false,
    method: 'GET',
    url: `/v1/satellites/${id}/positions`,
    qs: parameters
  })
})
