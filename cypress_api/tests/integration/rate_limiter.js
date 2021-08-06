/// <reference types="cypress" />

describe('Test Rate Limiter via API GET requests', () => {
  it('Validate rate limiter (350 requests within 5 mins)', () => {
    // Loops through until 0 remaining status = 200
    // next request after status = 429
    countLimiter()
  })

  function countLimiter () {
    cy.getPositionsAPI('25544', { timestamps: '1436029902' }).then((response) => {
      if (Number(response.status) === 429 && Number(response.headers['x-rate-limit-remaining']) === 0) {
        expect(response.status).to.equal(429)
        return
      } else {
        cy.log('Limit remaining: ' + response.headers['x-rate-limit-remaining'])
        expect(response.status).to.equal(200)
      }
      countLimiter()
    })
  }
})
