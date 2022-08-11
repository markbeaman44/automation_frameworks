/// <reference types="cypress" />

describe('Test satelite TLE data via API GET requests', () => {
  const statusData = [
    // [id, statusCodes, parameters]
    ['25544', 200, { format: 'json' }],
    ['25544', 200, { format: 'text' }],
    ['25543', 404, { format: 'json' }]
  ]

  statusData.forEach((data) => {
    const [id, statusCodes, parameters] = data

    it(`Should return ${statusCodes} response status code`, () => {
      cy.getTlesAPI(id, parameters).then((response) => {
        expect(response.status).to.equal(statusCodes)
      })
    })
  })

  const formatData = [
    // [id, parameters, contentType]
    ['25544', { format: 'json' }, 'application/json'],
    ['25544', { format: 'text' }, 'text/plain']
  ]

  formatData.forEach((data) => {
    const [id, parameters, contentType] = data

    it(`Should return content-type with format ${parameters.format}`, () => {
      cy.getTlesAPI(id, parameters).then((response) => {
        expect(response.headers['content-type']).to.equal(contentType)
      })
    })
  })
})
