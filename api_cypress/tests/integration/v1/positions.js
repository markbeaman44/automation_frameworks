/// <reference types="cypress" />
import * as helper from '../../support/helpers'

describe('Test satelite positions via API GET requests', () => {
  const statusData = [
    // [id, statusCodes, parameters]
    ['25544', 200, { timestamps: '1436029892' }],
    ['25544', 400, {}],
    ['25543', 404, { timestamps: '1436029892' }]
  ]

  statusData.forEach((data) => {
    const [id, statusCodes, parameters] = data

    it(`Should return ${statusCodes} response status code`, () => {
      cy.getPositionsAPI(id, parameters).then((response) => {
        expect(response.status).to.equal(statusCodes)
      })
    })
  })

  it('Should return response data for specific timestamp', () => {
    cy.getPositionsAPI('25544', { timestamps: '1436029902' }).then((response) => {
      cy.readFile('tests/fixtures/p_ts_1436029902.json').then((jsonResults) => {
        expect(response.body).to.deep.equal(jsonResults)
      })
    })
  })

  const timestamp = []
  for (let i = 1; i <= 10; i++) {
    it(`Should ${i >= 11 ? 'not' : ''} return results for ${i} comma delimited list of timestamps (10 limit)`, () => {
      timestamp.push(`${i}436029902`)

      cy.getPositionsAPI('25544', { timestamps: timestamp.toString() }).then((response) => {
        if (i <= 10) {
          expect(response.status).to.eq(200)
        } else {
          expect(response.status).to.eq(404)
        }

        if (i > 1 && i <= 10) {
          // Validating timestamp responses within list differs from each other
          expect(response.body[i - 2]).to.not.deep.equal(response.body[i - 1])
        }
      })
    })
  }

  const unitsData = [
    // [id, eq, parameterOne, parameterTwo]
    ['25544', 'divide', { timestamps: '1036029892', units: 'miles' }, { timestamps: '1036029892', units: 'kilometers' }],
    ['25544', 'multiply', { timestamps: '1136044729', units: 'kilometers' }, { timestamps: '1136044729', units: 'miles' }]
  ]
  let firstValue

  unitsData.forEach((data) => {
    const [id, eq, parameterOne, parameterTwo] = data

    it(`Should return unit measurement in ${parameterOne.units} & check converted calculations`, () => {
      cy.getPositionsAPI(id, parameterOne).then((response) => {
        firstValue = response.body[0].altitude
        expect(response.body[0].units).to.equal(parameterOne.units)
      })

      cy.getPositionsAPI(id, parameterTwo).then((response) => {
        expect(response.body[0].units).to.equal(parameterTwo.units)
        assert.equal(
          firstValue.toFixed(2),
          helper.calculateValue(eq, response.body[0].altitude).toFixed(2),
          'Miles converts to kilometers (2dp)'
        )
      })
    })
  })
})
